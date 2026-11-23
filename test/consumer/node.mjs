import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import format, { createEscapes, getDefaultOptions, getSeparators, subslate } from 'subslate';

assert.equal(format, subslate);
assert.equal(subslate('😀 ${x} ${y} ${x}', { x: 'expanded', y: 'B' }), '😀 expanded B expanded');
assert.equal(subslate('|x|', { x: 'ok' }, { startStopPairs: '|' }), 'ok');
assert.deepEqual(createEscapes('.', {}), []);
assert.deepEqual(getSeparators(false).per, ['.']);
assert.equal(getDefaultOptions({}).maxNameLength, 256);

const packageRoot = new URL('../', import.meta.resolve('subslate'));
const manifest = JSON.parse(await readFile(new URL('package.json', packageRoot), 'utf8'));
assert.equal(manifest.type, 'module');
assert.deepEqual(manifest.exports['.'], {
	types: './dist/subslate.d.ts',
	default: './dist/subslate.esm.js',
});
assert.deepEqual(manifest.dependencies ?? {}, {});
assert.deepEqual((await readdir(new URL('dist/', packageRoot))).sort(), [
	'subslate.d.ts',
	'subslate.esm.js',
	'subslate.esm.js.map',
	'subslate.js',
	'subslate.js.map',
]);
