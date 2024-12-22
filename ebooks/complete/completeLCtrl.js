// include other *.js
document.write('<script src="./ebooks/complete/listen_data/complete_cd1.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/complete/listen_data/complete_cd2.js" type="text/javascript"></script>');

var app = angular.module("completeLApp", ['ngSanitize']);
app.controller("completeLCtrl", function($scope, $rootScope, $timeout) {

$scope.stories = complete_cd1;
$scope.storyIdx = 0;

$scope.createAudioSrc = function() {
	return "./ebooks/complete/listen_data/audio/" + $scope.story.track + '.mp3';
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	Helper_AudioLoop($scope);
});

$scope.fetchStory = function (idx, reset=true) 
{
	Helper_FetchStory (idx, $scope, $rootScope, "completeL_unit", reset) 
}

$scope.loadData = function () {
	$scope.storyIdx = Helper_loadInt('completeL_unit');
	$scope.fetchStory($scope.storyIdx, false);
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});

});
