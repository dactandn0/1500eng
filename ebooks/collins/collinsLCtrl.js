// include other *.js

document.write('<script src="./ebooks/collins/listen_data/collins_cd12.js" type="text/javascript"></script>');

var app = angular.module("collinsLApp", ['ngSanitize']);
app.controller("collinsLCtrl", function($scope, $rootScope, $timeout) {

var kSTORIES = collins_cd12;
$scope.stories = kSTORIES;
$scope.storyIdx = 0;

$scope.createAudioSrc = function() {
	return "./ebooks/collins/listen_data/cd12/" + $scope.story.track + '.mp3';
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	$scope.whenAudioEnded();
});

$scope.whenAudioEnded = function()
{
	Helper_AudioLoop($scope, kSTORIES);
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
}

$scope.loadData = function () {
	var id = Helper_loadInt('collinsL_unit', 0);
	$scope.fetchStory(id, false);
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});

});
