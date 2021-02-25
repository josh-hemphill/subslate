import { Context } from './context';
import { toAllEscapes } from './escapes';
import type { Options,cacheObj, strPairs, escapedSep } from './typing';
import { iter, defaulted,regReset, escapeRegExp, isObj } from './utils';
interface DefaultedOptions extends Options {
	startStopPairs: strPairs[]
}
export const getDefaultOptions = (options: Partial<Options>): DefaultedOptions => ({
	startStopPairs: defaulted(options.startStopPairs,['${','}'],'Invalid startStopPairs'),
	escapeSep: typeof options.escapeSep === 'undefined' ? false : options.escapeSep,
	allowUnquotedProps: !!options.allowUnquotedProps,
	allowRootBracket: !!options.allowRootBracket,
	sanitizer: options.sanitizer || ((v) =>
		v.isEmpty === true ? 'undefined' : String(v.value)),
	maxNameLength: options.maxNameLength || 256,
});
export const createEscapes = toAllEscapes;
export const getSeparators = (escapeSep: Options['escapeSep']): escapedSep => {
	const [per,opBrac,clBrac,quote,apos,backt] = ['.','[',']','"',"'",'`'].map(v => escapeSep ? toAllEscapes(v,escapeSep): [v]);
	const separators = {per,opBrac,clBrac,quote,apos,backt};
	return separators;
};

export const subslate = (text: string,context: Record<string|number,unknown>, options?: Partial<Options> | undefined): string => {
	const localOpts = isObj(options) ? options : {};
	const defaultedOptions = getDefaultOptions(localOpts);
	const {
		startStopPairs,
		escapeSep,
		maxNameLength,
	} = defaultedOptions;
	const filteredPairs = startStopPairs.filter(v => text.includes(v[0]) && text.includes(v[1])).map(v =>
		[escapeRegExp(v[0]),escapeRegExp(v[1])]).map(([v1,v2]) =>
		`(?:${v1}\\s*([\\s\\S]{0,${maxNameLength}}?)\\s*${v2})`);
	const cache = new Map<string,cacheObj>();
	const searcher = RegExp(filteredPairs.join('|'),'g');
	const reset = () => regReset(searcher);
	const execSearcher = () => searcher.exec(text);
	for (const res of iter(execSearcher,[],reset)) {
		if (res !== null) {
			const {index} = res;
			const [match, content] = res.filter(v => typeof v === 'string');
			if (!match && !searcher.lastIndex) break;
			if(!cache.has(match)) {
				cache.set(match, {
					content,
					indexes: [index],
				});
			} else {
				const temp = cache.get(match);
				if (temp) temp.indexes.push(index);
			}
		}
	}
	const lContext = new Context(context);
	let indexOffset = 0;
	const localStr = [...text];
	const separators = getSeparators(escapeSep);
	for (const [match, item] of cache) {
		if (!Object.prototype.hasOwnProperty.call(item,'value')) {
			item.value = lContext.getContextVal(item,separators,defaultedOptions);
		}
		for (const ind of item.indexes) {
			const value = String(item.value || '');
			localStr.splice(ind + indexOffset,match.length, ...value);
			indexOffset += (value.length - match.length);
		}
	}
	return localStr.join('');
};
export default subslate;
