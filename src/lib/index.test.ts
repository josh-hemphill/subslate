import { describe, expect, it, vi } from 'vitest';
import { subslate } from './index.ts';
import type { SanitizerOptions, StartStopPairs } from './typing.ts';

describe('subslate()', () => {
	it('Performs basic replacement', () => {
		const result = subslate('${x}', { x: 'hello' }, {});
		expect(result).toBe('hello');
	});
	it('Allows no 3rd arg', () => {
		const result = subslate('${x}', { x: 'hello' });
		expect(result).toBe('hello');
	});
	it('Replaces multiple', () => {
		const result = subslate('${x} world, ${y}', { x: 'hello', y: 'hi' }, {});
		expect(result).toBe('hello world, hi');
	});
	it('Replaces multiple with overlapping names', () => {
		const result = subslate('${x} world, ${xy}', { x: 'hello', xy: 'hi' }, {});
		expect(result).toBe('hello world, hi');
	});
	it('Replaces deeply object paths', () => {
		const result = subslate('${x["y"].0.z} world', { x: { y: [{ z: 'hello' }] } }, {});
		expect(result).toBe('hello world');
	});
	it('Handles empty path', () => {
		const result = subslate('${} world', {}, {});
		expect(result).toBe('undefined world');
	});
	it('Misses on oversized path', () => {
		const result = subslate('${hi} world', { hi: 'hi' }, { maxNameLength: 1 });
		expect(result).toBe('${hi} world');
	});
	it('Misses on mis-matched pairs', () => {
		const startStopPairs: StartStopPairs = [
			['${', '}'],
			['$[', ']'],
		];
		const result = subslate('${hi] world', { hi: 'hi' }, { startStopPairs });
		expect(result).toBe('${hi] world');
	});
	it('Throws on invalid pairs', () => {
		const getResult = () => {
			// @ts-expect-error Malformed input from JavaScript.
			return subslate('${hi] world', { hi: 'hi' }, { startStopPairs: [['}']] });
		};
		expect(getResult).toThrow('Invalid startStopPairs');
	});
	it('Permits single string, duplicates value for pair', () => {
		const startStopPairs: StartStopPairs = '|';
		const result = subslate('|hi| world', { hi: 'hello' }, { startStopPairs });
		expect(result).toBe('hello world');
	});
	it('Permits single mixed string and pairs', () => {
		const startStopPairs = ['|', ['${', '}']] as const satisfies StartStopPairs;
		const result = subslate('|hi| ${hi2}', { hi: 'hello', hi2: 'world' }, { startStopPairs });
		expect(result).toBe('hello world');
	});
	it('Allows single pair', () => {
		const startStopPairs: StartStopPairs = ['${', '}'];
		const result = subslate('${hi} world', { hi: 'hello' }, { startStopPairs });
		expect(result).toBe('hello world');
	});
	it('Replaces multiple start-stop pair types', () => {
		const startStopPairs: StartStopPairs = [
			['${', '}'],
			['$[', ']'],
		];
		const result = subslate(
			'${hi} world, $[hello]',
			{ hi: 'hello', hello: 'hi' },
			{ startStopPairs },
		);
		expect(result).toBe('hello world, hi');
	});
	it('Uses cache for subsequent matches', () => {
		const sanitizer = vi.fn(({ value }: SanitizerOptions) => String(value));
		const result = subslate(
			'${x} world, ${x}',
			{ x: 'hello' },
			{
				sanitizer,
			},
		);
		expect(sanitizer).toHaveBeenCalledTimes(1);
		expect(result).toBe('hello world, hello');
	});

	it('preserves Unicode before and between placeholders', () => {
		expect(subslate('😀 ${x}', { x: 'hello' })).toBe('😀 hello');
		expect(subslate('${x} ${y}', { x: '😀', y: 'hello' })).toBe('😀 hello');
	});

	it('renders interleaved placeholders in source order and caches by path', () => {
		const sanitizer = vi.fn(({ value }: SanitizerOptions) => String(value));

		expect(
			subslate(
				'${x} ${y} ${x} |x|',
				{ x: 'expanded', y: 'B' },
				{
					startStopPairs: [['${', '}'], '|'],
					sanitizer,
				},
			),
		).toBe('expanded B expanded expanded');
		expect(sanitizer.mock.calls.map(([value]) => value.id)).toEqual(['x', 'y']);
	});

	it('preserves the result for missing and partially resolved paths', () => {
		expect(subslate('${missing} ${x.missing}', { x: 'value' })).toBe('undefined value');
	});
});
