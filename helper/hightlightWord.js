

function IRR_ExtractWords(english) 
{
	if (!english || english.trim().length === 0) return {'words':'','phraVerbs':''}
	var phraVerbs = []

	for (var i = 0; i < PHRASAL_VERB_DATA.length; i++) {
		var ele = PHRASAL_VERB_DATA[i]
		var bare = ele.word
		var prep = ele.prep
		var Vs_es = Helper_N_V_Add_S_ES(bare)
		var Ving = Helper_N_V_Add_ING(bare)
		var V2 = getVerb_Irr(bare, 2)
		if (V2==='!') V2 = Helper_Add_ED(bare)
		var Vpp = getVerb_Irr(bare, 3) 
		if (Vpp==='!') Vpp = Helper_Add_ED(bare)

		var regex = new RegExp(`\\b(${bare}|${Vs_es}|${Ving}|${V2}|${Vpp})\\s+(${prep})\\b` , 'gi')	
		var matches = english.match(regex);
		if (matches)
		phraVerbs = phraVerbs.concat(matches)
	}
	var phraRegex = ''
	for (var i = 0; i < phraVerbs.length; i++) {
		var ele = phraVerbs[i]
		phraRegex += ele + "|"
	}

	phraRegex = phraRegex.substring(0, phraRegex.length - 1)   //remove last '|'
	if (phraRegex!=='') phraRegex = phraRegex + '|'

	var aod_Regex = ADV_OF_DEGREE.replaceAll(',', '|')

	var regex = new RegExp(`\\b(${phraRegex}${aod_Regex}|\\w+'*\\w*)\\b` , 'gi')
	var words = english.match(regex);   // include phraVerbs and other

	words = Helper_ArrRemoveDup(words)
//	console.log(words)

	for (var i = 0; i < phraVerbs.length; i++) {
		var www = phraVerbs[i].split(' ')
		var word = www[0]
		var prep = www[1]
		var prep2 = www[2]

		// remove phraVerbs in Words
		words = words.filter(function(ele) { return ele !== word && ele !== prep && ele !== prep2})
	}
	// dont ngClick with she,he,it if graph has: she's, he's...
	wordRutgons = words.filter(function(ele) { return ele.indexOf("'") !== -1 })
	var re = []
	var flat = false
	for (var i = 0; i < words.length; i++) {
		var ele = words[i]
		flat = false
		for (var j = 0; j < wordRutgons.length; j++) {
			var rutgon = wordRutgons[j]
			if (rutgon.indexOf(ele) !== -1) {
				flat = true
			}
		}
		if (!flat) re.push(ele)
	}
	re = re.concat(wordRutgons)

	//console.log(phraVerbs)
	//console.log(re)

	// adv of degree
	regex = new RegExp(`\\b(${aod_Regex})\\b` , 'gi')
	var aodWords = english.match(regex);
	aodWords = Helper_ArrRemoveDup(aodWords)
//	console.log(aodWords)

	return  {
		'aodWords':aodWords,
		'words':re,
		'phraVerbs':phraVerbs
	}
}