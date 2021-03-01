import type { ContextOptions, cacheObj, obj, separators } from './typing';
import { escapeRegExp, isObj } from './utils';

const isBlank = Symbol('Blank Value');
export class Context {
	context: obj;
	constructor(context: obj){
		this.context = context;
	}
	getContextVal(item: cacheObj,separators: separators, options:ContextOptions):string {
		const id = item.content;
		const con = this.context;
		const {allowRootBracket,allowUnquotedProps,sanitizer} =options;
		const {per,opBracket,clBracket,quote,apostrophe,backtick} = separators;
		const quotes = [quote,apostrophe,backtick].flat().filter(v => id?.includes(v)).map(v => escapeRegExp(v));

		function getRelative(funId: string, localContext: obj, startIndex = 0): [symbol|unknown,number]{
			let result: unknown = isBlank;
			let foundLength = 0;
			const base = Object.keys(localContext);
			FindRoot: {
				if (startIndex === 0) {
					for (const rootKey of base) {
						if (funId.startsWith(rootKey,startIndex)) {
							result = localContext[rootKey];
							foundLength = rootKey.length;
							break FindRoot;
						}
					}
				}
				if (startIndex !== 0) {
					for (const period of per) {
						if (funId.startsWith(period,startIndex)) {
							for (const rootKey of base) {
								if (funId.startsWith(period + rootKey,startIndex)) {
									result = localContext[rootKey];
									foundLength = period.length + rootKey.length;
									break FindRoot;
								}
							}
						}
					}
				}
				if (startIndex !== 0 || allowRootBracket) {
					const filteredBrackets = opBracket.map((v,i) => [v,clBracket[i]]).filter(v => funId.includes(v[0]) && funId.includes(v[1]));
					let currentBrackets: [string,string] | null = null;
					for (const [open, close] of filteredBrackets) {
						if (funId.startsWith(open,startIndex)) {
							currentBrackets = [open, close];
							break;
						}
					}
					if (currentBrackets === null) break FindRoot;
					const [open, close] = currentBrackets.map(v => escapeRegExp(v));
					for (const quote of [...quotes,...(allowUnquotedProps ? [''] : [])]) {
						for (const rk of base) {
							const rootKey = escapeRegExp(rk);
							const getInnerReg = RegExp(`^[\\s\\S]{${startIndex}}(${open}\\s*${quote}(${rootKey})${quote}\\s*${close})`);
							getInnerReg.lastIndex = startIndex;
							const match = getInnerReg.exec(id);
							if (match && match[2]) {
								result = localContext[rk];
								foundLength = match[1].length;
								break FindRoot;
							}
						}
					}
				}
			}
			return [result,foundLength];
		}
		let finResult: typeof isBlank | unknown = isBlank;

		let curInd = 0;
		for (;id?.length > curInd;) {
			const localContext: obj | unknown = finResult === isBlank ? con : finResult;
			if (!isObj(localContext)) break;
			const [newFinResult,foundLength] = getRelative(id,localContext,curInd);
			if (foundLength === 0) break;
			curInd += foundLength;
			finResult = newFinResult;
		}

		if (finResult === isBlank) {
			finResult = sanitizer({
				isEmpty: true,
				id,
				at: curInd,
			});
		} else {
			finResult = sanitizer({
				isEmpty: false,
				value: finResult,
				id,
			});
		}
		if (typeof finResult !== 'string') throw Error('Sanitizer did not provide string');
		return finResult;
	}
}

