
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
	pool: [],
	items: [],
	index: 0,
	current: null,
	direction: 'en-vi',
	questionText: '',
	correctHead: '',
	correctMeaning: '',
	options: [],
	correctIdx: -1,
	picked: -1,
	answered: false,
	score: 0,
	streak: 0,
	bestStreak: 0,
	wrong: []
};

const QUIZ_ROUND_SIZE = 20;
const QUIZ_OPTION_COUNT = 4;

function quizShuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
	}
	return arr;
}

function quizHeadword(word) {
	try { return Helper_GetVocaFromWordFull(word.full); } catch (e) { return ''; }
}

function quizMeaning(word) {
	try { return Helper_RemoveHTMLtag(word.p2); } catch (e) { return word.p2 || ''; }
}

// Nghĩa gọn cho Quiz: bỏ tag + bỏ /IPA/ đầu dòng (có IPA dễ quá)
function quizPlainMeaning(word) {
	let s = quizMeaning(word);
	s = s.replace(/^\s*\/[^\/]*\/\s*/, '');
	if (!s) s = quizMeaning(word);
	return s;
}

$scope.startQuiz = function (wrongOnly) {
	let pool = [];
	for (let i = 0; i < $scope.storyTitles.length; i++) {
		const words = $scope.storyTitles[i].words;
		for (let k = 0; k < words.length; k++) {
			pool.push({ word: words[k], cat: i });
		}
	}
	if (wrongOnly && $scope.quiz.wrong.length) {
		pool = $scope.quiz.wrong.slice();
	}
	$scope.quiz.pool = pool;
	$scope.quiz.items = quizShuffle(pool.slice()).slice(0, QUIZ_ROUND_SIZE);
	$scope.quiz.index = 0;
	$scope.quiz.score = 0;
	$scope.quiz.streak = 0;
	$scope.quiz.bestStreak = 0;
	$scope.quiz.wrong = [];
	$scope.quiz.finished = !$scope.quiz.items.length;
	$scope.quiz.active = true;
	if ($scope.quiz.items.length) $scope.buildQuizQuestion();
};

function quizPickDistractors(entry, count) {
	const picked = [];
	const usedFull = {};
	usedFull[entry.word.full] = true;
	// Ưu tiên từ cùng topic -> đáp án nhiễu khó hơn
	const sameCat = $scope.quiz.pool.filter(function (e) { return e.cat === entry.cat && !usedFull[e.word.full]; });
	const others = $scope.quiz.pool.filter(function (e) { return e.cat !== entry.cat && !usedFull[e.word.full]; });
	quizShuffle(sameCat);
	quizShuffle(others);
	const ordered = sameCat.concat(others);
	for (let i = 0; i < ordered.length && picked.length < count; i++) {
		picked.push(ordered[i]);
		usedFull[ordered[i].word.full] = true;
	}
	return picked;
}

$scope.buildQuizQuestion = function () {
	const entry = $scope.quiz.items[$scope.quiz.index];
	if (!entry) {
		$scope.quiz.finished = true;
		return;
	}
	$scope.quiz.current = entry.word;
	const roll = Math.random();
	$scope.quiz.direction = roll < 0.4 ? 'en-vi' : (roll < 0.7 ? 'vi-en' : 'listen');
	$scope.quiz.questionText = ($scope.quiz.direction === 'en-vi') ? '' : quizPlainMeaning(entry.word);
	$scope.quiz.correctHead = quizHeadword(entry.word);
	$scope.quiz.correctMeaning = quizPlainMeaning(entry.word);
	const distractors = quizPickDistractors(entry, QUIZ_OPTION_COUNT - 1);
	const entries = quizShuffle([entry].concat(distractors));
	$scope.quiz.options = entries.map(function (e) {
		let text;
		if ($scope.quiz.direction === 'en-vi') {
			text = quizPlainMeaning(e.word);
		} else if ($scope.quiz.direction === 'listen') {
			text = quizHeadword(e.word) + ' – ' + quizPlainMeaning(e.word);
		} else {
			text = quizHeadword(e.word);
		}
		return { entry: e, display: text, meaning: quizPlainMeaning(e.word) };
	});
	$scope.quiz.correctIdx = -1;
	for (let i = 0; i < entries.length; i++) {
		if (entries[i].word.full === entry.word.full) { $scope.quiz.correctIdx = i; break; }
	}
	$scope.quiz.picked = -1;
	$scope.quiz.answered = false;
	// Kiểu nghe: tự phát âm 1 lần (browser có thể chặn autoplay -> bấm nút loa để nghe lại)
	if ($scope.quiz.direction === 'listen') {
		try { Text2Speech($scope.quiz.correctHead); } catch (e) {}
	}
};

$scope.answerQuiz = function (idx) {
	if ($scope.quiz.answered || idx < 0) return;
	$scope.quiz.answered = true;
	$scope.quiz.picked = idx;
	if (idx === $scope.quiz.correctIdx) {
		$scope.quiz.score += 1;
		$scope.quiz.streak += 1;
		if ($scope.quiz.streak > $scope.quiz.bestStreak) $scope.quiz.bestStreak = $scope.quiz.streak;
	} else {
		$scope.quiz.streak = 0;
		$scope.quiz.wrong.push({
			word: $scope.quiz.current,
			cat: ($scope.quiz.items[$scope.quiz.index] || {}).cat,
			head: quizHeadword($scope.quiz.current),
			meaning: quizPlainMeaning($scope.quiz.current)
		});
	}
};

$scope.quizSpeak = function (ev) {
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	if (!$scope.quiz.current) return;
	try { Text2Speech(quizHeadword($scope.quiz.current)); } catch (e) {}
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

$scope.nextQuiz = function () {
	$scope.quiz.index += 1;
	if ($scope.quiz.index >= $scope.quiz.items.length) {
		$scope.quiz.current = null;
		$scope.quiz.finished = true;
	} else {
		$scope.buildQuizQuestion();
	}
};

$scope.retryWrongQuiz = function () {
	$scope.startQuiz(true);
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

