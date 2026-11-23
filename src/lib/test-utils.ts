import { Context } from './context.ts';
import { toEscapes } from './escapes.ts';

export { getDefaultOptions, getSeparators } from './index.ts';

export const getEsc = (name: string, target: string): string[] => {
	const key = name.toLowerCase() as keyof typeof toEscapes;
	return Object.hasOwn(toEscapes, key) ? toEscapes[key](target) : [target];
};

export const getEscStrings = (name: string, targets: [string, string, ...string[]]): string[][] => {
	const values = targets.map((target) => getEsc(name, target));
	return values[0].map((_, index) => values.map((entry) => entry[index]));
};

export const bracketize = (
	path: readonly (string | number)[],
	open: string,
	close: string,
	quote = '',
): string =>
	String(
		path.reduce(
			(result, key, index) =>
				index === 0 ? key : `${result}${open}${quote}${key}${quote}${close}`,
			'',
		),
	);

export type ContextItem = [string, (string | number)[], Context, string];
export const nC = (value: object): Context => new Context(value);
