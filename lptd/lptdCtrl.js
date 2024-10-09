// include other *.js

document.write('<script src="./lptd/cd1_data.js" type="text/javascript"></script>');
document.write('<script src="./lptd/cd2_data.js" type="text/javascript"></script>');
document.write('<script src="./lptd/cd3_data.js" type="text/javascript"></script>');


function MYLOG(msg) {
//	console.log(msg);
}

var app = angular.module("lptdApp", []);
app.controller("lptdCtrl", function($scope, $rootScope, $timeout) {
$rootScope.$on('$routeChangeStart', function () {
	$scope.stopSound();
  });

var kSTORIES = lptd_cd1_stories;
radioCDChange = function (cd) {
	switch (cd) {
		case 1: kSTORIES = lptd_cd1_stories; break;
		case 2: kSTORIES = lptd_cd2_stories; break;
		case 3: kSTORIES = lptd_cd3_stories; break;
		case 4: kSTORIES = []; break;
	}
	localStorage.setItem("lptd_cd", cd);
	$scope.cd = cd;
	MYLOG("localStorage saved CD= " + cd);
}

radioLoopChange = function (val) {
	localStorage.setItem("audio_loop", val);
	MYLOG("localStorage audio_loop" + val);
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
	{'title':"Science", 'num':6},
	{'title':"Art", 'num': 11},
	{'title':"Leisure", 'num':16},
	{'title':"School", 'num':21},
	{'title':"People", 'num':26},
	{'title':"Sports", 'num':31},
	{'title':"Travel", 'num':36},
];

$scope.resetFlag = function () {
	$scope.bPlayingFull = false;
	$scope.bPause = false;
	$scope.bShowVi = 0;
	$scope.bHiddenWords = 0;
}	

$scope.backSound = function (mul) {
	$scope.audio.currentTime = $scope.audio.currentTime + kBackTimeAudio * mul;
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
  		$scope.audio = new Audio("lptd/cd" + $scope.cd + "/" + $scope.storyIdx + '.mp3');
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
	localStorage.setItem("lptd_unit", idx);
	MYLOG("localStorage save unit=" + idx);
	if (!$scope.story) {MYLOG('Dont have Unit'); return;}
	
	$scope.story = processStory($scope.story);

}

$scope.loadData = function () {
	if (localStorage.hasOwnProperty("lptd_isAudioLoop")) {
		document.getElementById('audioLoopEle').checked = localStorage.lptd_isAudioLoop === 'true';
	}

	if (localStorage.hasOwnProperty("lptd_cd")) {
		var cd = localStorage.lptd_cd;
		MYLOG("localStorage load lptd_cd=" + cd);
		radioCDChange(parseInt(cd));
		document.lptd_cdForm.radioCD.value=cd;
		$scope.cd=cd;
	}

	if (localStorage.hasOwnProperty("audio_loop")) {
		var val = localStorage.audio_loop;
		MYLOG("localStorage load audio_loop=" + val);
		document.lptd_loopForm.radioLoop.value = val;
	}

	if (localStorage.hasOwnProperty("lptd_unit")) {
		idx = localStorage.lptd_unit;
		MYLOG("localStorage load unit=" + idx);
		$scope.storyIdx = parseInt(idx);
	}

	$scope.fetchStory($scope.storyIdx, false);
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});



});

