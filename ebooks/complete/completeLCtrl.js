// include other *.js
document.write('<script src="./ebooks/complete/listen_data/complete_cd1.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/complete/listen_data/complete_cd2.js" type="text/javascript"></script>');

var app = angular.module("completeLApp", ['ngSanitize']);
app.controller("completeLCtrl", function($scope, $rootScope, $timeout) {

var kSTORIES = complete_cd1; // 1

$scope.stories = kSTORIES; //1
$scope.storyIdx = 0;

$scope.createAudioSrc = function() {
	return "./ebooks/complete/listen_data/audio/" + $scope.story.track + '.mp3';
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	$scope.whenAudioEnded();
});

$scope.whenAudioEnded = function()
{
	var nextStoryIdx = $scope.storyIdx;
    var loopRadio = $rootScope[kAudioLoopSaveKey];
    if (loopRadio === 2) // play next
    {
    	nextStoryIdx = $scope.storyIdx + 1;
    	if (nextStoryIdx > kSTORIES.length-1) { nextStoryIdx = 0 }; 
    	$scope.storyIdx = nextStoryIdx;
    	$scope.fetchStory($scope.storyIdx, true);
    }
    if (loopRadio !== 0) // loop
    {
    	$scope.$broadcast('child_playFullSound')  
    }

}

$scope.fetchStory = function (idx, reset=true) 
{
	if (reset==true) 
	{
		$scope.$broadcast("child_stopSound");
	}

	$scope.stories = kSTORIES;
	$scope.storyIdx = idx;
	$scope.story = kSTORIES[idx];

	$rootScope.audioSrc = $scope.createAudioSrc();

	// save DB
	localStorage.setItem("complete_unit", idx);
	if (!$scope.story) {MYLOG('Dont have Unit'); return;}
	
	$scope.story = processStory($scope.story);

}

$scope.loadData = function () {
	if (localStorage.hasOwnProperty("complete_unit")) {
		$scope.storyIdx = parseInt(localStorage.complete_unit);
	}

	$scope.fetchStory($scope.storyIdx, false);
};

$scope.init = function () {
	$scope.loadData();
	$scope.fetchStory($scope.storyIdx, false);
};

$scope.init();

});
