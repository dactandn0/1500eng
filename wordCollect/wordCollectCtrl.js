
document.write('<script src="./wordCollect/ielts_syn.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/word_family.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/same_sound.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/voca_special.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/3k_words_data.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/5k_ielt_words.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/4k_words_data.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/beginner_reading_voca.js" type="text/javascript"></script>');


var app = angular.module("wordCollectApp", []);
app.controller("wordCollectCtrl", function($scope, $rootScope) {

const kSTORIES = $rootScope.VocaToUI || [];

$scope.storyTitles = []; 
$scope.storyId = -1;
$scope.story = {};
$scope.acc = -1;
$scope.words = [];
$scope.openCategories = {};
$scope.allCategoriesOpen = false;
$scope.wordSearch = '';
$scope.totalWords = 0;
$scope.quiz = {
	active: false,
	finished: false,
	items: [],
	index: 0,
	current: null,
	answerShown: false,
	score: 0
};

$scope.saveNoted = function(word) {
 	IndexCtrlScope.saveNoted (word);
}

$scope.IsWordSavedBefore = function(word) {
  return IndexCtrlScope.IsWordSavedBefore(word);
} 

$scope.acc_isShow = function (id) {
	return $scope.openCategories[id] === true;
};

$scope.acc_click = function (id) {
	$scope.openCategories[id] = !$scope.openCategories[id];
	$scope.allCategoriesOpen = $scope.storyTitles.length > 0 && $scope.storyTitles.every(function (_, index) {
		return $scope.openCategories[index] === true;
	});
	$scope.acc = $scope.openCategories[id] ? id : -1;
	$scope.words = $scope.storyTitles[id] ? $scope.storyTitles[id].words : [];
	if ($scope.openCategories[id]) {
		_scrollIntoView(id);
		localStorage.setItem("w3000_idx", id);
	}
};

$scope.openAll = function () {
	for (let i = 0; i < $scope.storyTitles.length; i++) {
		$scope.openCategories[i] = true;
	}
	$scope.allCategoriesOpen = true;
};

$scope.closeAll = function () {
	$scope.openCategories = {};
	$scope.allCategoriesOpen = false;
	$scope.acc = -1;
	$scope.words = [];
};

$scope.toggleAll = function () {
	if ($scope.allCategoriesOpen) {
		$scope.closeAll();
	} else {
		$scope.openAll();
	}
};

$scope.startQuiz = function () {
	const quizItems = [];
	for (let i = 0; i < $scope.storyTitles.length; i++) {
		quizItems.push(...$scope.storyTitles[i].words);
	}

	$scope.quiz.items = quizItems.sort(() => Math.random() - 0.5);
	$scope.quiz.index = 0;
	$scope.quiz.current = $scope.quiz.items[0] || null;
	$scope.quiz.answerShown = false;
	$scope.quiz.score = 0;
	$scope.quiz.finished = !$scope.quiz.current;
	$scope.quiz.active = true;
};

$scope.showQuizAnswer = function () {
	$scope.quiz.answerShown = true;
};

$scope.quizKnown = function () {
	$scope.quiz.score += 1;
	$scope.nextQuiz();
};

$scope.nextQuiz = function () {
	$scope.quiz.index += 1;
	$scope.quiz.answerShown = false;
	$scope.quiz.current = $scope.quiz.items[$scope.quiz.index] || null;
	$scope.quiz.finished = !$scope.quiz.current;
};

$scope.endQuiz = function () {
	$scope.quiz.active = false;
};

$scope.preProcess = function () {
	$scope.storyTitles.length = 0;
	$scope.totalWords = 0;
	for (let k = 0; k < kSTORIES.length; k++) {
		const story = kSTORIES[k];
		const words = story.en.split('<br>').map((word) => {
			return Helper_SliceHalfString(Helper_hlUncNoun(word));
		});
		$scope.storyTitles.push({
			title: story.title,
			num: words.length,
			words: words
		});
		$scope.totalWords += words.length;
	}
}

$scope.loadData = function () {
	$scope.preProcess();
	const savedCategory = Helper_loadInt('w3000_idx', -1);
	if (savedCategory >= 0 && savedCategory < $scope.storyTitles.length) {
		$scope.acc_click(savedCategory);
	}
};

 $scope.$on('$viewContentLoaded', function(){
  });

$scope.loadData();

});

