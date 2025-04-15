
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


Helper_SeqNoteFetchDB = function() 
{
	return Helper_loadStr("vocaNotedSeq", "")
}

Helper_NoteFetchDB = function() 
{
	dataWords = []
	const kDatabase = Helper_SeqNoteFetchDB()
	if (!kDatabase) return []

	let wordsOfDates = kDatabase.trim().split("|").filter(String);
	for (var i = 0; i < wordsOfDates.length; i++) 
	{
		let dateData = wordsOfDates[i]
		const spt =  dateData.split('#')
		const json = {
			date: spt[0],
			words: spt[1].split('@').filter(String)
		}
		dataWords.push(json)
	}
//	console.log(dataWords)
	return dataWords;
}

Helper_IsWordSavedBefore = function(word) 
{
  const prev = Helper_SeqNoteFetchDB().toLowerCase()
  const rs = prev.includes(word.toLowerCase())
  return rs
} 

Helper_NoteClearDB = function() 
{
	Helper_saveDB("vocaNotedSeq", '');
}

Helper_NoteSaveDB = function(word) 
{
	let prev = Helper_SeqNoteFetchDB()
	let arr = prev.split('|').filter(String)
	const date = Helper_GetNow()
	const idx = arr.findIndex(ele => ele.includes(date))
	if (idx >= 0 ) // edit
	{
		let obj = arr[idx]
		console.log(obj)
		obj += '@' + word
		arr[idx] = obj

		prev = arr.join('|')
	}
	else // add new
	{
		prev += '|' + date + '#' + word
	}

	Helper_saveDB("vocaNotedSeq", prev);
}
