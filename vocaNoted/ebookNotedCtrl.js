
var app = angular.module("ebookNotedApp", 
[
]);
app.controller("ebookNotedCtrl", function($scope) {

$scope.notedData = ''

$scope.speech = function (ev) {
	IndexCtrlScope.Idx_n_L_WSp_(ev)
}

$scope.initial = function () {
	var seq = ''
	for (var i = 0; i < kAllStories.length; i++) {
		var storyVocaStr = kAllStories[i].voca
		if (storyVocaStr && storyVocaStr.trim()!=='') {
			seq += storyVocaStr +','
		}
	}
	$scope.notedData = seq.split(',')
	$scope.notedData = Helper_ArrRemoveDup($scope.notedData)

};


$scope.initial();

});

