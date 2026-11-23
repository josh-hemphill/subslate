export type escapeNames = 'json' | 'html' | 'url' | 'js';

/** Escape styles accepted in object path separators. */
export type EscapeTypeFlags = {
	[K in escapeNames]?: boolean;
};

/** A start delimiter followed by an end delimiter. */
export type StartStopPair = readonly [start: string, stop: string];

/** A symmetric delimiter, a pair, or a list of delimiter strings and pairs. */
export type StartStopPairs = string | StartStopPair | readonly (string | StartStopPair)[];

export type strPairs = [string, string];

/** Subslate configuration. All fields are optional when calling Subslate. */
export type Options = {
	startStopPairs: StartStopPairs;
	escapeSep: false | EscapeTypeFlags;
	maxNameLength: number;
} & ContextOptions;

/** Resolved placeholder data passed to a sanitizer. */
export type SanitizerOptions = {
	isEmpty: boolean;
	id: string;
	at?: number;
	value?: unknown;
};

/** Converts a placeholder's data to its replacement text. */
export type Sanitizer = (value: SanitizerOptions) => string;

export type ContextOptions = {
	allowUnquotedProps: boolean;
	allowRootBracket: boolean;
	sanitizer: Sanitizer;
};

export type obj = Record<string | number, unknown>;

export type sepNames = 'per' | 'opBracket' | 'clBracket' | 'quote' | 'apostrophe' | 'backtick';
export type separators = Record<sepNames, string[]>;
