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


$scope.storyIdx = 0;
$scope.bPlayingFull = false;
$scope.bPause = false;
$scope.bShowVi = 0;
$scope.bHiddenWords = 0;
$scope.audio;
$scope.currentTime = 0;

$scope.units = [
	{'title':"Nature", 'num': 1},
	
];

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

$scope.fetchStory = function (idx, reset=true) {
	MYLOG('fetchStory');
	// when click 1.2.3..40
	if (reset==true) 
	{
		$scope.resetFlag();
		$scope.stopSound();
	}
	$scope.stories = kSTORIES;
	$scope.storyIdx = idx;
	$scope.story = $scope.stories[idx];

	// save DB
	localStorage.setItem("ielt_listen_sample_track", idx);
	MYLOG("localStorage save unit=" + idx);
	if (!$scope.story) {MYLOG('Dont have Unit'); return;}
	
	$scope.story = processStory($scope.story);
	$scope.story.enShow = $scope.story.enShow.replaceAll('Candidate', '<b>Candidate</b>');
	$scope.story.viShow = $scope.story.viShow.replaceAll('Candidate', '<b>Candidate</b>');
	$scope.story.enShow = $scope.story.enShow.replaceAll('Examiner', '<b>Examiner</b>');
	$scope.story.viShow = $scope.story.viShow.replaceAll('Examiner', '<b>Examiner</b>');
}

$scope.loadData = function () {

	if (localStorage.hasOwnProperty("audio_loop")) {
		var val = localStorage.audio_loop;
		MYLOG("localStorage load audio_loop=" + val);
		document.loopForm.radioLoop.value = val;
	}

	if (localStorage.hasOwnProperty("ielt_listen_sample_track")) {
		idx = localStorage.ielt_listen_sample_track;
		MYLOG("localStorage load unit=" + idx);
		$scope.storyIdx = parseInt(idx);
	}

	$scope.fetchStory($scope.storyIdx, false);
};

$scope.loadData();

});