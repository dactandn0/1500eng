// include other *.js
document.write('<script src="./ebooks/complete/listen_data/complete_cd1.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/complete/listen_data/complete_cd2.js" type="text/javascript"></script>');

function MYLOG(msg) {
//	console.log(msg);
}

var app = angular.module("completeLApp", ['ngSanitize']);
app.controller("completeLCtrl", function($scope, $rootScope, $timeout) {
$rootScope.$on('$routeChangeStart', function () {
	$scope.stopSound();
});

radioCDChange = function (cd) {
	$scope.cd = cd;
	if (cd===1) {
		$scope.stories = complete_cd1;
		$scope.listTrackTitle();
	}
}

$scope.cd = 1;
$scope.stories = complete_cd1; //1
$scope.storyIdx = 0;
$scope.bPlayingFull = false;
$scope.bPause = false;
$scope.bShowVi = 0;
$scope.audio;
$scope.currentTime = 0;
$scope.loopType = 1;


$scope.resetFlag = function () {
	$scope.bPlayingFull = false;
	$scope.bPause = false;
	$scope.bShowVi = 0;
}	

$scope.backSound = function (mul) {
	$scope.audio.currentTime = $scope.audio.currentTime + kBackTimeAudio * mul;
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
    	if (next > $scope.stories.length-1) { next = 0 }; 
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
  		$scope.audio = new Audio("./ebooks/complete/listen_data/cd" + $scope.cd + "/" + $scope.story.title + ".mp3");
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
	if (reset==true) 
	{
		$scope.resetFlag();
		$scope.stopSound();
	}

	$scope.storyIdx = idx;
	$scope.story = $scope.stories[idx];
	
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
	for (var i = 0; i < $scope.stories.length; i++) {
		var story = $scope.stories[i];
		story.title = story.en.split("<br>")[0];
	}
}

$scope.init = function () {
	$scope.listTrackTitle();
	$scope.fetchStory($scope.storyIdx, false);
};

$scope.init();

});
