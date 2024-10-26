
var app = angular.module('audioApp', []);

app.controller('AudioCtrl', ['$scope', '$rootScope', 'toastr', function($scope, $rootScope, toastr) {

$rootScope.$on('$routeChangeStart', function () {
	$scope.stopSound();
	$rootScope.audioSrc = ''
	$scope.audio = null;
});

var audioDuration  = 0;

$scope.audioAdjTime = 8; //8s

$scope.bPlaying = false;
$scope.bPause = false;
$scope.audio;
$scope.curTime = 0; // for pause()

$scope.backSound = function (mul) {
	$scope.audio.currentTime += $scope.audioAdjTime * mul;
}

$scope.$on("child_stopSound", function (event, data) {
  	$scope.stopSound();
});

$scope.$on("child_playFullSound", function (event, data) {
  	$scope.playFullSound();
});


$scope.pauseSound = function () {

	if (!$scope.audio) return;
	$scope.bPause = !$scope.bPause;

	if ($scope.bPause===true)
    {
    	$scope.audio.pause();
    	$scope.curTime = $scope.audio.currentTime;
    }
    else
    {
    	$scope.audio.currentTime = $scope.curTime;
    	$scope.audio.play();
    }
}

$scope.stopSound = function () {
	if ($scope.audio) 
	{
		$scope.audio.pause();
		$scope.audio.currentTime = 0;
		$scope.audio = null;
	}
	$scope.curTime = 0;
	$scope.bPlaying = false;
	$scope.bPause=false;

	$scope.$evalAsync();
};

$scope.playFullSound = function () {
	if ($scope.bPlaying)
	{
		$scope.stopSound();
		return;
	}
		$scope.audio = new Audio($rootScope.audioSrc);
		$scope.audio.volume = Helper_AudioVolume;   // not working
	    $scope.audio.loop = false;
	    window.playResult = $scope.audio.play();

	    $scope.audio.addEventListener('timeupdate', $scope.setupSeekbar);
	    $scope.audio.addEventListener('loadedmetadata', () => {
	     	audioDuration = $scope.audio.duration;
	  	});

	    $scope.bPlaying = true;
	    $scope.bPause = false;
	    $scope.$evalAsync();

		$scope.audio.addEventListener("ended", function() {
			$scope.stopSound();
			$scope.$emit('parent_whenAudioEnded')
		});
		playResult.catch(e => {
        	toastr.error(e)
        	$scope.stopSound();
    	});
}

setAudioTime = function () {
	if ($scope.audio && $scope.bPlaying) {
		var valBar = document.getElementById('slider').value;
		var val = audioDuration * valBar / 100.0
		$scope.audio.currentTime = val
	}
}

$scope.calAudioBarUI = function() {
	if ($scope.audio) 
	{
		var ratio = $scope.audio.currentTime * 100 / audioDuration;
		document.getElementById('slider').value = Math.floor(ratio)	
	}
}

$scope.setupSeekbar = function() {
	$scope.calAudioBarUI()
}


}]);


