import ts from '@wessberg/rollup-plugin-ts';

import { getBabelInputPlugin } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import clear from 'rollup-plugin-clear';
const dist = './dist/';
const input = 'src/lib/index.ts';

const babeledOut = getBabelInputPlugin({
	babelHelpers: 'bundled',
	presets: [
		[
			'@babel/preset-env',
			{
				corejs: 3,
				useBuiltIns: 'usage',
				'forceAllTransforms': true,
				spec: true,
				targets: '> 0.25%, not dead',
			},
		],
	],
});
const out = (format) => ({
	format,
	exports: 'auto',
	sourcemap: true,
});

export default [
	{
		input,
		plugins:[
			clear({ targets: ['dist'] }),
			ts({
				transpiler: 'babel',
				include: ['src/lib/**/*.[tj]s'],
				transpileOnly:true,
				browserslist: false,
				tsconfig: 'tsconfig.json',
				tsconfigOverride: {
					'exclude': [
						'**/*.test.*',
					],
					compilerOptions: {
						rootDir: './src/lib',
					},
					declarationDir: './dist',
				},
			}),
		],
		output: [
			{
				plugins: [terser()],
				file: `${dist}subslate.cjs.js`,
				exports: 'named',
				...out('cjs'),
			},
			{
				plugins: [terser()],
				file: `${dist}subslate.cjs`,
				exports: 'named',
				...out('cjs'),
			},
			{
				plugins: [terser()],
				file: `${dist}subslate.esm.js`,
				exports: 'auto',
				...out('es'),
			},
			{
				plugins: [terser()],
				file: `${dist}subslate.mjs`,
				exports: 'auto',
				...out('es'),
			},
			{
				plugins: [terser()],
				name: 'subslate',
				file: `${dist}subslate.js`,
				exports: 'default',
				extend: true,
				...out('umd'),
			},
		],
	},
	{
		input,
		plugins:[
			ts({
				transpiler: 'babel',
				include: ['src/lib/**/*.[tj]s'],
				transpileOnly:true,
				browserslist: false,
				tsconfig: 'tsconfig.json',
				tsconfigOverride: {
					compilerOptions: {
						rootDir: './src/lib',
					},
					declarationDir: './dist',
				},
			}),
			babeledOut,
		],
		output: [
			{
				plugins: [terser()],
				file: `${dist}subslate.poly.esm.js`,
				exports: 'default',
				...out('es'),
			},
			{
				plugins: [terser()],
				exports: 'default',
				name: 'subslate',
				file: `${dist}subslate.poly.js`,
				extend: true,
				...out('umd'),
			},
			{
				plugins: [terser()],
				exports: 'default',
				name: 'subslate',
				file: `${dist}subslate.poly.iife.js`,
				extend: true,
				...out('iife'),
			},
		],
	},
];
