// include other *.js

document.write('<script src="./ebooks/collins/listen_data/collins_cd12.js" type="text/javascript"></script>');

var app = angular.module("collinsLApp", ['ngSanitize']);
app.controller("collinsLCtrl", function($scope, $rootScope, $timeout) {

$scope.stories = collins_cd12;
$scope.storyIdx = 0;

$scope.titles = showStoryTitles($scope.stories);  // def

$scope.createAudioSrc = function() {
	return "./ebooks/collins/listen_data/cd12/" + $scope.story.track + '.mp3';
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	Helper_AudioLoop($scope, $rootScope);
});

$scope.fetchStory = function (idx, reset=true) 
{
	Helper_FetchStory (idx, $scope, $rootScope, "collinsL_unit", reset) 
}

$scope.loadData = function () {
	var id = Helper_loadInt('collinsL_unit', 0);
	$scope.fetchStory(id, false);
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
	makeVocaEbook($rootScope, 
		collins_cd12,
	)
});

});
