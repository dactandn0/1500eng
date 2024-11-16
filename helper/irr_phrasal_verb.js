
const BAT_QUI_TAC = [
	'tear|tore|torn|xé, rách',
	'take|took|taken|cầm, lấy',
	'get|got|got|lấy',
]

const PHRASAL_VERB_DATA = [
	{word: 'take', prep: 'after', mean: 'giống với'},
	{word: 'get', prep: 'on',  mean: 'thòa thuận với'},
]

// qua khu col = cot2 or cot 3 [V2 or Vpp]
function getVerb_Irr(verb_bare, col=2) {	
	if ( col < 2 || col > 3 ) {
		console.log('getVerb_Irr: col = ' + col + ' must [2,3]')
		col = 2
	}	
	for (var i = 0; i < BAT_QUI_TAC.length; i++) {
		var families = BAT_QUI_TAC[i].split('|')
		if (verb_bare === families[0]) 
			return families[col-1]
	}
	console.log('getVerb_Irr: ' + verb_bare + ' not in BAT_QUI_TAC')
	return '!'
}

function IRR_FindPhraVerb(story) {
	var PhraVerbs = []
	for (var i = 0; i < PHRASAL_VERB_DATA.length; i++) {
		var ele = PHRASAL_VERB_DATA[i]
		var bare = ele.word
		var prep = ele.prep
		var Vs_es = Helper_N_V_Add_S_ES(bare)
		var V2 = getVerb_Irr(bare, 2)
		if (V2==='!') V2 = Helper_Add_ED(bare)
		var Vpp = getVerb_Irr(bare, 3) 
		if (Vpp==='!') Vpp = Helper_Add_ED(bare)

		var regex = new RegExp(`\\b(${bare}|${Vs_es}|${V2}|${Vpp})\\s+(${prep})\\b` , 'gi')	
		var matches = story.match(regex);
		if (matches)
		PhraVerbs = PhraVerbs.concat(matches)
	}
	var regexStr = ''
	for (var i = 0; i < PhraVerbs.length; i++) {
		var ele = PhraVerbs[i]
		regexStr += ele + "|"
	}
	regexStr = regexStr.substring(0, regexStr.length - 1)   //remove last '|'
	regexStr = '' + regexStr + ''
	var regex = new RegExp(`\\b(${regexStr}|\\w+'*\\w+)\\b` , 'gi')
//	console.log(regex)
	var words = story.match(regex);
	console.log(words)
	words = Helper_ArrRemoveDup(words)
//	console.log(words)
	return words
}

// console.log( getVerb_Irr('tear')  )
 console.log( Helper_N_V_Add_S_ES('tear')  )