
var app = angular.module('audioLoopRadioApp', []);
app.controller('audioLoopRadioCtrl', function($scope, $rootScope,  $timeout) {

radioLoopChange = function (val) {
	localStorage.setItem(kAudioLoopSaveKey, val);
	$rootScope.audioLoop = val;
}

	$scope.finishLoading = function(){
	if (localStorage.hasOwnProperty(kAudioLoopSaveKey)) {
		$rootScope[kAudioLoopSaveKey] = parseInt(localStorage[kAudioLoopSaveKey]);
	}
	else $rootScope[kAudioLoopSaveKey] = 1;
	if (document.audioLoopForm.radioLoop)
    document.audioLoopForm.radioLoop.value = $rootScope[kAudioLoopSaveKey];
}

$scope.$on('$includeContentLoaded', function(){
	 	$scope.finishLoading()
});

$scope.$on('$viewContentLoaded', function(){
	$scope.finishLoading();
});

});

