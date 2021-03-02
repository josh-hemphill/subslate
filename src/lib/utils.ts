import type { strPairs, obj } from './typing';

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
const isStrArr = (v: unknown): v is string[] => isNonEmptyArray(v) && v.every(x => typeof x === 'string');
const isStrPair = (v: unknown): v is strPairs => isStrArr(v) && v.length === 2;
const isArrStrArr = (v: unknown): v is strPairs[] => isNonEmptyArray(v) && v.every(x => isStrPair(x));
const isMixedStrArr = (v: unknown): v is (strPairs | string)[] => isNonEmptyArray(v) && v.every(x => isStrPair(x) || typeof x === 'string');
export const defaulted = (v: unknown,d: strPairs,errMsg='Missing Provided Input'): strPairs[] => {
	if (typeof v === 'undefined') return [d];
	if (typeof v === 'string') return [[v,v]];
	if (isStrPair(v)) return [v];
	if (isStrArr(v)) return v.map(x => [x,x]);
	if (isArrStrArr(v)) return v;
	if (isMixedStrArr(v)) return v.map(x => isStrPair(x) ? x : [x,x]);
	throw Error(errMsg);
};
export function escapeRegExp(text:string): string {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
export function regReset(reg: RegExp): void {
	reg.lastIndex = 0;
}
export const isObj = (obj: unknown): obj is obj => !!obj && typeof obj === 'object' && obj !== null && Object.keys(obj).every(v => typeof v !== 'symbol');


// eslint-disable-next-line @typescript-eslint/ban-types
export function hasOwnProperty<X extends object, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
	return Object.prototype.hasOwnProperty.call(obj,prop);
}
