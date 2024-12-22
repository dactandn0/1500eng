// include other *.js

document.write('<script src="./ebooks/f2f/f2f_b1_data.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/f2f/f2f_b2_data.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/f2f/f2f_b6_data.js" type="text/javascript"></script>');

var app = angular.module("f2fApp", []);
app.controller("f2fCtrl", function($scope, $rootScope, $timeout ) {

var kSTORIES = f2f_b1_stories;
var KBook = 1;
$scope.stories = kSTORIES; //1
$scope.storyIdx = 0;

bookChange = function (book) {
	switch (book) {
		case 1: kSTORIES = f2f_b1_stories; break;
		case 2: kSTORIES = f2f_b2_stories; break;
		case 6: kSTORIES = f2f_b6_stories; break;
	}
	Helper_saveDB("f2f_b", book);
	KBook = book;
	$scope.fetchStory($scope.storyIdx, true);
}

$scope.createAudioSrc = function() {
	return "./ebooks/f2f/f2f_b" + KBook + "/" + $scope.story.track + '.mp3';
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

	if (idx > kSTORIES.length-1) { idx = 0 }; 
	$scope.storyIdx = idx;
	$scope.story = $scope.stories[idx];

	$rootScope.audioSrc = $scope.createAudioSrc();

	// save DB
	Helper_saveDB("f2f_unit", idx);
	if (!$scope.story) {MYLOG('Dont have Unit'); return;}
	
	$scope.story = processStory($scope.story);

}

$scope.loadData = function () {
	$scope.storyIdx = Helper_loadInt('f2f_unit', 0);
	
	var cd = Helper_loadInt('f2f_b', 1);
	bookChange(cd);
	document.f2f_bForm.book.value = cd;
	KBook=cd;

	$scope.fetchStory($scope.storyIdx, false);
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});

});

