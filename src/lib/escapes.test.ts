import { toAllEscapes } from './escapes';


describe('toAllEscapes',()=>{
	it('Returns all valid escapes',()=>{
		const allEscapes = ['.','[',']','"',"'",'`'].map(v => toAllEscapes(v,{
			json: true,
			html: true,
			url: true,
			js: true,
		}));
		// cspell: disable
		expect(allEscapes).toEqual([
			[ '.', '\\u2E', '&#x2E;', '&period;' ],
			[ '[', '\\u5B', '&#x5B;', '&lsqb;', '%5B' ],
			[ ']', '\\u5D', '&#x5D;', '&rsqb;', '%5D' ],
			[ '"', '\\u22', '&#x22;', '&quot;', '%22' ],
			[ "'", '\\u27', '&#x27;', '&apos;' ],
			[ '`', '\\u60', '&#x60;', '%60' ],
		]);
		// cspell: enable
	});
});

