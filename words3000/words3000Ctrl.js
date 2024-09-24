
document.write('<script src="./words3000/3k_words_data.js" type="text/javascript"></script>');
document.write('<script src="./words3000/5k_ielt_words.js" type="text/javascript"></script>');
document.write('<script src="./words3000/4k_words_data.js" type="text/javascript"></script>');
document.write('<script src="./words3000/4k_words_data_make.js" type="text/javascript"></script>');


var app = angular.module("words3000App", ['ngSanitize','ngRoute']);
app.controller("words3000Ctrl", function($scope, $timeout) {

var kSTORIES = WORDS_3K_DATA
	.concat(IELTS_5K_DATA)
	.concat(word_4000_data);


$scope.cd = 1;
$scope.stories = kSTORIES;
$scope.storyTitles = []; 
$scope.storyId = -1;
$scope.story = {};
$scope.acc = -1;

$scope.acc_isShow = function (id) {
	return $scope.acc===id;
};

$scope.acc_click = function (id) {
	if($scope.acc===id) {
		$scope.acc = -1; 
		return;
	}
	else {
		$scope.acc = id;
	}

	$scope.story = kSTORIES[$scope.acc];
	
	_scrollIntoView(id);
};


$scope.preProcess = function () {
	for (var k = 0; k < kSTORIES.length; k++) {
		var story = $scope.stories[k];
		var words = story.en.split('<br>');
		$scope.storyTitles.push({'title':story.title,'num':words.length});
	}
}

$scope.loadData = function () {
	$scope.preProcess();
};

$scope.loadData();

});