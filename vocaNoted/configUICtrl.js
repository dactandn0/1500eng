

// https://codepen.io/lonekorean/pen/PozMjgO
var app = angular.module("configUIApp", 
[
]);
app.controller("configUICtrl", function($scope, $rootScope) {

$scope.audioPitch = 1.5
$scope.audioRate = 0.8

$scope.toastTimeOut = HELPER_TOASTER_TIMEOUT_DEF
$scope.toastTimeOutMed = HELPER_TOASTER_TIMEOUT_MED_DEF
$scope.toastTimeOutLong = HELPER_TOASTER_TIMEOUT_LONG_DEF

$scope.selectedVoiceIdx = -1
$scope.VOICES = Helper_Voices

$scope.PUTER_VOICES = (typeof PUTER_VOICES !== 'undefined') ? PUTER_VOICES : [{ id: 'Joanna', desc: 'Joanna - Female US' }];
$scope.puterVoice = 'Joanna';

$scope.setPuterVoice = function () {
	Helper_saveDB(Helper_PuterVoiceKey, $scope.puterVoice);
}

$scope.speechTest = function () {
	try { Text2Speech('Hello, this is ' + $scope.puterVoice + '. How are you today?'); } catch (e) {}
}


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
	Helper_saveDB(Helper_AdjAudioTimeKey, $rootScope.adjAudioTime);
}

$scope.setToastTimeOut = function () {
	Helper_saveDB(Helper_ToastTimeOutKey, $scope.toastTimeOut);
}

$scope.setToastTimeOutLong = function () {
	Helper_saveDB(Helper_ToastTimeOutLongKey, $scope.toastTimeOutLong);
}

$scope.setToastTimeOutMed = function () {
	Helper_saveDB(Helper_ToastTimeOutMedKey, $scope.toastTimeOutMed);
}

$scope.saveSelectedVoiceIdx = function () {
	Helper_saveDB(Helper_SelectedVoiceIdx, $scope.selectedVoiceIdx);
}

$scope.loadDB = function () {
	$scope.VOICES = Helper_Voices
	$scope.audioPitch = Helper_loadFloat(Helper_AudioPitchKey, 1.5)
	$scope.audioRate = Helper_loadFloat(Helper_AudioRateKey, 0.8)
	$scope.puterVoice = Helper_loadStr(Helper_PuterVoiceKey, 'Joanna')

	// LoadDb in audioCtrl.js
	// $rootScope.audio_repeatNum = Helper_loadFloat(Helper_RepeatNumKey, 1)
	$rootScope.audio_repeatNum = Helper_loadFloat(Helper_RepeatNumKey, HELPER_REPEAT_NUM_DEF)
	$rootScope.adjAudioTime = Helper_loadInt(Helper_AdjAudioTimeKey, HELPER_ADJ_AUDIO_TIME_DEF)
	$scope.toastTimeOut = Helper_loadFloat(Helper_ToastTimeOutKey, HELPER_TOASTER_TIMEOUT_DEF)
	$scope.toastTimeOutMed = Helper_loadFloat(Helper_ToastTimeOutMedKey, HELPER_TOASTER_TIMEOUT_MED_DEF)
	$scope.toastTimeOutLong = Helper_loadFloat(Helper_ToastTimeOutLongKey, HELPER_TOASTER_TIMEOUT_LONG_DEF)

	$scope.selectedVoiceIdx  = Helper_loadInt(Helper_SelectedVoiceIdx, -1)
};


$scope.$on('$viewContentLoaded', function(){
	$scope.loadDB();
	topFunction();
});


});

