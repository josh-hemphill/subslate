import format, { createEscapes, getDefaultOptions, getSeparators, subslate } from 'subslate';
import type { Options, Sanitizer, StartStopPair, StartStopPairs } from 'subslate';

const sanitizer: Sanitizer = ({ value, at }) => (at === undefined ? String(value) : '');
const pair = ['${', '}'] as const satisfies StartStopPair;
const mixed = ['|', pair] as const satisfies StartStopPairs;
const options: Partial<Options> = { startStopPairs: mixed, sanitizer };

export const rendered: string = format('|a| ${a}', { a: 'A' }, options);
export const symmetric: string = subslate('|a|', { a: 'A' }, { startStopPairs: '|' });
export const normalized = getDefaultOptions({ startStopPairs: pair });
export const escapes: string[] = createEscapes('.', { html: true });
export const periods: string[] = getSeparators(false).per;
