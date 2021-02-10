import { strPairs } from './typing';

export function iter<F extends(...args:unknown[])=>ReturnType<F>>(fn: F, inputs: unknown[],endFn?: CallableFunction): Iterable<ReturnType<F>> {return {
	[Symbol.iterator]() {return {
		next() {
			const result = fn(...inputs);
			if (result) {
				return {done: false, value: result};
			}
			if (endFn) endFn();
			return {done: true, value: undefined};
		},
	};},
};}
const isNonEmptyArray = (v: unknown): v is unknown[] => Array.isArray(v) && v.length > 0;
const isStrArr = (v: unknown): v is strPairs => isNonEmptyArray(v) && v.length === 2 && v.every(x => typeof x === 'string');
const isArrStrArr = (v: unknown): v is strPairs[] => isNonEmptyArray(v) && v.every(x => isStrArr(x));
export const defaulted = (v: unknown,d: strPairs,errMsg='Missing Provided Input'): strPairs[] => {
	if (typeof v === 'undefined') return [d];
	if (typeof v === 'string') return [[v,v]];
	if (isStrArr(v)) return [v];
	if (isArrStrArr(v)) return v;
	throw Error(errMsg);
};
export function escapeRegExp(text:string): string {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
export function regReset(reg: RegExp): void {
	reg.lastIndex = 0;
}

