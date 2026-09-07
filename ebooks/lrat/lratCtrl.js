
document.write('<script src="./ebooks/lrat/data/1/lrat_l_1.js" type="text/javascript"></script>');


var app = angular.module("lratApp", []);
app.controller("lratCtrl", function($scope, $rootScope, $timeout) {

const imgRootPath = './ebooks/lrat/data' ;
let bookIdx = 0 ;
$scope.story = '';

$scope.stories = LRAT_DATA_L_1;			

const keyU = "lrat_u_"

window.lratBookIdxChange = function (num, isLoadData = false) {
	$scope.$broadcast("child_stopSound");
	bookIdx = num;

	Helper_saveDB("lrat_book", num);

	if (num===1) 
	{
		$scope.stories = LRAT_DATA_L_1
	}
	else if (num===2)
	{
		$scope.stories = LRAT_DATA_L_2
	}

	$scope.img_root = `${imgRootPath}/${num}/images`
	$scope.fetchStory(Helper_loadInt(keyU, 0));

	Helper_MakeVoca_Menu_Titles($rootScope, $scope, false)  // needn't menu

}

$scope.createAudioSrc = function() {
	if (!$scope.story || !$scope.story.track) return ''
	const mp3File = $scope.story.track + '.mp3';
	const rootPath = `./ebooks/lrat/data/${bookIdx}/mp3/`
	return rootPath + mp3File
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	Helper_AudioLoop($scope, $rootScope);
});

$scope.fetchStory = function (idx) 
{
	Helper_FetchStory (idx, $scope, $rootScope, keyU) 
}

$scope.loadData = function () {
	const cd = Helper_loadInt('lrat_book', 1);
	window.lratBookIdxChange(cd, true);
	document.ltar_bookForm.bookIdx.value = cd;
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});


});
