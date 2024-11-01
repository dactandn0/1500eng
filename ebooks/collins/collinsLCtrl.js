// include other *.js

document.write('<script src="./ebooks/collins/listen_data/collins_cd12.js" type="text/javascript"></script>');

var app = angular.module("collinsLApp", ['ngSanitize']);
app.controller("collinsLCtrl", function($scope, $rootScope, $timeout) {

var kSTORIES = collins_cd12;
$scope.stories = kSTORIES;
$scope.storyIdx = 0;

$scope.createAudioSrc = function() {
	return "./ebooks/collins/listen_data/cd12/" + $scope.story.idx + '.mp3';
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	$scope.whenAudioEnded();
});

$scope.whenAudioEnded = function()
{
	var nextStoryIdx = $scope.storyIdx;
    var loopRadio = Helper_loadAudioLoop();
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
	Helper_saveDB("collinsL_unit", idx);
	if (!$scope.story) {MYLOG('Dont have Unit'); return;}
	$scope.story = processStory($scope.story);
	
	/*
	var story = $scope.story
	story.enShow = story.enShow.replaceAll('Candidate', '<b>Candidate</b>');
	story.viShow = story.viShow.replaceAll('Ứng viên', '<b>Ứng viên</b>');
	story.enShow = story.enShow.replaceAll('Examiner', '<b>Examiner</b>');
	story.viShow = story.viShow.replaceAll('Giám khảo', '<b>Giám khảo</b>');
	*/
}

$scope.loadData = function () {
	var id = Helper_loadInt('collinsL_unit', 0);
	$scope.fetchStory(id, false);
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});

});
