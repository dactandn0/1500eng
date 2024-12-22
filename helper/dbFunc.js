
const HELPER_AUDIOLOOP_SAME = 1
const HELPER_AUDIOLOOP_NEXT = 2
const HELPER_AUDIOLOOP_RANDOM = 0

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


Helper_AudioLoop = function (scope, stories) {
	var nextStoryIdx = scope.storyIdx;
	var num = stories.length;

    var loopRadio = Helper_loadAudioLoop();

    if (loopRadio === HELPER_AUDIOLOOP_RANDOM) // play next
    {
    	nextStoryIdx = Math.floor(Math.random() * num);
    }
    if (loopRadio === HELPER_AUDIOLOOP_NEXT) // play next
    {
    	nextStoryIdx = scope.storyIdx + 1;
    	if (nextStoryIdx > num - 1) { nextStoryIdx = 0 }; 
    }
    if (loopRadio !== HELPER_AUDIOLOOP_SAME) // loop
    {
    	scope.storyIdx = nextStoryIdx;
    	scope.fetchStory(scope.storyIdx, true);
    }
    scope.$broadcast('child_playFullSound')  
}
