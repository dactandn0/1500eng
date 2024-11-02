
document.write('<script src="./vocaNoted/vocaNoted_data.js" type="text/javascript"></script>');

var app = angular.module("vocaNotedApp", 
[
]);
app.controller("vocaNotedCtrl", function($scope) {
VocaNotedCtrl = $scope;

var kDatabase = []
var dataWords = []
$scope.wordsShow = []

$scope.appendDataToUI = function (word) {
	dataWords.push(word);
	createWordShow()
}

$scope.removeNote = function (word, event) {
	dataWords = ArrayRemove(dataWords, word);

	var saveSeq = "";
	for (var i = 0; i < dataWords.length; i++) {
		saveSeq += dataWords[i] + "@";
	}
	Helper_NoteSaveDB(saveSeq);

	createWordShow();
}

$scope.removeAllNoted = function () {
	dataWords = [];
	Helper_NoteSaveDB('');
	createWordShow();
}

$scope.loadArray = function () {
	var kDatabase = Helper_NoteFetchDB();
	dataWords = kDatabase.trim().split("@");
	//remove element that length = 0
	dataWords = dataWords.filter(String);
	createWordShow();
};

function createWordShow() {
	$scope.wordsShow = []
	for (var i = 0; i < dataWords.length; i++) {
		var ele = dataWords[i]
		$scope.wordsShow.push(Helper_SliceHalfString(ele))
	}
}

$scope.$on('$viewContentLoaded', function(){
	$scope.loadArray();
});

});

