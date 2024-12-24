// include other *.js

document.write('<script src="./ebooks/lfil/lfil_data.js" type="text/javascript"></script>');

var app = angular.module("lfilApp", []);
app.controller("lfilCtrl", function($scope, $rootScope, $timeout ) {

$scope.stories = lfil_stories; //1
$scope.storyIdx = 0;

bookChange = function (num) {
	switch (num) {
		case 1: $scope.stories = lfil_stories; break;
	}

	$scope.fetchStory($scope.storyIdx, true);
}

$scope.createAudioSrc = function() {
	return "./ebooks/lfil/lfil_mp3/" + $scope.story.track + '.mp3';
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	Helper_AudioLoop($scope);
});

$scope.fetchStory = function (idx, reset=true) 
{
	Helper_FetchStory (idx, $scope, $rootScope, "lfil_unit", reset) 
}

$scope.loadData = function () {
	$scope.storyIdx = Helper_loadInt('lfil_unit', 0);
	$scope.fetchStory($scope.storyIdx, false);
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});

});

