var kVERB_3_COL = '(verb)'

var PHRASAL_VERB = [{title:"Phrasal verbs",en:""}];
var BAT_QUI_TAC = [{title:"Bat qui tac",en:""}];

const BAT_QUI_TAC_DATA = [
	'catch|catched|catched|bắt',
	'come|came|come|đến',
	'carry|carried|carried|mang, vác',
	'call|called|called|gọi',
	'get|got|got|lấy',
	'look|looked|looked|nhìn, trông',
	'fall|fell|fallen|ngã, rơi',
	'hang|hung|hung|treo',
	'sleep|slept|slept|ngủ',
	'spring|sprung|sprung|ngủ',
	'tear|tore|torn|xé, rách',
	'take|took|taken|cầm, lấy',
	'wear|wore|worn|mặc',
	'leave|left|left|đặt, để',
	'put|put|put|đặt, để',
	'pass|passed|passed|qua',
	'go|went|gone|đi',
	'give|gave|given|qua',
]

const PHRASAL_VERB_DATA = [
	{word: 'catch', prep: 'up on', mean: 'bắt kịp, theo kịp'},
	{word: 'carry', prep: 'on', mean: 'continue'},
	{word: 'carry', prep: 'out', mean: 'tiến hành'},
	{word: 'call', prep: 'for', mean: 'yêu cầu'},
	{word: 'come', prep: 'across', mean: 'gặp phải'},
	{word: 'come', prep: 'up with', mean: 'nghĩ ra (ý tưởng)'},
	{word: 'hang', prep: 'out', mean: 'đi chơi'},
	{word: 'fall', prep: 'out',  mean: 'cãi nhau'},
	{word: 'pass', prep: 'away', mean: 'chết'},
	{word: 'sleep', prep: 'in', mean: 'ngủ nướng'},
	{word: 'come', prep: 'to mind', mean: 'điều xuất hiện đầu tiên trong tâm trí'},
	{word: 'spring', prep: 'to mind', mean: 'điều xuất hiện đầu tiên trong tâm trí'},
	{word: 'take', prep: 'off', mean: 'cất cánh, bắt đầu thành công'},
	{word: 'take', prep: 'over', mean: 'kiểm soát'},
	{word: 'take', prep: 'up', mean: 'học/thực hành'},
	{word: 'take', prep: 'after', mean: 'giống với'},
	{word: 'look', prep: 'up to',  mean: 'ngưỡng mộ'},
	{word: 'get', prep: 'on',  mean: 'thòa thuận với'},
	{word: 'put', prep: 'on',  mean: ' mặc (quần áo), bôi (kem)'},
	{word: 'put', prep: 'off',  mean: 'cởi bỏ (quần áo)'},
	{word: 'put', prep: 'aside',  mean: 'bỏ qua'},
	{word: 'put', prep: 'up with',  mean: 'chịu đựng'},
	{word: 'go', prep: 'for',  mean: 'chọn'},
	{word: 'give', prep: 'it a go',  mean: 'thử'},
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

	en = ''
	for (var i = 0; i < BAT_QUI_TAC_DATA.length; i++) {
		var datas = BAT_QUI_TAC_DATA[i].split('|')
		var VerbSeq = datas[0] + ' - ' + datas[1] + ' - ' + datas[2]
		var TYPE = ' ' + kVERB_3_COL + ' '
		var meaning = datas[3]
		var fullW = VerbSeq + TYPE + meaning
		en += fullW + "<br>"
	}
//	console.log(en)
	BAT_QUI_TAC[0].en = en.replace(/\s\s/gi, " ")
}

progress()

// qua khu col = cot2 or cot 3 [V2 or Vpp]
function getVerb_Irr(verb_bare, col=2) {	
	if ( col < 2 || col > 3 ) {
		console.log('getVerb_Irr: col = ' + col + ' must [2,3]')
		col = 2
	}	
	for (var i = 0; i < BAT_QUI_TAC_DATA.length; i++) {
		var families = BAT_QUI_TAC_DATA[i].split('|')
		if (verb_bare === families[0]) 
			return families[col-1]
	}
	console.log('getVerb_Irr: ' + verb_bare + ' not in BAT_QUI_TAC_DATA')
	return '!'
}



 // console.log( getVerb_Irr('call')  )
 // console.log( Helper_N_V_Add_S_ES('call')  )