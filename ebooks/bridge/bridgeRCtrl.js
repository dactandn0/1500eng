
document.write('<script src="./ebooks/bridge/read_data/bridge_read_data.js" type="text/javascript"></script>');



var app = angular.module("bridgeRApp", ['ngSanitize']);
app.controller("bridgeRCtrl", function($scope, $timeout) {

var kSTORIES = bridge_read_data;
radioCDChange = function (cd) {
	switch (cd) {
		case 1: kSTORIES = bridge_read_data; break;
	}
	localStorage.setItem("bri_complete_cd", cd);
	$scope.cd = cd;
}

$scope.cd = 1;
$scope.stories = kSTORIES; //1

$scope.acc=-1;

$scope.acc_isShow = function (id) {
	return $scope.acc===id;
};

$scope.acc_click = function (id) {
	if($scope.acc===id) $scope.acc=-1;
	else
		$scope.acc=id;
};

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
    if (localStorage.hasOwnProperty("bri_complete_isAudioLoop")) {
		isChkLoopChecked = localStorage.bri_complete_isAudioLoop;
	}
    if (isChkLoopChecked=='true')
    {
    	$scope.playFullSound($scope.storyIdx);
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
  		$scope.audio = new Audio("cd" + $scope.cd + "/" + $scope.storyIdx + '.mp3');
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

$scope.fetchStory = function () {
	MYLOG('fetchStory');

	for (var k = 0; k < kSTORIES.length; k++) {
		story = $scope.stories[k];
		story = processStory(story);
	} // for
}

$scope.loadData = function () {
	$scope.fetchStory();
};

$scope.loadData();

});
