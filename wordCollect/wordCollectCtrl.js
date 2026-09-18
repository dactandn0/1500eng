
document.write('<script src="./wordCollect/ielts_syn.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/word_family.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/same_sound.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/voca_special.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/3k_words_data.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/nail_words_data.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/5k_ielt_words.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/4k_words_data.js" type="text/javascript"></script>');
document.write('<script src="./wordCollect/beginner_reading_voca.js" type="text/javascript"></script>');


var app = angular.module("wordCollectApp", []);
app.controller("wordCollectCtrl", function($scope, $rootScope, $timeout, $filter) {

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
$scope.wordPageSize = 10;
$scope.wordPage = 0;

// words da loc theo search (dung chung cho list + dem trang)
$scope.filteredWords = function (cat) {
	try {
		var arr = (cat && cat.words) || [];
		if (!$scope.wordSearch) return arr;
		return $filter('filter')(arr, $scope.wordSearch);
	} catch (e) { return (cat && cat.words) || []; }
};
$scope.wordPageCount = function (cat) {
	var n = $scope.filteredWords(cat).length;
	return n <= $scope.wordPageSize ? 1 : Math.ceil(n / $scope.wordPageSize);
};
$scope.wordPrevPage = function (cat) {
	var pc = $scope.wordPageCount(cat);
	$scope.wordPage = ($scope.wordPage - 1 + pc) % pc;
};
$scope.wordNextPage = function (cat) {
	var pc = $scope.wordPageCount(cat);
	$scope.wordPage = ($scope.wordPage + 1) % pc;
};

$scope.saveNoted = function(word) {
 	IndexCtrlScope.saveNoted (word);
}

$scope.IsWordSavedBefore = function(word) {
  return IndexCtrlScope.IsWordSavedBefore(word);
}

// =====================================================
// Cau vi du local (click word -> show 2 examples; click sentence -> speak)
// Tim trong stories san co (IndexCtrlScope.fetchSentences), lay 2 cau dau.
// =====================================================
$scope.exSent = {}; // headword -> { loading, list } (cache, fetch 1 lan)
$scope.openExHead = null; // headword dang mo example, chi 1 word mo tai 1 thoi diem

$scope.wordHead = function (full) {
	try {
		if (typeof Helper_GetVocaFromWordFull === 'function') return Helper_GetVocaFromWordFull(full);
	} catch (e) {}
	return full;
};

$scope.wordClick = function (ev, word) {
	try { IndexCtrlScope.Index_Speak(ev, word.full); } catch (e) {}
	var head = $scope.wordHead(word.full);
	if (!($scope.exSent[head])) {
		$scope.exSent[head] = { loading: false, list: fetchLocalExamples(head) };
	}
	// toggle: dang mo thi dong, nguoc lai dong word khac + mo word nay
	$scope.openExHead = ($scope.openExHead === head) ? null : head;
};

$scope.speakSentence = function (ev, sen) {
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	var txt = String(sen == null ? '' : sen).replace(/(<([^>]+)>)/ig, '');
	if (!txt.trim()) return;
	try {
		if (typeof Text2SpeechReplay === 'function') Text2SpeechReplay(txt);
		else Text2Speech(txt);
	} catch (e) {}
};

function fetchLocalExamples(head) {
	try {
		var r = IndexCtrlScope.fetchSentences(head);
		if (r && r.length) return r.slice(0, 2);
	} catch (e) {}
	return [];
}

$scope.acc_isShow = function (id) {
	return $scope.openCategories[id] === true;
};

$scope.acc_click = function (id) {
	// single-open: mo header nay thi dong cac header khac
	var willOpen = !$scope.openCategories[id];
	$scope.openCategories = {};
	$scope.wordPage = 0;
	if (willOpen) $scope.openCategories[id] = true;
	$scope.allCategoriesOpen = $scope.storyTitles.length > 0 && $scope.storyTitles.every(function (_, index) {
		return $scope.openCategories[index] === true;
	});
	$scope.acc = willOpen ? id : -1;
	$scope.words = willOpen && $scope.storyTitles[id] ? $scope.storyTitles[id].words : [];
	if (willOpen) {
		try { localStorage.setItem("w3000_idx", id); } catch (e) {}
		// doi accordion render xong roi scroll toi tu dau tien
		$timeout(function () {
			try {
				var el = document.getElementById('wcat-' + id);
				if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			} catch (e2) {}
		}, 60);
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

