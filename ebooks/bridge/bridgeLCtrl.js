// include other *.js

document.write('<script src="./ebooks/bridge/listen_data/bridge_cd1.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/bridge/listen_data/bridge_cd2.js" type="text/javascript"></script>');

var app = angular.module("bridgeLApp", ['ngSanitize']);
app.controller("bridgeLCtrl", function($scope, $rootScope, $timeout) {

var kSTORIES = bridge_cd1; //1

radioCDChange = function (cd) {
	$scope.cd = cd;
	if (cd===1) {
		$scope.stories = bridge_cd1; // update UI
		kSTORIES = bridge_cd1;
	}
}

$scope.cd = 1;
$scope.stories = kSTORIES; //1
$scope.storyIdx = 0;

$scope.createAudioSrc = function() {
	return "./ebooks/bridge/listen_data/cd" + $scope.cd + "/" + $scope.story.idx + '.mp3';
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
	localStorage.setItem("lptd_unit", idx);
	if (!$scope.story) {MYLOG('Dont have Unit'); return;}
	
	$scope.story = processStory($scope.story);

}

$scope.init = function () {
	$scope.fetchStory($scope.storyIdx, false);
};

$scope.init();

});
