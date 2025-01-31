// include other *.js

document.write('<script src="./ebooks/tfl/tfl_b1_data.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/tfl/tfl_b2_data.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/tfl/tfl_b3_data.js" type="text/javascript"></script>');

var app = angular.module("tflApp", []);
app.controller("tflCtrl", function($scope, $rootScope, $timeout ) {

var KBook = 1;
$scope.stories = tfl_b1_stories; 					//def
$scope.storyIdx = 0;
$scope.titles = showStoryTitles($scope.stories);  // def
makeVocaEbook($rootScope, tfl_b1_stories,tfl_b2_stories,tfl_b3_stories) 			// def

bookChange = function (num) {
	switch (num) {
		case 1: $scope.stories = doMenu(tfl_b1_stories); break;
		case 2: $scope.stories = doMenu(tfl_b2_stories); break;
		case 3: $scope.stories = doMenu(tfl_b3_stories); break;
	}
	$scope.titles = showStoryTitles($scope.stories);
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
	Helper_AudioLoop($scope, $rootScope);
});

$scope.fetchStory = function (idx, reset=true) 
{
	Helper_FetchStory (idx, $scope, $rootScope, "tfl_unit", reset) 
}

$scope.loadData = function () {
	$scope.storyIdx = Helper_loadInt('tfl_unit', 0);
	
	var bookData = Helper_loadInt('tfl_b', 1);
	bookChange(bookData);
	document.tfl_bForm.book.value = bookData;
	KBook=bookData;

	$scope.fetchStory($scope.storyIdx, false);
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});

function doMenu(kStories)
{
	var en = ""
	for (var i = 0; i < kStories.length; i++) {
		var lesson = kStories[i]
		if (lesson.title)
		{
			// 01.01 -> 01
			var order = (lesson.track + '').replace(/\..*/gi, '')
			en += order + ') ' + lesson.title + '<br>'
		}
	}
	var menu = {
		track: 'Menu',
		title: 'Lesson',
		en:en
	}
	var r = []
	r.push(menu)
	return r.concat(kStories)
}










});

