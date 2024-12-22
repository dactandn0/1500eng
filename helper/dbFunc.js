
Helper_saveDB = function(key, val = 0) {
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


Helper_NoteFetchDB = function() {
	return Helper_loadStr("vocaNotedSeq", "")
}


Helper_IsWordSavedBefore = function(word) {
  return Helper_NoteFetchDB().split("@").includes(word);
} 


Helper_NoteSaveDB = function(data) {
	Helper_saveDB("vocaNotedSeq", data.trim());
}
