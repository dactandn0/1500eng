
document.write('<script src="./ebooks/ielts_test/data/official_cambridge_guide.js" type="text/javascript"></script>');


var app = angular.module("ielts_testApp", []);
app.controller("ielts_testCtrl", function($scope, $rootScope, $timeout) {

$scope.img_root = './ebooks/ielts_test/data/images';
const mp3_root = './ebooks/ielts_test/data/mp3/';

const IELTS_TEST_DATA = OFFICIAL_CAMBRIDGE_GUIDE

var audio = new Audio
var _currTime = 0
var isPause = false
var isStop = true

$scope.playStatus = ''
$scope.currMp3
$scope.stories = IELTS_TEST_DATA;	
Helper_MakeVoca_Menu_Titles($rootScope, $scope)

$scope.fetchStory = function (idx) 
{
	Helper_FetchStory (idx, $scope, $rootScope, 'IELTS_TEST');
}

$scope.playSound = function(idx)
{
	if (isStop)
	{
		var mp3Name = $scope.story.L_images[idx] + '.mp3'
		 audio.src = (mp3_root + mp3Name);

		_currTime = 0
		isPause = false

		audio.play();
		$scope.playStatus = 'Playing'
		$scope.currMp3 = idx

		isStop = false;

		audio.addEventListener("ended", function() {
			$scope.stopSound(idx);
		});
	}
	else $scope.stopSound(idx)
}

$scope.pauseSound = function(idx)
{
	if ($scope.currMp3 != idx) return;
	if (!isPause) 
	{
		audio.pause();
		_currTime = audio.currentTime;
		$scope.playStatus = 'Pause'
	}
	 else 
	{
		audio.currentTime = _currTime
		$scope.playStatus = 'Playing'
		audio.play()
	}
	isPause = !isPause
}

$scope.stopSound = function(idx)
{
	if ($scope.currMp3 !== idx) return
	if (!isStop)
	{
		audio.pause();
		audio.currentTime = 0;
		_currTime = 0
		isPause = false
		isStop = true

		$scope.playStatus = ''
	}
}


loadData = function () 
{
	$scope.fetchStory(1)
}

$scope.$on('$viewContentLoaded', function()
{
	loadData()
})

});
