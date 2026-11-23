import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { once } from 'node:events';
import { cp, mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const [tarball, mode] = process.argv.slice(2);
if (!tarball || (mode !== undefined && mode !== '--node-only')) {
	throw new Error('Usage: node scripts/smoke.mjs <npm tarball> [--node-only]');
}

const fixture = await mkdtemp(join(tmpdir(), 'subslate-consumer-'));
try {
	await cp(new URL('../test/consumer/', import.meta.url), fixture, { recursive: true });
	const options = { cwd: fixture, stdio: 'inherit' };
	execFileSync(
		'npm',
		[
			'install',
			'--offline',
			'--ignore-scripts',
			'--no-audit',
			'--no-fund',
			'--no-package-lock',
			resolve(tarball),
		],
		options,
	);
	execFileSync(process.execPath, ['node.mjs'], options);
	console.log(`Node ${process.version} consumed the packed ESM package.`);

	if (mode !== '--node-only') {
		const tsc = fileURLToPath(new URL('../node_modules/typescript/bin/tsc', import.meta.url));
		for (const [module, resolution] of [
			['NodeNext', 'NodeNext'],
			['ESNext', 'Bundler'],
		]) {
			execFileSync(
				process.execPath,
				[
					tsc,
					'--strict',
					'--noEmit',
					'--module',
					module,
					'--moduleResolution',
					resolution,
					'types.mts',
				],
				options,
			);
		}
		await checkBrowser(fixture);
	}
} finally {
	await rm(fixture, { recursive: true, force: true });
}

async function checkBrowser(root) {
	const { build } = await import('vite');
	const { chromium } = await import('playwright');
	await build({
		root,
		base: './',
		configFile: false,
		build: { outDir: 'vite-dist' },
		logLevel: 'warn',
	});

	const server = createServer(async (request, response) => {
		try {
			const pathname = new URL(request.url, 'http://localhost').pathname;
			const path = resolve(root, `.${pathname}`);
			if (!path.startsWith(root + sep)) {
				response.writeHead(404).end();
				return;
			}
			const file = await readFile(path);
			response.setHeader(
				'Content-Type',
				extname(path) === '.html' ? 'text/html; charset=utf-8' : 'text/javascript',
			);
			response.end(file);
		} catch {
			response.writeHead(404).end();
		}
	});
	server.listen(0, '127.0.0.1');
	try {
		await once(server, 'listening');
		const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
		try {
			const page = await browser.newPage();
			for (const route of ['/browser.html', '/vite-dist/index.html']) {
				const response = await page.goto(`http://127.0.0.1:${server.address().port}${route}`);
				assert.equal(response?.status(), 200);
				await page.getByText('hello world', { exact: true }).waitFor({ timeout: 5_000 });
			}
		} finally {
			await browser.close();
		}
	} finally {
		server.close();
	}
	console.log(
		'TypeScript NodeNext, TypeScript Bundler, Chromium, and the production Vite bundle passed.',
	);
}
