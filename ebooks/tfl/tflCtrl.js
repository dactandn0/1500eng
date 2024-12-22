// include other *.js

document.write('<script src="./ebooks/tfl/tfl_b1_data.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/tfl/tfl_b2_data.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/tfl/tfl_b3_data.js" type="text/javascript"></script>');

var app = angular.module("tflApp", []);
app.controller("tflCtrl", function($scope, $rootScope, $timeout ) {

var KBook = 1;
$scope.stories = tfl_b1_stories; //1
$scope.storyIdx = 0;

bookChange = function (num) {
	switch (num) {
		case 1: $scope.stories = tfl_b1_stories; break;
		case 2: $scope.stories = tfl_b2_stories; break;
		case 3: $scope.stories = tfl_b3_stories; break;
	}
	Helper_saveDB("tfl_b", num);
	KBook = num;
	$scope.fetchStory($scope.storyIdx, true);
}

$scope.styleTrack = function(trackId) {
	trackId = trackId.split('.')[0]
	var num = Number(trackId)
	if (num%2===0) return {color : 'green'}
		return {color : 'orange'}
}

$scope.createAudioSrc = function() {
	return "./ebooks/tfl/tfl_b" + KBook + "/" + $scope.story.track + '.mp3';
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	Helper_AudioLoop($scope);
});

$scope.fetchStory = function (idx, reset=true) 
{
	Helper_FetchStory (idx, $scope, $rootScope, "tfl_unit", reset) 
}

$scope.loadData = function () {
	$scope.storyIdx = Helper_loadInt('tfl_unit', 0);
	
	var cd = Helper_loadInt('tfl_b', 1);
	bookChange(cd);
	document.tfl_bForm.book.value = cd;
	KBook=cd;

	$scope.fetchStory($scope.storyIdx, false);
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});

});

