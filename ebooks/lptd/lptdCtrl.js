// include other *.js

document.write('<script src="./ebooks/lptd/data/cd1_data.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/lptd/data/cd2_data.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/lptd/data/cd3_data.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/lptd/data/cd4_data.js" type="text/javascript"></script>');

var app = angular.module("lptdApp", []);
app.controller("lptdCtrl", function($scope, $rootScope, $timeout ) {

radioCD = 1;
$scope.stories = lptd_cd1_stories; //1
$scope.storyIdx = 0;

var keyU = 'lptd_u_'

radioCDChange = function (cd)
{
	keyU = removeStrDigit(keyU) + cd
	switch (cd) {
		case 1: $scope.stories = lptd_cd1_stories; break;
		case 2: $scope.stories = lptd_cd2_stories; break;
		case 3: $scope.stories = lptd_cd3_stories; break;
		case 4: $scope.stories = lptd_cd4_stories; break;
	}
	Helper_MakeVoca_Menu_Titles($rootScope, $scope)

	Helper_saveDB("lptd_cd", cd);
	radioCD = cd;

	$scope.fetchStory(Helper_loadInt(keyU, 0));
}

$scope.range = function(min, max, step) {
    return RANGE(min, max, step);
};

$scope.createAudioSrc = function() {
	var ROOT = "./ebooks/lptd/data/"
	if (HELPER_FOR_TEST) return ROOT + "cd1/test/0b.mp3"
	return ROOT + "cd" + radioCD + "/" + ($scope.storyIdx - 1 ) + '.mp3';  // due to Menu
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	Helper_AudioLoop($scope, $rootScope);
});

$scope.fetchStory = function (idx) 
{
	Helper_FetchStory (idx, $scope, $rootScope, keyU);
}

$scope.loadData = function () {
	var cd = Helper_loadInt('lptd_cd', 1);
	radioCDChange(cd);
	document.lptd_cdForm.radioCD.value = cd;
	radioCD = cd;
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});

});

