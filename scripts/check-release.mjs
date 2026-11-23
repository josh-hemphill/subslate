import { createHash } from 'node:crypto';
import { appendFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const [registry, tarball] = process.argv.slice(2);
const npm = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const jsr = JSON.parse(await readFile(new URL('../jsr.json', import.meta.url), 'utf8'));
const { version } = npm;
if (version !== jsr.version || process.env.GITHUB_REF_NAME !== `v${version}`) {
	throw new Error('The Git tag and the npm and JSR manifest versions must agree.');
}

const output = { version };
if (registry === 'npm' && tarball) {
	const archive = resolve(tarball);
	const url = `https://registry.npmjs.org/${npm.name}/${version}`;
	const published = await lookup(url);
	if (published) {
		const integrity =
			'sha512-' +
			createHash('sha512')
				.update(await readFile(archive))
				.digest('base64');
		if (published.dist.integrity !== integrity)
			throw new Error(`npm version ${version} has different contents.`);
	}
	output.published = Boolean(published);
	output.tarball = archive;
	output['dist-tag'] = version.includes('-') ? 'beta' : 'latest';
} else if (registry === 'jsr') {
	output.published = Boolean(await lookup(`https://jsr.io/${jsr.name}/${version}_meta.json`));
} else {
	throw new Error('Usage: node scripts/check-release.mjs <npm|jsr> [npm tarball]');
}

if (process.env.GITHUB_OUTPUT) {
	await appendFile(
		process.env.GITHUB_OUTPUT,
		Object.entries(output)
			.map(([key, value]) => `${key}=${value}\n`)
			.join(''),
	);
}
console.log(output);

async function lookup(url) {
	const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
	if (response.status === 404) return null;
	if (!response.ok) throw new Error(`Registry lookup failed with ${response.status} at ${url}.`);
	return response.json();
}
