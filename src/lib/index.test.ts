import { subslate } from './index';
import { strPairs } from './typing';

describe('subslate()',()=> {
	it('Performs basic replacement',() => {
		const result = subslate('${x}',{x:'hello'},{});
		expect(result).toBe('hello');
	});
	it('Replaces multiple',() => {
		const result = subslate('${x} world, ${y}',{x:'hello',y:'hi'},{});
		expect(result).toBe('hello world, hi');
	});
	it('Replaces deeply object paths',() => {
		const result = subslate('${x["y"].0.z} world',{x:{y:[{z:'hello'}]}},{});
		expect(result).toBe('hello world');
	});
	it('Handles empty path',() => {
		const result = subslate('${} world',{},{});
		expect(result).toBe('undefined world');
	});
	it('Misses on oversized path',() => {
		const result = subslate('${hi} world',{hi:'hi'},{maxNameLength: 1});
		expect(result).toBe('${hi} world');
	});
	it('Misses on mis-matched pairs',() => {
		const startStopPairs: strPairs[] = [['${','}'],['$[',']']];
		const result = subslate('${hi] world',{hi:'hi'},{startStopPairs});
		expect(result).toBe('${hi] world');
	});
	it('Throws on invalid pairs',() => {
		// @ts-ignore
		const startStopPairs: strPairs = ['}'];
		const getResult = () => subslate('${hi] world',{hi:'hi'},{startStopPairs});
		expect(getResult).toThrow('Invalid startStopPairs');
	});
	it('Permits single string, duplicates value for pair',() => {
		// @ts-ignore
		const startStopPairs: strPairs = '|';
		const result =  subslate('|hi| world',{hi:'hello'},{startStopPairs});
		expect(result).toBe('hello world');
	});
	it('Allows single pair',() => {
		const startStopPairs: strPairs = ['${','}'];
		const result =  subslate('${hi} world',{hi:'hello'},{startStopPairs});
		expect(result).toBe('hello world');
	});
	it('Replaces multiple start-stop pair types',() => {
		const startStopPairs: strPairs[] = [['${','}'],['$[',']']];
		const result = subslate(
			'${hi} world, $[hello]',
			{hi:'hello',hello:'hi'},
			{startStopPairs},
		);
		expect(result).toBe('hello world, hi');
	});
	it('Uses cache for subsequent matches',() => {
		const sanitizer = jest.fn((v) =>
			v.isEmpty === true ? 'undefined' : String(v.value));
		const result = subslate('${x} world, ${x}',{x:'hello'},{
			sanitizer,
		});
		expect(sanitizer).toBeCalledTimes(1);
		expect(result).toBe('hello world, hello');
	});
});
