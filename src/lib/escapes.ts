import { EscapeTypeFlags, escapeNames} from './typing';

const JS_DICT = {
	'\'': '\'',
	'"': '"',
	'\\': '\\',
	'`':'`',
	'[':'[',
	']':']',
};
const jsonDef = (v: string) => JS_DICT[v] || v;
const HTML_DICT = {
	'.': ['&period;'],
	'\\':['&#x27;'],
	'\'': ['&apos;'],
	'"': ['&quot;'],
	'[': ['&lsqb;'],
	']': ['&rsqb;'],
};
const htmlDef = (v: string) => HTML_DICT[v] || v;
const toJsUni = (code: number) => `\\u${Number.prototype.toString.call(code,16).toUpperCase()}`;
const toHTMLUni = (code: number) => `&#x${Number.prototype.toString.call(code,16).toUpperCase()};`;
const getUnicode = (str: string,type: 'js' | 'html') => [...str].map(v => v.split('').map(x => ({
	js: toJsUni,
	html: toHTMLUni,
}[type](String.prototype.charCodeAt.call(x,0)))).join('')).join('');

export const toEscapes: {
	[K in escapeNames]: (str: string) => string[];
} = {
	url: (str: string) => [encodeURIComponent(str)],
	html: (str: string) => [[...str].map(v => getUnicode(v,'html')).join(''),[...str].map(v => htmlDef(v)).join('')],
	js: (str: string) => [[...str].map(v => jsonDef(v)).join(''),[...str].map(v => getUnicode(v,'js')).join('')],
	json: (str: string) => [[...str].map(v => jsonDef(v)).join(''),[...str].map(v => getUnicode(v,'js')).join('')],
};

export const toAllEscapes = (identifier: string, flags: EscapeTypeFlags): string[] => {
	const escaped = new Set<string>();
	for (const k in flags) {
		if (toEscapes[k]) toEscapes[k](identifier).forEach((v:string) => escaped.add(v));
	}
	return Array.from(escaped);
};

