import { Context } from './context.ts';
import { toAllEscapes } from './escapes.ts';
import type { Options, strPairs, separators } from './typing.ts';
import { defaulted, escapeRegExp, isObj } from './utils.ts';

interface DefaultedOptions extends Options {
	startStopPairs: strPairs[];
}

/** Apply Subslate's default delimiter and path options. */
export const getDefaultOptions = (options: Partial<Options>): DefaultedOptions => ({
	startStopPairs: defaulted(options.startStopPairs, ['${', '}'], 'Invalid startStopPairs'),
	escapeSep: options.escapeSep ?? false,
	allowUnquotedProps: !!options.allowUnquotedProps,
	allowRootBracket: !!options.allowRootBracket,
	sanitizer: options.sanitizer || ((value) => (value.isEmpty ? 'undefined' : String(value.value))),
	maxNameLength: options.maxNameLength || 256,
});

/** List the enabled escape representations of a path separator. */
export const createEscapes: typeof toAllEscapes = toAllEscapes;

/** Build the separator lists used by the object path parser. */
export const getSeparators = (escapeSep: Options['escapeSep']): separators => {
	const [per, opBracket, clBracket, quote, apostrophe, backtick] = [
		'.',
		'[',
		']',
		'"',
		"'",
		'`',
	].map((value) => (escapeSep ? toAllEscapes(value, escapeSep) : [value]));
	return { per, opBracket, clBracket, quote, apostrophe, backtick };
};

/** Replace each placeholder with the value at its path in the supplied context. */
export const subslate = (
	text: string,
	context: Record<string | number, unknown>,
	options?: Partial<Options>,
): string => {
	const defaults = getDefaultOptions(isObj(options) ? options : {});
	const { startStopPairs, escapeSep, maxNameLength } = defaults;
	const patterns = startStopPairs
		.filter(([open, close]) => text.includes(open) && text.includes(close))
		.map(
			([open, close]) =>
				`(?:${escapeRegExp(open)}\\s*([\\s\\S]{0,${maxNameLength}}?)\\s*${escapeRegExp(close)})`,
		);
	if (patterns.length === 0) return text;

	const searcher = new RegExp(patterns.join('|'), 'g');
	const separators = getSeparators(escapeSep);
	const contextReader = new Context(context);
	const values = new Map<string, string>();
	const parts: string[] = [];
	let offset = 0;

	for (const match of text.matchAll(searcher)) {
		const [token, ...captures] = match;
		const id = captures.find((value) => value !== undefined);
		if (!token || id === undefined) continue;

		let value = values.get(id);
		if (value === undefined) {
			value = contextReader.getContextVal(id, separators, defaults);
			values.set(id, value);
		}

		parts.push(text.slice(offset, match.index), value);
		offset = match.index + token.length;
	}

	return parts.length > 0 ? parts.join('') + text.slice(offset) : text;
};

export default subslate;
