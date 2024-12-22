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
	Helper_saveDB("completeL_unit", idx);
	if (!$scope.story) {MYLOG('Dont have Unit'); return;}
	
	$scope.story = processStory($scope.story);

}

$scope.loadData = function () {
	$scope.storyIdx = Helper_loadInt('completeL_unit');
	$scope.fetchStory($scope.storyIdx, false);
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});
});
