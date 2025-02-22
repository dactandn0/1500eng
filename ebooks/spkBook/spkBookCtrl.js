// include other *.js

document.write('<script src="./ebooks/spkBook/data/collins/collins_cd12.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/spkBook/data/formula/formula.js" type="text/javascript"></script>');

var app = angular.module("spkBookApp", ['ngSanitize']);
app.controller("spkBookCtrl", function($scope, $rootScope, $timeout) {

var imgRootPath = './ebooks/spkBook/data/' ; 						
$scope.img_root = imgRootPath + 'collins/img/'	

$scope.stories = collins_cd12;
$scope.storyIdx = 0;
$scope.bookRadio = 0 ; 	

$scope.titles = showStoryTitles($scope.stories);  // def
makeVocaEbook($rootScope, collins_cd12) 		// def

var key0 = 'collins_unit'
var key1 = 'formula_unit'

bookRadioChange = function (num, isLoadData = false) {
	$scope.$broadcast("child_stopSound");

	$rootScope.vocaEbook = null;
	$scope.bookRadio = num;

	var key = key0

	if (num===0) 
	{
		$scope.img_root = imgRootPath + 'collins/img/'
		$scope.stories = collins_cd12;
		makeVocaEbook($rootScope, collins_cd12)
	}
	if (num===1)
	{
		$scope.img_root = imgRootPath + 'formula/img/'	
		$scope.stories = FORMULA_DATA;
		makeVocaEbook($rootScope, FORMULA_DATA)
		key = key1
	}

	$scope.titles = showStoryTitles($scope.stories);

	var idx = Helper_loadInt(key, 0);
	$scope.fetchStory(idx, false);

	if (!isLoadData) $scope.$apply();

	Helper_saveDB("Speaking_Ebook", num);
}

$scope.createAudioSrc = function() 
{
	var mp3File = $scope.story.track + '.mp3';
	var rootPath = "./ebooks/spkBook/data/"
	if ($scope.bookRadio === 0)
		return rootPath + "collins/mp3/" + mp3File
	else 
		return rootPath + "formula/mp3/" + mp3File
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	Helper_AudioLoop($scope, $rootScope);
});

$scope.fetchStory = function (idx, reset=true) 
{
	var key = key0
	if ($scope.bookRadio === 1) key = key1
	Helper_FetchStory (idx, $scope, $rootScope, key, reset) 
}

$scope.loadData = function () {
	var cd = Helper_loadInt('Speaking_Ebook', 0);
	bookRadioChange(cd, true);
	document.spk_book_bForm.bookRadio.value = cd;
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});

});
