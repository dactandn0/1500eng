// include data
document.write('<script src="./ebooks/tiktok/data/tiktok.js" type="text/javascript"></script>');

var app = angular.module("tiktokApp", ['ngSanitize']);
app.controller("tiktokCtrl", function($scope, $rootScope, $timeout) {

$scope.img_root = './ebooks/tiktok/data/img/';
$scope.stories = TIKTOK_EBOOK1_DATA;
$scope.storyIdx = 0;

var keyU = 'tiktok_u_';

$scope.createAudioSrc = function()
{
	// TikTok chua co mp3 rieng: tra ve null de nut Play bao loi nhe thay vi phat nham audio cu
	if (!$scope.story || !$scope.story.track) return null;
	return "./ebooks/spkBook/data/tiktok/mp3/" + $scope.story.track + '.mp3';
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	Helper_AudioLoop($scope, $rootScope);
});

$scope.fetchStory = function (idx)
{
	Helper_FetchStory (idx, $scope, $rootScope, keyU)
}

$scope.loadData = function () 
{
	$scope.fetchStory(Helper_loadInt(keyU, 0));
};

$scope.$on('$viewContentLoaded', function()
{
	Helper_MakeVoca_Menu_Titles($rootScope, $scope)
	$scope.loadData();
});

});
