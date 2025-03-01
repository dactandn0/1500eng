// include other *.js

document.write('<script src="./ebooks/tfl/data/tfl_b1_data.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/tfl/data/tfl_b2_data.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/tfl/data/spell_data.js" type="text/javascript"></script>');

var app = angular.module("tflApp", []);
app.controller("tflCtrl", function($scope, $rootScope, $timeout ) {

KBook = 1;
$scope.stories = tfl_b1_stories; 					//def
$scope.storyIdx = 0;

var keyU = 'tfl_u_'

bookChange = function (num) {
	switch (num) {
		case 0: $scope.stories = SPELL_DATA; break;
		case 1: $scope.stories = tfl_b1_stories; break;
		case 2: $scope.stories = tfl_b2_stories; break;
	}
	Helper_MakeVoca_Menu_Titles($rootScope, $scope)

	keyU = removeStrDigit(keyU) + num
	var idx = Helper_loadInt(keyU, 0);

	Helper_saveDB("tfl_b", num);
	KBook = num;
	$scope.fetchStory(idx);

}

$scope.styleTrack = function(trackId) {
	trackId = trackId.split('.')[0]
	var num = Number(trackId)
	if (num % 2 === 0) return {color : 'green'}
		return {color : 'orange'}
}

$scope.createAudioSrc = function() {
	return "./ebooks/tfl/data/mp3/tfl_b" + KBook + "/" + $scope.story.track + '.mp3';
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	Helper_AudioLoop($scope, $rootScope);
});

$scope.fetchStory = function (idx) 
{
	Helper_FetchStory (idx, $scope, $rootScope, keyU) 
}

$scope.loadData = function () {
	var bookData = Helper_loadInt('tfl_b', 1);
	KBook = bookData;

	bookChange(bookData);
	document.tfl_bForm.book.value = bookData;
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});


});

