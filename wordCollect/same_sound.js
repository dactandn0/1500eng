

let SAME_SOUND_DATA = [
	"word | work | worse | worth",
]

function getWordSameSound(word)
{
	word = word.toLowerCase()
	var arr = []
	for (var i = 0; i < SAME_SOUND_DATA.length; i++) 
	{
		let words = SAME_SOUND_DATA[i];
		if (IsExisted(words, word))
		{
			arr = words.split('|')
			arr = arr.filter(e => e != word)
			break
		}
	}
	var rr = arr.join()
	//console.log(rr)
	if (rr.length > 0) rr = ' [s. ' + rr + ']'
	return rr
}

//getWordSameSound('word')

