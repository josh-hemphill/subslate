import { rm } from 'node:fs/promises';
import { rolldown } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';

await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });

const library = await rolldown({ input: 'src/index.ts', platform: 'neutral' });
try {
	await library.write({
		file: 'dist/subslate.esm.js',
		format: 'esm',
		minify: true,
		sourcemap: true,
	});
	await library.write({
		file: 'dist/subslate.js',
		format: 'iife',
		name: 'subslate',
		exports: 'named',
		extend: true,
		minify: true,
		sourcemap: true,
	});
} finally {
	await library.close();
}

const declarations = await rolldown({
	input: { subslate: 'src/index.ts' },
	platform: 'neutral',
	plugins: [
		dts({ generator: 'tsc', dtsOnly: true, tsconfigRaw: { compilerOptions: { noEmit: false } } }),
	],
});
try {
	await declarations.write({ dir: 'dist', format: 'esm' });
} finally {
	await declarations.close();
}
