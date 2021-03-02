type escapeNames = "json" | "html" | "url" | "js";
type EscapeTypeFlags = {
    [K in escapeNames]?: boolean;
};
type strPairs = [
    string,
    string
];
type Options = {
    startStopPairs: strPairs | strPairs[];
    escapeSep: false | EscapeTypeFlags;
    maxNameLength: number;
} & ContextOptions;
type SanitizerOptions = {
    isEmpty: boolean;
    id: string;
    at?: number;
    value?: unknown;
};
/**
 @example
 ({
 isEmpty,
 id,
 at,
 value,
 }) => isEmpty ? 'empty' : String(value)
 */
type Sanitizer = (v: SanitizerOptions) => string;
type ContextOptions = {
    allowUnquotedProps: boolean;
    allowRootBracket: boolean;
    sanitizer: Sanitizer;
};
type sepNames = "per" | "opBracket" | "clBracket" | "quote" | "apostrophe" | "backtick";
type separators = {
    [K in sepNames]: string[];
};
interface DefaultedOptions extends Options {
    startStopPairs: strPairs[];
}
declare const getDefaultOptions: (options: Partial<Options>) => DefaultedOptions;
declare const createEscapes: (identifier: string, flags: EscapeTypeFlags) => string[];
declare const getSeparators: (escapeSep: Options['escapeSep']) => separators;
declare const subslate: (text: string, context: Record<string | number, unknown>, options?: Partial<Options> | undefined) => string;
export { subslate as default, subslate, getDefaultOptions, createEscapes, getSeparators };
