var PHRASAL_VERB = [{title:"Phrasal verbs",en:""}];

const BAT_QUI_TAC = [
	'call|called|called|gọi',
	'get|got|got|lấy',
	'look|looked|looked|nhìn, trông',
	'fall|fell|fallen|ngã, rơi',
	'tear|tore|torn|xé, rách',
	'take|took|taken|cầm, lấy',
]

const PHRASAL_VERB_DATA = [
	{word: 'call', prep: 'for', mean: 'yêu cầu'},
	{word: 'take', prep: 'after', mean: 'giống với'},
	{word: 'look', prep: 'up',  mean: 'ngưỡng mộ'},
	{word: 'get', prep: 'on',  mean: 'thòa thuận với'},
	{word: 'fall', prep: 'out',  mean: 'cãi nhau'},
]

function progress() {
	var en = ''
	for (var i = 0; i < PHRASAL_VERB_DATA.length; i++) {
		var data = PHRASAL_VERB_DATA[i]
		var Vbare = data.word
		var V2 = getVerb_Irr(Vbare)
		var V3 = getVerb_Irr(Vbare , 3)
		var meaning = ' ' + data.prep + ' (v) ' + data.mean
		var fullW = data.word + meaning
		var fullW2 = V2 + meaning
		var fullW3 = V3 + meaning
		en += fullW + "<br>"
		en += fullW2 + "<br>"
		en += fullW3 + "<br>"
	}
	PHRASAL_VERB[0].en = en.replace(/\s\s/gi, " ")
}

progress()

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
	if (regexStr!=='') regexStr = regexStr + '|'
	var regex = new RegExp(`\\b(${regexStr}\\w+'*\\w*)\\b` , 'g')
//	console.log(regex)
	var words = story.match(regex);
	words = Helper_ArrRemoveDup(words)
//	words.sort((a, b) => b.length - a.length);
//	console.log(words)
	var r = []
	for (var i = 0; i < PhraVerbs.length; i++) {
		var www = PhraVerbs[i].split(' ')
		var word = www[0]
		var prep = www[1]
		words = words.filter(function(ele) { return ele !== word && ele !== prep})
	}

	return {'words':words,'PhraVerbs':PhraVerbs}
}

 // console.log( getVerb_Irr('call')  )
 // console.log( Helper_N_V_Add_S_ES('call')  )