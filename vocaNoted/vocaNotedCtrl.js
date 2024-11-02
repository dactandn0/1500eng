
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

$scope.removeNote = function (word, event) {
	$scope.notedWords = ArrayRemove($scope.notedWords, word);

	var saveSeq = "";
	for (var i = 0; i < $scope.notedWords.length; i++) {
		saveSeq += $scope.notedWords[i] + "@";
	}
	Helper_NoteSaveDB(saveSeq);
}

$scope.removeAllNoted = function () {
	$scope.notedWords = [];
	Helper_NoteSaveDB('');
}

$scope.loadArray = function () {
	var kDatabase = Helper_NoteFetchDB();
	$scope.notedWords = kDatabase.trim().split("@");
	//remove element that length = 0
	$scope.notedWords = $scope.notedWords.filter(String);
};


$scope.loadArray();

});

