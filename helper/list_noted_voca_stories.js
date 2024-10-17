
// console.log(searchData)

const barron = barron600_read_data
	.concat(barron600_listen_data)


function doList(ebook) {
	var outputStr = ''
	for (var i = 0; i < ebook.length; i++) {
		var voca = ebook[i].voca
		outputStr += voca + ','
	}
	var notedWords = longStrToArray(outputStr)
	var hasVocas  = []
	for (var i = 0; i < notedWords.length; i++) {
		var word = notedWords[i].trim().toLowerCase();
		if (word) {
			for (var j = 0; j < searchData.length; j++) {
				var wordFull = searchData[j]
				var word2 = Helper_GetVocaFromWordFull(wordFull).toLowerCase()
				var word_s_es = Helper_N_V_Add_S_ES(word2)

			    if (word===word2 || Helper_IsFormOfWord(word)) {
			       hasVocas.push(word)
			    }
			}
		}
	}
	var dontVoca = notedWords.filter(d => !hasVocas.includes(d))
	for (var i = 0; i < dontVoca.length; i++) {
		var loggg = dontVoca[i]
		if (loggg) console.log(loggg)

	}
}

if (HELPER_FOR_TEST) doList(barron);