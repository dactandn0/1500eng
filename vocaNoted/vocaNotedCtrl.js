
document.write('<script src="./vocaNoted/vocaNoted_data.js" type="text/javascript"></script>');

var app = angular.module("vocaNotedApp", 
[
]);
app.controller("vocaNotedCtrl", function($scope) {
VocaNotedCtrl = $scope;

var kDatabase = []
$scope.notedWords = []
$scope.audioSpeed = 0.8


$scope.setAudioSpeed = function () {
	Helper_AudioSpeed = $scope.audioSpeed;
	localStorage.setItem("audioSpd", Helper_AudioSpeed);
}

$scope.appendDataToUI = function (word) {
	$scope.notedWords.push(word);
}

$scope.removeNote = function (word, event) {
	$scope.notedWords = ArrayRemove($scope.notedWords, word);

	var saveSeq = "";
	for (var i = 0; i < $scope.notedWords.length; i++) {
		saveSeq += $scope.notedWords[i] + "@";
	}
	Helper_SaveDB(saveSeq);
}

$scope.removeAllNoted = function () {
	$scope.notedWords = [];
	Helper_SaveDB('');
}

$scope.loadArray = function () {
	var kDatabase = Helper_FetchDB();
	$scope.notedWords = kDatabase.trim().split("@");

	//remove element that length = 0
	$scope.notedWords = $scope.notedWords.filter(String);

	$scope.audioSpeed = 0.9;
	if (localStorage.hasOwnProperty("audioSpd")) {
		$scope.audioSpeed = parseFloat(localStorage.audioSpd);
		$scope.setAudioSpeed();
	}
};


$scope.loadArray();

});

