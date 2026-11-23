import format, { subslate } from '@josh-hemphill/subslate';
import type { Options, Sanitizer } from '@josh-hemphill/subslate';

const sanitizer: Sanitizer = ({ value }) => String(value);
const options: Partial<Options> = { startStopPairs: '||', sanitizer };

export const esm: string = format('||x||', { x: 'world' }, options);
export const named: typeof format = subslate;
