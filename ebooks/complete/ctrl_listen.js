// include other *.js
document.write('<script src="../../global_js.js" type="text/javascript"></script>');
document.write('<script src="listen_data/complete_cd1.js" type="text/javascript"></script>');
document.write('<script src="listen_data/complete_cd2.js" type="text/javascript"></script>');

function MYLOG(msg) {
//	console.log(msg);
}

var app = angular.module("myApp", ['ngSanitize']);
app.controller("ctrl", function($scope, $timeout) {

var kSTORIES = complete_cd1;
radioCDChange = function (cd) {
	$scope.cd = cd;
	if (cd===1) {
		kSTORIES = complete_cd1;
		$scope.listTrackTitle();
	}
	
	localStorage.setItem("bri_listen_cd", cd);
	$scope.cd = cd;
}

$scope.cd = 1;
$scope.stories = kSTORIES; //1

$scope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
        input.push(i);
    }
    return input;
};

 $scope.storyIdx = 0;
 $scope.bPlayingFull = false;
 $scope.bPause = false;
 $scope.bShowVi = 0;
 $scope.bHiddenWords = 0;
 $scope.audio;
 $scope.currentTime = 0;

 $scope.loopType = 0;


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

    var isChkLoopChecked = false;

    if ($scope.loopType===1) // loop
    {
    	$scope.playFullSound($scope.storyIdx);
    } else if ( $scope.loopType===2) // play next
    {
    	var next = $scope.storyIdx + 1;
    	if (next > kSTORIES.length-1) { next = 0 }; 
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
  		$scope.audio = new Audio("listen_data/cd" + $scope.cd + "/" + $scope.story.title + ".mp3");
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
	localStorage.setItem("bri_listen_unit", idx);
	MYLOG("localStorage save unit=" + idx);
	if (!$scope.story || !$scope.story.en) {MYLOG('Dont have Unit'); return;}
	
	$scope.story = processStory($scope.story);
}


$scope.isLongTrack = function(idx) {
	var track = $scope.stories[idx];
	if (!track || !track.en) return 'text-muted';
	var lengthCount = track.en.length;
	let result = ''
	if (lengthCount > 800 )
	{
			result = 'font-weight-bold';
	}

//	if (track.img) result += " text-danger";
	return result;
}

$scope.listTrackTitle = function() {
	$scope.cdTracks = [];
	for (var i = 0; i < kSTORIES.length; i++) {
		var story = kSTORIES[i];
		story.title = story.en.split("<br>")[0];
	}
}



$scope.loadData = function () {
	$scope.listTrackTitle();
	$scope.fetchStory($scope.storyIdx, false);
};

$scope.loadData();

});
