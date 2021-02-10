export type escapeNames = 'json' | 'html' | 'url' | 'js'
export type EscapeTypeFlags = {
	[K in escapeNames]?: boolean
}
export type strPairs = [string,string]
export type Options = {
	startStopPairs: strPairs | strPairs[];
	escapeSep: false | EscapeTypeFlags;
	maxNameLength: number;
} & ContextOptions
export type SanitizerOptions = {
	isEmpty: boolean,
	id: string,
	at?: number,
	value?: unknown,
}
/**
@example
({
	isEmpty,
	id,
	at,
	value,
}) => isEmpty ? 'empty' : String(value)
*/
export type Sanitizer = (v: SanitizerOptions) => string;
export type ContextOptions = {
	allowUnquotedProps: boolean;
	allowRootBracket: boolean;
	sanitizer: Sanitizer;
}
export type cacheObj = {
	content: string;
	indexes: number[];
	value?: string;
}
export type ArrayTwoOrMore<T> = {
	0: T
	1: T
} & Array<T>
export type escapedSep = {
	per: string[];
	opBrac: string[];
	clBrac: string[];
	quote: string[];
	apos: string[];
	backt: string[];
}
export type obj = Record<string|number, unknown>
