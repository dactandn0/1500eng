// include other *.js

document.write('<script src="./words4000/data/words4000_data_1.js" type="text/javascript"></script>');

function MYLOG(msg) {
//	console.log(msg);
}

var app = angular.module("words4000App", ['ngSanitize']);
app.controller("words4000Ctrl", function($scope, $timeout) {

var kSTORIES = BOOK4K_1;
radioCDChange = function (cd) {
	switch (cd) {
		case 1: kSTORIES = cd1_stories; break;
	}
	localStorage.setItem("book_4k_num", cd);
	$scope.cd = cd;
}
radioLoopChange = function (val) {
	localStorage.setItem("audio_loop", val);
}

$scope.cd = 1;
$scope.stories = kSTORIES; //1

$scope.range = function(min, max, step) {
    return RANGE(min, max, step);
};

$scope.acc = -1;
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
$scope.bPlayingVoca = false;

$scope.bPause = false;
$scope.bShowVi = 0;
$scope.bHiddenWords = 0;
$scope.audio;
$scope.currentTime = 0;

$scope.units = [
	{'title':"", 'num': 1},
];

$scope.resetFlag = function () {
	$scope.bPlayingVoca = false;
	$scope.bPlayingFull = false;
	$scope.bPause = false;
	$scope.bShowVi = 0;
	$scope.bHiddenWords = 0;
}

$scope.playAtTime = function (time) {
    $scope.stopSound();
	$scope.audio = new Audio("words4000/data/words4000_" + $scope.cd + "/" + $scope.storyIdx + 'b.mp3');
	$scope.bPlayingVoca = true;
	$scope.bPlayingFull = false;
	$scope.audio.currentTime = time;
	$scope.audio.play();
	$scope.audio.addEventListener("ended", function(){
	   $scope.resetAudioBtnUI(true);
	});
}

$scope.backSound = function (sec) {
	$scope.audio.currentTime = $scope.audio.currentTime + sec;
}

$scope.resetAudioBtnUI = function(isVoca)
{
	$scope.bPause=false;
    $scope.bPlayingFull=false;
    $scope.bPlayingVoca=false;

    var loopRadio = 0;
    if (localStorage.hasOwnProperty("audio_loop")) {
		loopRadio = localStorage.audio_loop;
	}
    if (loopRadio==='1') // loop
    {
    	$scope.playFullSound($scope.storyIdx,isVoca);
    } else if (loopRadio==='2') // play next
    {
    	var next = $scope.storyIdx + 1;
    	if (next > 29) { next = 0 }; 
    	$scope.fetchStory(next, true);
    	$scope.playFullSound(next, isVoca);
    }

    $scope.$apply();
}

$scope.playFullSound = function (index, isVoca) {
	if ($scope.bPlayingFull && !$scope.bPlayingVoca) {
		$scope.stopSound();
		$scope.bPause=false;
		$scope.bPlayingFull = false;
		if (!isVoca) return;
	}

	if (!$scope.bPlayingFull && $scope.bPlayingVoca) {
		$scope.stopSound();
		$scope.bPause=false;
		$scope.bPlayingVoca = false;
		if (isVoca) return;
	}

	if (isVoca) {
		 $scope.audio = new Audio("words4000/data/words4000_" + $scope.cd + "/" + $scope.storyIdx + 'b.mp3');
		 $scope.bPlayingVoca = true;
		 $scope.bPlayingFull = false;
	}
	else {
		$scope.audio = new Audio("words4000/data/words4000_" + $scope.cd + "/" + $scope.storyIdx + '.mp3');
		$scope.bPlayingFull = true;
		$scope.bPlayingVoca = false;
	}

    $scope.audio.loop = false;
    $scope.audio.play();

	$scope.audio.addEventListener("ended", function(){
	   $scope.resetAudioBtnUI(isVoca);
	});
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
};

$scope.fetchStory = function (idx, reset=true) {
	if (reset==true) 
	{
		$scope.resetFlag();
		$scope.stopSound();
	}
	$scope.stories = kSTORIES;
	$scope.storyIdx = idx;
	$scope.story = $scope.stories[idx];

	// save DB
	localStorage.setItem("book_4k_unit", idx);
	if (!$scope.story) {MYLOG('Dont have Unit'); return;}
	
	$scope.story = processStory($scope.story);
}

$scope.loadData = function () {
	if (localStorage.hasOwnProperty("book_4k_num")) {
		var cd = localStorage.book_4k_num;
		radioCDChange(parseInt(cd));
		document.cdForm.radioCD.value=cd;
		$scope.cd=cd;
	}

	if (localStorage.hasOwnProperty("audio_loop")) {
		var val = localStorage.audio_loop;
		document.loopForm.radioLoop.value = val;
	}

	if (localStorage.hasOwnProperty("book_4k_unit")) {
		idx = localStorage.book_4k_unit;
		$scope.storyIdx = parseInt(idx);
	}

	$scope.fetchStory($scope.storyIdx, false);
};

$scope.loadData();

});
