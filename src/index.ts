/**
 * Configurable template string replacement for JavaScript and TypeScript.
 * @module
 */
export { createEscapes, default, getDefaultOptions, getSeparators, subslate } from './lib/index.ts';
export type {
	EscapeTypeFlags,
	Options,
	Sanitizer,
	SanitizerOptions,
	StartStopPair,
	StartStopPairs,
} from './lib/typing.ts';
