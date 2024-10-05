
document.write('<script src="./words3000/voca_special.js" type="text/javascript"></script>');
document.write('<script src="./words3000/3k_words_data.js" type="text/javascript"></script>');
document.write('<script src="./words3000/5k_ielt_words.js" type="text/javascript"></script>');
document.write('<script src="./words3000/4k_words_data.js" type="text/javascript"></script>');
// document.write('<script src="./words3000/4k_words_data_make.js" type="text/javascript"></script>');


var app = angular.module("words3000App", 
	[
	]);
app.controller("words3000Ctrl", function($scope) {


var kSTORIES = WORDS_3K_DATA
	.concat(IELTS_5K_DATA)
	.concat(word_4000_data)
	.concat(VOCA_SPECIAL)


$scope.stories = kSTORIES;
$scope.storyTitles = []; 
$scope.storyId = -1;
$scope.story = {};
$scope.acc = -1;
$scope.words = [];

$scope.saveNoted = function(event, word) {
 	IndexCtrlScope.saveNoted (event, word);
}

$scope.IsWordSavedBefore = function(word) {
  return IndexCtrlScope.IsWordSavedBefore(word);
} 

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

	var element = kSTORIES[$scope.acc];
	$scope.words = element.en.split("<br>");

	_scrollIntoView(id);
	localStorage.setItem("w3000_idx", id);
};

$scope.preProcess = function () {
	for (var k = 0; k < kSTORIES.length; k++) {
		var story = $scope.stories[k];
		var words = story.en.split('<br>');
		$scope.storyTitles.push({'title':story.title,'num':words.length});
	}
}

$scope.loadData = function () {
	if (localStorage.hasOwnProperty("w3000_idx")) {
		$scope.acc_click( Number(localStorage.w3000_idx)  );
	}
	$scope.preProcess();
};

 $scope.$on('$viewContentLoaded', function(){
  });

$scope.loadData();

});

