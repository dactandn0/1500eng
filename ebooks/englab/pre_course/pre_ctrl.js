
function MYLOG(msg) {
//	console.log(msg);
}

var app = angular.module("myApp", ['ngSanitize']);
app.controller("ctrl", function($scope, $timeout) {


$scope.cd = 1;
$scope.stories = SLIDES;
$scope.acc=0;

$scope.acc_isShow = function (id) {
	return $scope.acc===id;
};

$scope.acc_click = function (id) {
	if($scope.acc===id) $scope.acc=-1;
	else
		$scope.acc=id;
};


$scope.storyIdx = 0;
$scope.bPlayingFull = false;
$scope.bPause = false;
$scope.bShowVi = 0;
$scope.bHiddenWords = 0;
$scope.audio;
$scope.currentTime = 0;

$scope.units = [
	{'title':"", 'num': 1},
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
	for (var k = 0; k < $scope.stories.length; k++) {
		story = $scope.stories[k];
		if (story.voca) 
		{
			var vocas = story.voca.split(',');
			story.vocaNotes = [];
			for (var i = 0; i < vocas.length; i++) {
				voca = vocas[i].trim();
				var temp = voca;
				if (temp.indexOf("[") >= 0) {
					temp = temp.replace(/\s*\|\s*/g, ", ");
					temp = temp.replace(/\s*\[\s*/g, " : ");
					temp = temp.replace(/\s*\]\s*/g, "");
					story.vocaNotes.push(temp);
				}
				voca = voca.replace(/\[.*\]/g, '').trim();
				var regex = new RegExp(`\\b${voca}` , 'g')
				story.en = story.en.replace(regex, '<b>' + voca + '</b>');
			}
		}
	} // for

}

$scope.loadData = function () {
	$scope.fetchStory();
};

$scope.loadData();

});
