
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

$scope.saveNoted = function(word) {
 	IndexCtrlScope.saveNoted (word);
}

$scope.IsWordSavedBefore = function(word) {
  return IndexCtrlScope.IsWordSavedBefore(word);
}

// =====================================================
// Cau vi du free (click word -> fetch + show; click sentence -> speak)
// 1) Tatoeba API (no key): results[].text
// 2) dictionaryapi.dev (no key): meanings[].definitions[].example
// 3) local stories (san co trong app)
// =====================================================
$scope.exSent = {}; // headword -> { show, loading, list }

$scope.wordHead = function (full) {
	try {
		if (typeof Helper_GetVocaFromWordFull === 'function') return Helper_GetVocaFromWordFull(full);
	} catch (e) {}
	return full;
};

$scope.wordClick = function (ev, word) {
	try { IndexCtrlScope.Index_Speak(ev, word.full); } catch (e) {}
	var head = $scope.wordHead(word.full);
	var slot = $scope.exSent[head];
	if (!slot) {
		slot = $scope.exSent[head] = { show: true, loading: true, list: [] };
		fetchExSentences(head, slot);
	} else {
		slot.show = !slot.show;
	}
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

function exApply() { try { $scope.$applyAsync(); } catch (e) {} }

function tatoebaSentences(w) {
	return fetch('https://tatoeba.org/en/api_v0/search?from=eng&query=' + encodeURIComponent(w) + '&limit=8').then(function (r) {
		if (!r.ok) throw 0;
		return r.json();
	}).then(function (d) {
		var out = [], seen = {};
		var esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		var re = new RegExp('\\b' + esc + '\\b', 'i');
		((d && d.results) || []).forEach(function (it) {
			var t = (it && it.text) || '';
			if (!t || seen[t] || t.length > 140 || !re.test(t)) return;
			seen[t] = 1;
			out.push(t);
		});
		return out.slice(0, 5);
	});
}

function dictApiSentences(w) {
	return fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(w)).then(function (r) {
		if (!r.ok) throw 0;
		return r.json();
	}).then(function (arr) {
		var out = [], seen = {};
		(arr || []).forEach(function (ent) {
			((ent && ent.meanings) || []).forEach(function (m) {
				((m && m.definitions) || []).forEach(function (df) {
					var t = df && df.example;
					if (t && !seen[t] && t.length <= 140) { seen[t] = 1; out.push(t); }
				});
			});
		});
		return out.slice(0, 5);
	});
}

function fetchExSentences(head, slot) {
	var finished = false;
	function done(list) {
		if (finished) return;
		finished = true;
		slot.loading = false;
		slot.list = list || [];
		exApply();
	}
	function localOnly() {
		var list = [];
		try {
			var r = IndexCtrlScope.fetchSentences(head);
			if (r && r.length) list = r.slice(0, 5);
		} catch (e) {}
		done(list);
	}
	var w = String(head == null ? '' : head).trim().toLowerCase();
	if (!/^[a-z][a-z'\-]*$/.test(w)) { localOnly(); return; }
	tatoebaSentences(w).then(function (list) {
		if (list && list.length) { done(list); return null; }
		throw 0;
	}).catch(function () {
		return dictApiSentences(w).catch(function () { return null; });
	}).then(function (list) {
		if (list && list.length) { done(list); return null; }
		throw 0;
	}).catch(function () { localOnly(); });
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

