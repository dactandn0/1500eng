var app = angular.module('audioApp', []);

app.controller('AudioCtrl', ['$scope', '$rootScope', 'toastr', function($scope, $rootScope, toastr) {

	$rootScope.audio_repeatCur = 0;
	$rootScope.audio_repeatNum = Helper_loadFloat(Helper_RepeatNumKey, HELPER_REPEAT_NUM_DEF)
	$rootScope.adjAudioTime = Helper_loadInt(Helper_AdjAudioTimeKey, HELPER_ADJ_AUDIO_TIME_DEF)

	$rootScope.$on('$routeChangeStart', function() {
		$scope.stopSound();
		$rootScope.audioSrc = ''
		$rootScope.vocaEbook = []
		$scope.audio = null;
	});

	var audioDuration = 0; // giu cho (truoc dung cho slider, gio <audio> native tu co seekbar)

	// Cuon xuong qua 80px -> dock thanh audio xuong day man hinh (giong listensrt)
	function updateEbookDock() {
		try {
			const bar = document.querySelector('.ebook-audio-sticky');
			if (!bar) return;
			const y = window.pageYOffset || document.documentElement.scrollTop || 0;
			if (y > 80) bar.classList.add('is-docked');
			else bar.classList.remove('is-docked');
		} catch (e) {}
	}
	try { window.addEventListener('scroll', updateEbookDock, { passive: true }); } catch (e) {}
	$scope.$on('$destroy', function() {
		try { window.removeEventListener('scroll', updateEbookDock); } catch (e) {}
	});

	$scope.bPlaying = false;
	$scope.bPause = false;
	$scope.audio;
	kCurrTime = 0; // for pause()

	function bindAudioEnded(el) {
		try {
			if (!el || el._ebookBound) return;
			el._ebookBound = true;
			el.addEventListener('ended', function() {
				$scope.stopSound();
				$scope.$emit('parent_whenAudioEnded');
			});
		} catch (e) {}
	}

	let loadedAudioSrc = null; // src da nap vao element (getAttribute tra URL tuyet doi -> khong so sanh attr)
	function loadAudioEl(src) {
		try {
			if (!src || src === loadedAudioSrc) return document.getElementById('ebookAudio');
			const el = document.getElementById('ebookAudio');
			if (!el) return null;
			loadedAudioSrc = src;
			el.src = src;
			el.load();
			bindAudioEnded(el);
			return el;
		} catch (e) { return null; }
	}

	// audio hien mac dinh: doi story (audioSrc doi) -> nap lai element, khong autoplay
	$scope.$watch(function() { return $rootScope.audioSrc; }, function(src) {
		loadAudioEl(src);
	});

	$scope.$on("child_stopSound", function(event, data) {
		$scope.stopSound();
	});

	$scope.$on("child_playFullSound", function(event, data) {
		$scope.playFullSound();
	});


	$scope.stopSound = function() {
		if ($scope.audio) {
			$scope.audio.pause();
			$scope.audio.currentTime = 0;
			$scope.audio = null;
		}
		kCurrTime = 0;
		$scope.bPlaying = false;
		$scope.bPause = false;

		$scope.$evalAsync();
	};

	$scope.playFullSound = function() {
		if ($scope.bPlaying) {
			$scope.stopSound();
			return;
		}
		// <audio> hien mac dinh (khong nut Play): lay element, gan src hien tai + play
		try {
			const el = loadAudioEl($rootScope.audioSrc);
			if (!el) return;
			$scope.audio = el;
			$scope.bPlaying = true;
			$scope.bPause = false;
			$scope.$evalAsync();
			const pr = el.play();
			if (pr && pr.catch) pr.catch(e => {
				toastr.error(e)
				$scope.stopSound();
			});
		} catch (e) { $scope.stopSound(); }
	}

	$scope.loadData = function() {}

	$scope.$on('$viewContentLoaded', function() {
		$scope.loadData();
	});


}]);

// Paging cho danh sach track (includes/storyL.html) - dung chung moi trang ebook.
// Scope ke thua: doc titles / storyIdx / fetchStory tu controller cua trang.
app.controller('trackPagerCtrl', ['$scope', function($scope) {
	$scope.pageSize = 20;
	$scope.trackPage = 0;
	function total() { return ($scope.titles && $scope.titles.length) || 0; }
	$scope.pageCount = function () {
		const n = total();
		return n <= $scope.pageSize ? 1 : Math.ceil(n / $scope.pageSize);
	};
	$scope.prevPage = function () {
		const pc = $scope.pageCount();
		$scope.trackPage = ($scope.trackPage - 1 + pc) % pc;
	};
	$scope.nextPage = function () {
		const pc = $scope.pageCount();
		$scope.trackPage = ($scope.trackPage + 1) % pc;
	};
	$scope.goTrack = function (idx) {
		$scope.trackPage = Math.floor(idx / $scope.pageSize);
		try { $scope.fetchStory(idx); } catch (e) {}
	};
	// storyIdx doi (bam track / nut prev-next audio / load lai) -> nhay ve dung trang
	$scope.$watch('storyIdx', function (v) {
		if (typeof v === 'number' && v >= 0) $scope.trackPage = Math.floor(v / $scope.pageSize);
	});
	$scope.$watch('titles.length', function () {
		const pc = $scope.pageCount();
		if ($scope.trackPage >= pc) $scope.trackPage = Math.max(0, pc - 1);
	});
}]);