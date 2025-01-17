
var app = angular.module('audioLoopRadioApp', []);
app.controller('audioLoopRadioCtrl', function($scope, $rootScope,  $timeout) {

$scope.radioVal = 1

$scope.radioLoopChange = function (val) {
	Helper_saveAudioLoop(val)
}

$scope.finishLoading = function(){
    $scope.radioVal = Helper_loadAudioLoop()
    Helper_saveAudioLoop($scope.radioVal)
}

$scope.$on('$includeContentLoaded', function(){
	 	$scope.finishLoading()
});

$scope.$on('$viewContentLoaded', function(){
	$scope.finishLoading();
});

});

