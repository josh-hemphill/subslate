import { ContextOptions, cacheObj } from "./typing";
import { escapeRegExp } from "./utils";

type sepNames = 'per' | 'opBrac' | 'clBrac' | 'quote' | 'apos' | 'backt'
type separators = {
	[K in sepNames]: string[];
}

const isBlank = Symbol('Blank Value')
export class Context {
	context: object;
	constructor (context: object){
		this.context = context;
	}
	getContextVal(item: cacheObj,separators: separators, options:ContextOptions) {
		const id = item.content;
		const con = this.context;
		const {allowRootBracket,allowUnquotedProps,sanitizer} =options
		const {per,opBrac,clBrac,quote,apos,backt} = separators;
		const quotes = [quote,apos,backt].flat().filter(v => id.includes(v)).map(v => escapeRegExp(v));

		function getRelative (funId: string, localContext: object, startIndex = 0): [symbol|unknown,number]{
			let result = isBlank;
			let foundLength = 0;
			const base = Object.keys(localContext)
			FindRoot: {
				if (startIndex === 0) {
					for (const rootKey of base) {
						if (funId.startsWith(rootKey,startIndex)) {
							result = localContext[rootKey]
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
									result = localContext[rootKey]
									foundLength = period.length + rootKey.length;
									break FindRoot;
								}
							}
						}
					}
				}
				if (startIndex !== 0 || allowRootBracket) {
					const filteredBrackets = opBrac.map((v,i) => [v,clBrac[i]]).filter(v => funId.includes(v[0]) && funId.includes(v[1]))
					let currentBrackets: [string,string] = null;
					for (const [open, close] of filteredBrackets) {
						if (funId.startsWith(open,startIndex)) {
							currentBrackets = [open, close];
							break;
						};
					}
					if (currentBrackets === null) break FindRoot;
					const [open, close] = currentBrackets.map(v => escapeRegExp(v));
					for (const quote of [...quotes,...(allowUnquotedProps ? [''] : [])]) {
						for (const rk of base) {
							const rootKey = escapeRegExp(rk);
							const getInnerReg = RegExp(`^[\\s\\S]{${startIndex}}(${open}\s*${quote}(${rootKey})${quote}\s*${close})`)
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
		for (;curInd < id.length;) {
			const localContext = finResult === isBlank ? con : finResult;
			if (typeof localContext !== 'object') break;
			const [newfinResult,foundLength] = getRelative(id,localContext,curInd);
			if (foundLength === 0) break;
			curInd += foundLength;
			finResult = newfinResult;
		}

		if (finResult === isBlank) {
			finResult = sanitizer({
				isEmpty: true,
				id,
				at: curInd,
			})
		} else {
			finResult = sanitizer({
				isEmpty: false,
				value: finResult,
				id,
			})
		}
		if (typeof finResult !== 'string') throw Error('Sanitizer did not provide string')
		return finResult;
	}
}

