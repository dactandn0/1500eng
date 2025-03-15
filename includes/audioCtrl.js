

var app = angular.module('audioApp', []);

app.controller('AudioCtrl', ['$scope', '$rootScope', 'toastr', function($scope, $rootScope, toastr) {

$rootScope.audio_repeatCur = 0;
$rootScope.audio_repeatNum = Helper_loadFloat(Helper_RepeatNumKey, HELPER_REPEAT_NUM_DEF)
$rootScope.adjAudioTime = Helper_loadInt(Helper_AdjAudioTimeKey, HELPER_ADJ_AUDIO_TIME_DEF)

$rootScope.$on('$routeChangeStart', function () {
	$scope.stopSound();
	$rootScope.audioSrc = ''
	$rootScope.vocaEbook = []
	$scope.audio = null;
});

var audioDuration  = 0;

$scope.bPlaying = false;
$scope.bPause = false;
$scope.audio;
kCurrTime = 0; // for pause()

$scope.backSound = function (mul) {
	$scope.audio.currentTime += $rootScope.adjAudioTime * mul;
}

$scope.$on("child_stopSound", function (event, data) {
  	$scope.stopSound();
});

$scope.$on("child_playFullSound", function (event, data) {
  	$scope.playFullSound();
});


$scope.pauseSound = function () 
{
	if (!$scope.audio) return;
	$scope.bPause = !$scope.bPause;

	if ($scope.bPause===true)
    {
    	$scope.audio.pause();
    	kCurrTime = $scope.audio.currentTime;
    }
    else
    {
    	$scope.audio.currentTime = kCurrTime;
    	$scope.audio.play();
    }
}

$scope.stopSound = function () 
{
	if ($scope.audio) 
	{
		$scope.audio.pause();
		$scope.audio.currentTime = 0;
		$scope.audio = null;
	}
	kCurrTime = 0;
	$scope.bPlaying = false;
	$scope.bPause = false;

	$scope.$evalAsync();
};

$scope.playFullSound = function () 
{	
	if ($scope.bPlaying)
	{
		$scope.stopSound();
		return;
	}
		$scope.audio = new Audio($rootScope.audioSrc);
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

// for html call event
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

$scope.loadData = function() 
{
}

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});


}]);


