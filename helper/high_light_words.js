
function IRR_ExtractWords(story) 
{	
	var english = story.en
	var voca = story.voca

	if (!english || english.trim().length === 0) return {
		words:''
		,phraVerbs:''
		,specialWords:''
	}

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

	// SPECIAL_WORDS declared in form_of_word.js
	var specialWord_Regex = SPECIAL_WORDS.replaceAll(',', '|')

	// Speech all long voca_note
	var voca_Regex = ''
	if (voca) 
	{	
		// sort by length
		vocaArr = voca.split(',')
		vocaArr.sort((a, b) => b.length - a.length);
		voca = vocaArr.toString();
		voca_Regex = voca.replaceAll(',' , '|') + '|'
	}

	var regex = new RegExp(`\\b(${voca_Regex}${phraRegex}${specialWord_Regex}|\\w+'*\\w*)\\b` , 'gi')
	var words = english.match(regex);   // include phraVerbs and other
	words = Helper_ArrRemoveDup(words)

	for (var i = 0; i < phraVerbs.length; i++) {
		var www = phraVerbs[i].split(' ')
		var word = www[0]
		var prep = www[1]
		var prep2 = www[2]

		// remove phraVerbs out of words
		words = words.filter(function(ele) { return ele !== word && ele !== prep && ele !== prep2})
	}
	words = Helper_ArrSortEleLength(words)

	// adv of degree + special
	regex = new RegExp(`\\b(${specialWord_Regex})\\b` , 'gi')
	
	var specialWords = english.match(regex);
	specialWords = Helper_ArrRemoveDup(specialWords)

	specialWords = Helper_ArrSortEleLength(specialWords)

	// remove out of words
	if (specialWords)
	{
		for (var i = 0; i < specialWords.length; i++) 
		{
			var specialWordArr = specialWords[i].split(' ');
			words = words.filter(function(ele) 
			{ 
				return specialWordArr.length == 1 
						|| !specialWordArr.includes(ele)
			})
		}
	}

	// remove voca out of words
	var vocas = null
	if (voca) vocas = voca.split(',')
	vocas = arrRemoveZeroLenghthEle(vocas)
	if (vocas)
	{
		for (var i = 0; i < vocas.length; i++) 
		{
			var vocaParts = vocas[i].split(' ');
			words = words.filter(function(ele) 
			{ 
				//return vocaParts.length == 1 || !vocaParts.includes(ele)
				return true
			});

			// needs to high_light uncount_nouns
			if (vocaParts.length > 1)
			{
				vocaParts.forEach(ele => {
					if (arrUNCOUNT_NOUNS.includes(ele)) words.push(ele)
				})
			}
		}
	}


	//console.log(words)
	//console.log(phraVerbs)
	//console.log(specialWords)

	return  {
		specialWords: specialWords
		,words: words
		,phraVerbs: phraVerbs
	}
}