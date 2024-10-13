// include other *.js

document.write('<script src="./words4000/data/words4000_data_1.js" type="text/javascript"></script>');

var app = angular.module("words4000App", []);
app.controller("words4000Ctrl", function($scope, $rootScope, $timeout) {

var kSTORIES = BOOK4K_1;

radioCDChange = function (cd) {
	if (cd===1) {
		kSTORIES = BOOK4K_1;
	}
	localStorage.setItem("book_4k_num", cd);
	$scope.cd = cd;
}

radioLoopChange = function (val) {
	localStorage.setItem("audio_loop", val);
}

$scope.cd = 1;
$scope.stories = kSTORIES; //1

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
$scope.bShowVi = 0;

$scope.fetchAudio = function() {
	return kSTORIES[$scope.storyIdx].idx;
}

$scope.createAudioScr = function() {
	var rr = "./words4000/data/words4000_" + $scope.cd + "/" + $scope.fetchAudio() + '.mp3';
	return rr;
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	$scope.whenAudioEnded();
});


$scope.whenAudioEnded = function(isVoca)
{
   var nextStoryIdx = $scope.storyIdx;
    var loopRadio = 0;
    if (localStorage.hasOwnProperty("audio_loop")) {
		loopRadio = localStorage.audio_loop;
	}
    if (loopRadio==='1') // loop
    {
    	$scope.$broadcast('child_playFullSound')  
    } else if (loopRadio==='2') // play next
    {
    	nextStoryIdx = $scope.storyIdx + 1;
    	if (nextStoryIdx > kSTORIES.length-1) { nextStoryIdx = 0 }; 
    	$scope.fetchStory(nextStoryIdx, true);

    	$scope.storyIdx = nextStoryIdx;
    	$scope.$broadcast('child_playFullSound')
    }

    $scope.$apply();
}


$scope.fetchStory = function (idx, reset=true) {
	if (reset==true) 
	{
		$scope.$broadcast("child_stopSound");
	}
	$scope.stories = kSTORIES;
	$scope.storyIdx = idx;
	$scope.story = $scope.stories[idx];

	$rootScope.audioSrc = $scope.createAudioScr();

	localStorage.setItem("book_4k_unit", idx);
	if (!$scope.story) {MYLOG('Dont have Unit'); return;}
	
	$scope.story = processStory($scope.story);
}

$scope.loadData = function () {
	if (localStorage.hasOwnProperty("book_4k_num")) {
		var cd = localStorage.book_4k_num;
		radioCDChange(parseInt(cd));
		document.word4k_cdForm.radioCD.value=cd;
		$scope.cd=cd;
	}

	if (localStorage.hasOwnProperty("audio_loop")) {
		var val = localStorage.audio_loop;
		document.word4k_loopForm.radioLoop.value = val;
	}

	if (localStorage.hasOwnProperty("book_4k_unit")) {
		idx = localStorage.book_4k_unit;
		$scope.storyIdx = parseInt(idx);
	}

	$scope.fetchStory($scope.storyIdx, false);
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});


});
