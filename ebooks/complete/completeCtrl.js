// include other *.js
document.write('<script src="./ebooks/complete/listen_data/complete_cd1.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/complete/listen_data/complete_cd2.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/complete/read_data/complete_read_data.js" type="text/javascript"></script>');

var app = angular.module("completeApp", ['ngSanitize']);
app.controller("completeCtrl", function($scope, $rootScope, $timeout) {

$scope.stories = complete_cd1;
$scope.storyIdx = 0;
$scope.ielt_form = 0

// read
$scope.acc = -1;
$scope.acc_isShow = function (id) {
	return $scope.acc===id;
};

$scope.acc_click = function (id) {
	if($scope.acc===id) $scope.acc = -1;
	else {
		$scope.acc = id;
		$scope.story = processStory($scope.stories[id]);
	}
};

$scope.storyTitles = function () {
	return showStoryTitles($scope.stories)
}
// end of Read

ielt_formChange = function (num) {
	$scope.$broadcast("child_stopSound");

	$scope.ielt_form = num;
	if (num===0) $scope.stories = complete_cd1;
	if (num===1) $scope.stories = complete_read_data;
	
	$scope.acc = -1;
	$scope.titles = showStoryTitles($scope.stories);
	$scope.$digest();
}

$scope.createAudioSrc = function() {
	return "./ebooks/complete/listen_data/audio/" + $scope.story.track + '.mp3';
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	Helper_AudioLoop($scope, $rootScope);
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
