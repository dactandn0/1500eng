// include other *.js
document.write('<script src="./ebooks/barron600/listen_data/barron600_listen_data.js" type="text/javascript"></script>');

var app = angular.module("barron600LApp", []);
app.controller("barron600LCtrl", function($scope, $rootScope, $timeout) {

$scope.cd = 1;
$scope.stories = barron600_listen_data;
$scope.storyIdx = 0;
$scope.bShowVi = 0;
$scope.loopType = 1;


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

$scope.listTrackTitle = function() {
}

$scope.init = function () {
	$scope.fetchStory($scope.storyIdx, false);
};

$scope.init();

});
