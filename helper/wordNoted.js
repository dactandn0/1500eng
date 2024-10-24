

Helper_FetchDB = function() {
	if (localStorage.hasOwnProperty("vocaNotedSeq")) {
		return localStorage.vocaNotedSeq.trim();
	}
	return "";
}


Helper_IsWordSavedBefore = function(word) {
  return Helper_FetchDB().split("@").includes(word);
} 


Helper_SaveDB = function(data) {
	localStorage.setItem("vocaNotedSeq", data.trim());
}
