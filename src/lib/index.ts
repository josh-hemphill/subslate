import { Context } from './context';
import { toAllEscapes } from './escapes';
import { Options,cacheObj, strPairs, escapedSep } from './typing';
import { iter, defaulted,regReset, escapeRegExp } from './utils';
interface DefaultedOptions extends Options {
	startStopPairs: strPairs[]
}
export const getDefaultOptions = (options: Partial<Options>): DefaultedOptions => ({
	startStopPairs: defaulted(options.startStopPairs,['${','}'],'Invalid startStopPairs'),
	escapeSep: options.escapeSep,
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
	const defaultedOptions = getDefaultOptions(options);
	const {
		startStopPairs,
		escapeSep,
		maxNameLength,
	} = defaultedOptions;
	const filteredPairs = startStopPairs.filter(v => text.includes(v[0]) && text.includes(v[1])).map(v =>
		[escapeRegExp(v[0]),escapeRegExp(v[1])]);
	const cache = new Map<string,cacheObj>();
	for (const [startStr,endStr] of filteredPairs) {
		const searcher = RegExp(`${startStr}\\s*([\\s\\S]{0,${maxNameLength}}?)\\s*${endStr}`,'g');
		const reset = () => regReset(searcher);
		const execSearcher = () => searcher.exec(text);
		for (const {index, 0: match, 1: content} of iter(execSearcher,[],reset)) {
			if(!cache.has(match)) {
				cache.set(match, {
					content,
					indexes: [index],
				});
			} else {
				const temp = cache.get(match);
				temp.indexes.push(index);
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
			localStr.splice(ind + indexOffset,match.length, ...item.value);
			indexOffset += (item.value.length - match.length);
		}
	}
	return localStr.join('');
};
export default subslate;
