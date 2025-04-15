
document.write('<script src="./vocaNoted/vocaNoted_data.js" type="text/javascript"></script>');

var app = angular.module("vocaNotedApp", []);
app.controller("vocaNotedCtrl", function($scope) {
VocaNotedCtrl = $scope;

var kDatabase = []
$scope.dataWords = []
$scope.wordsShow = []

$scope.removeNote = function (word, date) 
{
	Helper_NoteRemoveWord(word, date);
	$scope.loadArray();
}

$scope.removeAllNoted = function () 
{
	$scope.dataWords = [];
	Helper_NoteClearDB();
}

$scope.loadArray = function () {
	$scope.dataWords = Helper_NoteFetchDB();
};


$scope.$on('$viewContentLoaded', function(){
	$scope.loadArray();
});

});

