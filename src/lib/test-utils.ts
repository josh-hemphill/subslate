
import { toEscapes } from "./escapes";
import { getDefaultOptions, getSeparators } from "./index";
import {Context} from './context'
import { ArrayTwoOrMore } from "./typing";
const getEsc = (id: string,target: string): string[] => toEscapes[id.toLocaleLowerCase()] ?
	toEscapes[id.toLocaleLowerCase()](target) : [target];

const getEscStrings = (id: string, targets: ArrayTwoOrMore<string>) => {
	const temp = targets.map(v => getEsc(id,v));
	return temp[0].map((_,i) => temp.map(v => v[i]))
}
const getCaObj = (str: (string|number)) => ({content:String(str),indexes:[]})
const bracketize = (path: (string|number)[],v1: string,v2: string, quote: string = '') => path.reduce((acc,v,i) =>
	`${acc}${i?v1 + quote:''}${v}${i?quote + v2:''}`,'')
type ContextItem = [
	string,
	(string | number)[],
	Context,
	string,
]
const nC = (obj: object) => new Context(obj);
export {
	toEscapes,
	getDefaultOptions,
	getSeparators,
	Context,
	ArrayTwoOrMore,
	ContextItem,
	getEsc,
	getEscStrings,
	getCaObj,
	bracketize,
	nC
}
