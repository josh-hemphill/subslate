import { execFileSync } from 'node:child_process';
import { copyFile, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const version = process.argv[2];
if (!version) throw new Error('Usage: node scripts/smoke-jsr.mjs <published version>');
const name = '@josh-hemphill/subslate';
const alias = '@jsr/josh-hemphill__subslate';
const tsc = fileURLToPath(new URL('../node_modules/typescript/bin/tsc', import.meta.url));

for (const [manager, source] of [
	['pnpm', `jsr:${name}@${version}`],
	['npm', `${name}@npm:${alias}@${version}`],
]) {
	const fixture = await mkdtemp(join(tmpdir(), 'subslate-jsr-consumer-'));
	try {
		await writeFile(join(fixture, 'package.json'), '{"private":true,"type":"module"}\n');
		await writeFile(join(fixture, '.npmrc'), '@jsr:registry=https://npm.jsr.io\n');
		await copyFile(new URL('../test/consumer/jsr.mjs', import.meta.url), join(fixture, 'test.mjs'));
		await copyFile(
			new URL('../test/consumer/jsr-types.mts', import.meta.url),
			join(fixture, 'types.mts'),
		);
		const options = { cwd: fixture, stdio: 'inherit' };
		for (let attempt = 1; ; attempt++) {
			try {
				execFileSync(manager, ['add', source, '--ignore-scripts'], options);
				break;
			} catch (error) {
				if (attempt === 4) throw error;
				await setTimeout(5_000);
			}
		}
		execFileSync(process.execPath, ['test.mjs'], options);
		execFileSync(
			process.execPath,
			[tsc, '--strict', '--noEmit', '--module', 'NodeNext', 'types.mts'],
			options,
		);
	} finally {
		await rm(fixture, { recursive: true, force: true });
	}
}
