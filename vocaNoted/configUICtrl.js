
// https://codepen.io/lonekorean/pen/PozMjgO
var app = angular.module("configUIApp", 
[
]);
app.controller("configUICtrl", function($scope) {

$scope.audioSpeed = 0.8
$scope.adjAudioTime = 8
$scope.selectedVoiceIdx = -1
$scope.VOICES = Helper_Voices

$scope.setAudioSpeed = function () {
	Helper_saveDB(Helper_AudioSpdKey, $scope.audioSpeed);
}

$scope.setAdjAudioTime = function () {
	Helper_saveDB(Helper_AdjAudioTimeKey, $scope.adjAudioTime);
}

$scope.saveSelectedVoiceIdx = function () {
	Helper_saveDB(Helper_SelectedVoiceIdx, $scope.selectedVoiceIdx);
}

$scope.loadDB = function () {
	$scope.VOICES = Helper_Voices
//	console.log(Helper_Voices)
	$scope.audioSpeed = Helper_loadFloat(Helper_AudioSpdKey, 0.8)
	$scope.adjAudioTime = Helper_loadInt(Helper_AdjAudioTimeKey, 8)
	$scope.selectedVoiceIdx  = Helper_loadInt(Helper_SelectedVoiceIdx, 4)
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadDB();
});


});

