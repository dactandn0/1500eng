// include other *.js
document.write('<script src="../../global_js.js" type="text/javascript"></script>');
document.write('<script src="listen_data/data.js" type="text/javascript"></script>');

function MYLOG(msg) {
//	console.log(msg);
}

var app = angular.module("myApp", ['ngSanitize']);
app.controller("ctrl", function($scope, $timeout) {

var kSTORIES = listen_tracks;

radioLoopChange = function (val) {
	localStorage.setItem("audio_loop", val);
}

$scope.cd = 1;
$scope.stories = kSTORIES; //1

$scope.range = function(min, max, step) {
    return RANGE(min, max, step);
};


$scope.acc = -1;
$scope.storyIdx = 0;
$scope.bPlayingFull = false;
$scope.bPause = false;
$scope.bShowVi = 0;
$scope.audio;
$scope.currentTime = 0;

$scope.acc_isShow = function (id) {
	return $scope.acc===id;
};

$scope.acc_click = function (id) {
	if($scope.acc===id) $scope.acc=-1;
	else
		$scope.acc=id;

	$scope.storyIdx = id;
};

$scope.resetFlag = function () {
	$scope.bPlayingFull = false;
	$scope.bPause = false;
	$scope.bShowVi = 0;
	$scope.bHiddenWords = 0;
}	

$scope.backSound = function (sec) {
	$scope.audio.currentTime = $scope.audio.currentTime + sec;
}

$scope.resetAudioBtnUI = function()
{
	$scope.bPause=false;
    $scope.bPlayingFull=false;

    var loopRadio = 0;
    if (localStorage.hasOwnProperty("audio_loop")) {
		loopRadio = localStorage.audio_loop;
		MYLOG(loopRadio)
	}
    if (loopRadio==='1') // loop
    {
    	$scope.playFullSound($scope.storyIdx);
    } else if (loopRadio==='2') // play next
    {
    	var next = $scope.storyIdx + 1;
    	if (next > 39) { next = 0 }; 
    	$scope.fetchStory(next, true);
    	$scope.playFullSound(next);
    }

    $scope.$apply();
}

$scope.playFullSound = function (index) {
	if ($scope.bPlayingFull)
	{
		$scope.stopSound();
		$scope.bPause=false;
	}
  	else
  	{
  		$scope.audio = new Audio("listen_data/audio/" + $scope.storyIdx + '.mp3');
	    $scope.audio.loop = false;
	    $scope.audio.play();

		$scope.audio.addEventListener("ended", function(){
		   $scope.resetAudioBtnUI();
		});

	    $scope.bPlayingFull = true;
  	}
}

$scope.pauseSound = function () {
	if (!$scope.audio) return;
	$scope.bPause = !$scope.bPause;
	if ($scope.bPause)
    {
    	$scope.audio.pause();
    	$scope.currentTime = $scope.audio.currentTime;
    }
    else
    {
    	$scope.audio.currentTime = $scope.currentTime;
    	$scope.audio.play();
    }
}

$scope.stopSound = function () {
	if (!$scope.audio) return;
	 $scope.audio.pause();
	 $scope.audio.currentTime = 0;
	 $scope.currentTime = 0;
	 $scope.bPlayingFull = false;
};

$scope.preProcess = function () {
	for (var i = 0; i < $scope.stories.length; i++) {
		var story = $scope.stories[i];
		story = processStory(story);
		story.enShow = story.enShow.replaceAll('Candidate', '<b>Candidate</b>');
		story.viShow = story.viShow.replaceAll('Candidate', '<b>Candidate</b>');
		story.enShow = story.enShow.replaceAll('Examiner', '<b>Examiner</b>');
		story.viShow = story.viShow.replaceAll('Examiner', '<b>Examiner</b>');
	}
	
}

$scope.loadData = function () {
	$scope.preProcess();
};

$scope.loadData();

});