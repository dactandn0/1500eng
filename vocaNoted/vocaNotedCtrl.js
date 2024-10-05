
document.write('<script src="./vocaNoted/vocaNoted_data.js" type="text/javascript"></script>');

var app = angular.module("vocaNotedApp", 
[
]);
app.controller("vocaNotedCtrl", function($scope) {
VocaNotedCtrl = $scope;

var kDatabase = []
$scope.notedWords = []

$scope.appendDataToUI = function (word) {
	$scope.notedWords.push(word);
}

$scope.removeNote = function (event, word) {
	event.target.parentElement.remove();
	$scope.notedWords = ArrayRemove($scope.notedWords, word);

	var saveSeq = "";
	for (var i = 0; i < $scope.notedWords.length; i++) {
		saveSeq += $scope.notedWords[i] + "@";
	}
	Helper_SaveDB(saveSeq);
}
 $scope.voices = [];
$scope.speak = function (event, txt) {
	var voca = Helper_GetVocaFromWordFull(txt);

	 speechSynthesis.getVoices();

	 const utter = new SpeechSynthesisUtterance(voca);
	 utter.text = voca;

	  speechSynthesis.speak(utter);
}

$scope.loadArray = function () {
	var kDatabase = Helper_FetchDB();
	$scope.notedWords = kDatabase.trim().split("@");

	//remove element that length = 0
	$scope.notedWords = $scope.notedWords.filter(String);
};


$scope.loadArray();

});

