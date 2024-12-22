// include other *.js

document.write('<script src="./ebooks/words4000/data/words4000_data_1.js" type="text/javascript"></script>');

var app = angular.module("words4000App", []);
app.controller("words4000Ctrl", function($scope, $rootScope, $timeout) {

$scope.cd = 1;
$scope.stories = BOOK4K_1; //1
$scope.storyIdx = 0;

radioCDChange = function (cd) {
	if (cd===1) {
		$scope.stories = BOOK4K_1;
	}
	Helper_saveDB("book_4k_cd", cd);
	$scope.cd = cd;
}


$scope.fetchAudio = function() {
	return $scope.stories[$scope.storyIdx].idx;
}

$scope.createAudioScr = function() {
	var rr = "./ebooks/words4000/data/words4000_" + $scope.cd + "/" + $scope.fetchAudio() + '.mp3';
	return rr;
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
  	Helper_AudioLoop($scope);
});

$scope.fetchStory = function (idx, reset=true) 
{
	Helper_FetchStory (idx, $scope, $rootScope, "book_4k_unit", reset);
}

$scope.loadData = function () {
	var cd = Helper_loadInt('book_4k_cd', 1)
	radioCDChange(parseInt(cd));
	document.word4k_cdForm.radioCD.value=cd;

	$scope.storyIdx = Helper_loadInt('book_4k_unit', 0)
	$scope.fetchStory($scope.storyIdx, false);
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});


});
