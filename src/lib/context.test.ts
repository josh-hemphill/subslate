import {
	getDefaultOptions,
	getSeparators,
	ContextItem,
	getEsc,
	getEscStrings,
	getCaObj,
	bracketize,
	nC
} from './test-utils'
import { Options } from './typing'

const contexts: ContextItem[] = [
	['Object & Array',['x',0,'z'],nC({x:[{z:12}]}),"12"],
	['Array & String',[1,0,3],nC([1,[String('hello')],3]),'hello'],
	['Date',['prototype','getDay','call'],nC(new Date()),'undefined'],
]
describe('Context',() => {
	describe('context.getContextVal()',()=>{
		describe.each([
			['HTML',getDefaultOptions({escapeSep:{html:true}})],
			['JS',getDefaultOptions({escapeSep:{js:true}})],
			['JSON',getDefaultOptions({escapeSep:{json:true}})],
			['URL',getDefaultOptions({escapeSep:{url:true}})],
			['non',getDefaultOptions({escapeSep:false})],
		])('Replacing %s escaped separators',(type,obj)=>{
			const separators = getSeparators(obj.escapeSep)
			const periods = getEsc(type,'.')

			describe.each(contexts)('Using %s Context',
			(_,path,context,value)=>{
				it.each([
					...periods.map(v => [v,path.join(v)])
				])('Parses dot separated as %s',(_,str)=>{
					const result = context.getContextVal(getCaObj(str),separators,obj)
					expect(result).toEqual(value)
				})
				describe.each([
					'\'','"','`'
				])("Using %s as Quotes",(quote) => {
					const sep = getEscStrings(type,['[',']',quote])
					it.each([
						...sep.map(([v1,v2,q1]) =>
							[`${v1 + q1} and ${q1 + v2}`,bracketize(path,v1,v2,q1)])
					])('Parses bracketed as %s',(_,str)=>{
						const result = context.getContextVal(getCaObj(str),separators,obj)
						expect(result).toEqual(value)
					})
				})
			})
			const [,path,context,value] = contexts[0]
			const brack = getEscStrings(type,['[',']']);
			it.each([
				...brack.map(([v1,v2]) =>
					[`${v1} and ${v2}`,bracketize(path,v1,v2)])
			])('Parses unquoted props as %s',(_,str)=>{
				const localOpts = {...obj,allowUnquotedProps: true}
				const result = context.getContextVal(getCaObj(str),separators,localOpts)
				expect(result).toEqual(value)
			})
		})
		const [,path,context,value] = contexts[0]
		const obj = getDefaultOptions({escapeSep:false})
		const separators = getSeparators(obj.escapeSep)
		it('Parses bracketed root prop',()=>{
			const localOpts = {...obj,allowRootBracket: true}
			const str = bracketize(['',...path],'[',']',"'")
			const result = context.getContextVal(getCaObj(str),separators,localOpts)
			expect(result).toEqual(value)
		})
		it('Parses names with separator characters',()=>{
			const [path,context,value] = [['["x"]',0,'z.12'],nC({'["x"]':[{'z.12':12}]}),"12"]
			const localOpts = {...obj,allowRootBracket: true}
			const str = bracketize(path,'[',']',"'")
			const result = context.getContextVal(getCaObj(str),separators,localOpts)
			expect(result).toEqual(value)
		})
		it('Throws on invalid sanitizer return',()=>{
			const localOpts: Options = {...obj,sanitizer: ({
				isEmpty, value, id
				// @ts-ignore
			}) => isEmpty ? id : value}
			const getResult = () => context.getContextVal(getCaObj(path.join('.')),separators,localOpts)
			expect(getResult).toThrow('Sanitizer')
		})
	})
})

