

// https://codepen.io/lonekorean/pen/PozMjgO
var app = angular.module("configUIApp", 
[
]);
app.controller("configUICtrl", function($scope, $rootScope) {

$scope.audioPitch = 1.5
$scope.audioRate = 0.8
$scope.selectedVoiceIdx = -1
$scope.VOICES = Helper_Voices


$scope.setAudioPitch = function () {
	Helper_saveDB(Helper_AudioPitchKey, $scope.audioPitch);
}

$scope.setAudioRate = function () {
	Helper_saveDB(Helper_AudioRateKey, $scope.audioRate);
}

$scope.setRepeatNum = function () {
	Helper_saveDB(Helper_RepeatNumKey, $rootScope.audio_repeatNum);
}

$scope.setAdjAudioTime = function () {
	Helper_saveDB(Helper_AdjAudioTimeKey, $scope.adjAudioTime);
}

$scope.saveSelectedVoiceIdx = function () {
	Helper_saveDB(Helper_SelectedVoiceIdx, $scope.selectedVoiceIdx);
}

$scope.loadDB = function () {
	$scope.VOICES = Helper_Voices
	$scope.audioPitch = Helper_loadFloat(Helper_AudioPitchKey, 1.5)
	$scope.audioRate = Helper_loadFloat(Helper_AudioRateKey, 0.8)

	// LoadDb in audioCtrl.js
	// $rootScope.audio_repeatNum = Helper_loadFloat(Helper_RepeatNumKey, 1)
	$rootScope.audio_repeatNum = Helper_loadFloat(Helper_RepeatNumKey, HELPER_REPEAT_NUM_DEF)
	$rootScope.adjAudioTime = Helper_loadInt(Helper_AdjAudioTimeKey, HELPER_ADJ_AUDIO_TIME_DEF)

	$scope.selectedVoiceIdx  = Helper_loadInt(Helper_SelectedVoiceIdx, -1)
};


$scope.$on('$viewContentLoaded', function(){
	$scope.loadDB();
	topFunction();
});


});

