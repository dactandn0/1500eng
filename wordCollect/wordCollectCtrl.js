
document.write('<script src="./wordCollect/nation.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/ielts_syn.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/voca_special.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/3k_words_data.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/5k_ielt_words.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/4k_words_data.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/4k_words_data_2.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/beginner_reading_voca.js" type="text/javascript"></script>');
// document.write('<script src="./wordCollect/4k_words_data_make.js" type="text/javascript"></script>');


var app = angular.module("wordCollectApp", []);
app.controller("wordCollectCtrl", function($scope, $rootScope) {

var kSTORIES = $rootScope.VocaToUI

$scope.storyTitles = []; 
$scope.storyId = -1;
$scope.story = {};
$scope.acc = -1;
$scope.words = [];

$scope.saveNoted = function(word) {
 	IndexCtrlScope.saveNoted (word);
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

	$scope.words = [];
	var element = kSTORIES[$scope.acc];
	if (element) {
		var arr = element.en.split("<br>");
		for (var i = 0; i < arr.length; i++) {
			var  word = arr[i];
			word = Helper_IsUncountNoun(word)
			$scope.words.push(Helper_SliceHalfString(word))
		}
		_scrollIntoView(id);
		localStorage.setItem("w3000_idx", id);
	}
};

$scope.preProcess = function () {
	for (var k = 0; k < kSTORIES.length; k++) {
		var story = kSTORIES[k];
		var words = story.en.split('<br>');
		$scope.storyTitles.push({'title':story.title,'num':words.length});
	}
}

$scope.loadData = function () {
	if (localStorage.hasOwnProperty("")) {
		$scope.acc_click( Helper_loadInt('w3000_idx')  );
	}
	$scope.preProcess();
};

 $scope.$on('$viewContentLoaded', function(){
  });

$scope.loadData();

});

