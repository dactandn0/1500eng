
Helper_saveDB = function(key, val = 0) {
	if (!key || key.trim().length===0) return
	localStorage.setItem(key, val);
}

Helper_loadInt = function(key, defVal = 0) {
	if (localStorage.hasOwnProperty(key)) {
		return parseInt(localStorage[key].trim());
	} else Helper_saveDB(key, defVal)
	return defVal;
}
Helper_loadFloat = function(key, defVal = 0) {
	if (localStorage.hasOwnProperty(key)) {
		return parseFloat(localStorage[key].trim());
	} else Helper_saveDB(key, defVal)
	return defVal;
}

Helper_loadStr = function(key, defVal = '') {
	if (localStorage.hasOwnProperty(key)) {
		return localStorage[key].trim();
	} else Helper_saveDB(key, defVal)
	return defVal;
}

Helper_loadAudioLoop = function() {
	return Helper_loadInt(kAudioLoopSaveKey, 1)
}

Helper_saveAudioLoop = function(val) {
	return Helper_saveDB(kAudioLoopSaveKey, val)
}


// include '@'
Helper_SeqNoteFetchDB = function() {
	return Helper_loadStr("vocaNotedSeq", "")
}

// isFull for highlight noted word
Helper_NoteFetchDB = function(isFull = true) {
	const kDatabase = Helper_SeqNoteFetchDB()
	dataWords = kDatabase.trim().split("@");

	//remove element that length = 0
	dataWords = dataWords.filter(String)
	if (!isFull)
	{
		for (var i = 0; i < dataWords.length; i++) {
			const firstEnVoca = dataWords[i].split(' ')[0]
			dataWords[i] = firstEnVoca
		}
	}
	return dataWords;
}

Helper_IsWordSavedBefore = function(word) {
  const words = word.split(' ');
  if (words && words.length > 1) word = words[0].toLowerCase()
  var el = Helper_NoteFetchDB().find(ele => ele.toLowerCase().includes(word));
  return el != undefined
} 


Helper_NoteSaveDB = function(data) {
	Helper_saveDB("vocaNotedSeq", data.trim());
}
