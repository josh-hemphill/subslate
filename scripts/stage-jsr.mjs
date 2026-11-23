import { copyFile, cp, mkdir, readFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';

const destination = process.argv[2];
if (!destination) throw new Error('Usage: node scripts/stage-jsr.mjs <new staging directory>');

const npm = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const jsr = JSON.parse(await readFile(new URL('../jsr.json', import.meta.url), 'utf8'));
if (npm.version !== jsr.version)
	throw new Error('package.json and jsr.json must use the same version.');

const stage = resolve(destination);
await mkdir(dirname(stage), { recursive: true });
await mkdir(stage);
for (const file of ['jsr.json', 'README.md', 'LICENSE']) {
	await copyFile(new URL(`../${file}`, import.meta.url), join(stage, file));
}
await cp(new URL('../src/', import.meta.url), join(stage, 'src'), {
	recursive: true,
	filter: (source) => !source.endsWith('.test.ts') && basename(source) !== 'test-utils.ts',
});
