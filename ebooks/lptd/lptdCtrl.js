// include other *.js

document.write('<script src="./ebooks/lptd/cd1_data.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/lptd/cd2_data.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/lptd/cd3_data.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/lptd/cd4_data.js" type="text/javascript"></script>');

var app = angular.module("lptdApp", []);
app.controller("lptdCtrl", function($scope, $rootScope, $timeout ) {

$scope.cd = 1;
$scope.stories = lptd_cd1_stories; //1
$scope.storyIdx = 0;

radioCDChange = function (cd) {
	switch (cd) {
		case 1: $scope.stories = lptd_cd1_stories; break;
		case 2: $scope.stories = lptd_cd2_stories; break;
		case 3: $scope.stories = lptd_cd3_stories; break;
		case 4: $scope.stories = lptd_cd4_stories; break;
	}
	Helper_saveDB("lptd_cd", cd);
	$scope.cd = cd;
	$scope.fetchStory($scope.storyIdx, true);
}

$scope.range = function(min, max, step) {
    return RANGE(min, max, step);
};

$scope.createAudioSrc = function() {
	if (HELPER_FOR_TEST) return "./ebooks/lptd/cd1/test/0b.mp3"
	return "./ebooks/lptd/cd" + $scope.cd + "/" + $scope.storyIdx + '.mp3';
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	Helper_AudioLoop($scope);
});

$scope.units = [
	{'title':"Nature", 'num': 1},
	{'title':"Science", 'num':6},
	{'title':"Art", 'num': 11},
	{'title':"Leisure", 'num':16},
	{'title':"School", 'num':21},
	{'title':"People", 'num':26},
	{'title':"Sports", 'num':31},
	{'title':"Travel", 'num':36},
];

$scope.fetchStory = function (idx, reset=true) 
{
	Helper_FetchStory (idx, $scope, $rootScope, "lptd_unit", reset);
}

$scope.loadData = function () {
	$scope.storyIdx = Helper_loadInt('lptd_unit', 0);
	
	var cd = Helper_loadInt('lptd_cd', 1);
	radioCDChange(cd);
	document.lptd_cdForm.radioCD.value = cd;
	$scope.cd=cd;

	$scope.fetchStory($scope.storyIdx, false);
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});

});

