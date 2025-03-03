// include other *.js

document.write('<script src="./ebooks/tfl/data/tfl_b1_data.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/tfl/data/tfl_b2_data.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/tfl/data/spell_data.js" type="text/javascript"></script>');

var app = angular.module("tflApp", []);
app.controller("tflCtrl", function($scope, $rootScope, $timeout ) {

$scope.KBook = 1;
$scope.stories = tfl_b1_stories; 					//def
$scope.storyIdx = 0;

$scope.img_root = './ebooks/tfl/data/images/ocg' ; 	

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
	$scope.KBook = num;
	$scope.fetchStory(idx);

}

$scope.styleTrack = function(trackId) {
	trackId = trackId.split('.')[0]
	var num = Number(trackId)
	if (num % 2 === 0) return {color : 'green'}
		return {color : 'orange'}
}

$scope.createAudioSrc = function() {
	var book
	var track
	if ($scope.KBook==0) { book = 'spell'; track = $scope.story.track }
	if ($scope.KBook==1) { book = 'tfl_b1'; track = $scope.story.track }
	if ($scope.KBook==2) { book = 'tfl_b2'; track = $scope.story.track }

	return "./ebooks/tfl/data/mp3/" + book + "/" + track + '.mp3';
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
	$scope.KBook = bookData;

	bookChange(bookData);
	document.tfl_bForm.book.value = bookData;
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});


});

