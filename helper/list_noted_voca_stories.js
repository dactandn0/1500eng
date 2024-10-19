
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
		var wordFormed = notedWords[i].trim().toLowerCase();
		if (wordFormed) {
			for (var j = 0; j < searchData.length; j++) {
				var wordFull = searchData[j]
				var wordNguyenGoc = Helper_GetVocaFromWordFull(wordFull).toLowerCase()

			    if (wordFormed===wordNguyenGoc || Helper_IsFormOfWord(wordNguyenGoc, wordFormed)) {
			       hasVocas.push(wordFormed)
			    }
			}
		}
	}
	var dontVoca = notedWords.filter(d => !hasVocas.includes(d.toLowerCase()))
	for (var i = 0; i < dontVoca.length; i++) {
		var loggg = dontVoca[i]
		if (loggg) console.log(loggg)

	}
}

if (HELPER_FOR_TEST) doList(barron);