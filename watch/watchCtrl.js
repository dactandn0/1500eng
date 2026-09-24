var app = angular.module("watchApp", []);
app.controller("watchCtrl", function($scope, $rootScope, $timeout, $interval, $sce) {

$scope.lessons = (typeof WATCH_DATA !== 'undefined') ? WATCH_DATA.slice() : [];
// order: so nho len truoc. Khong co order -> xuong cuoi (giu thu tu cu).
$scope.lessons.sort(function (a, b) {
	const oa = (a && typeof a.order === 'number') ? a.order : 1e9;
	const ob = (b && typeof b.order === 'number') ? b.order : 1e9;
	return oa - ob;
});
$scope.lessonIdx = '0';
$scope.lesson = null;
$scope.curIdx = -1;
$scope.follow = true;
$scope.loopIdx = -1; // index dong dang loop (-1 = tat)
$scope.loopCount = 0; // dem so vong da lap
$scope.loopDelay = (typeof HELPER_LOOP_DELAY_DEF !== 'undefined') ? HELPER_LOOP_DELAY_DEF : 400;
try {
	if (typeof Helper_LoopDelayKey !== 'undefined' && typeof Helper_loadInt === 'function') {
		const _ld = Helper_loadInt(Helper_LoopDelayKey, $scope.loopDelay);
		$scope.loopDelay = (_ld >= 0 && _ld <= 10000) ? _ld : $scope.loopDelay;
	}
} catch (e) {}
$scope.setLoopDelay = function () {
	let v = parseInt($scope.loopDelay, 10);
	if (isNaN(v) || v < 0) v = 0;
	if (v > 10000) v = 10000;
	$scope.loopDelay = v;
	try { Helper_saveDB(Helper_LoopDelayKey, v); } catch (e) {}
};
$scope.videoErr = '';
$scope.videoUrl = null; // trusted 1 lan/khi doi bai (tranh reload loop)
$scope.isAudio = false; // true khi lesson la file tieng (mp3/wav...)

let videoEl = null;
let ytPlayer = null;
let pollTimer = null;
let seekGraceUntil = 0; // bo qua timeupdate cu ngay sau khi seek (tranh highlight nhay ve dau)
let setupForSrc = null; // src da nap xong -> setupPlayer goi lai (viewContentLoaded) thi KHONG reset
let loopTimer = null; // hen gio replay khi loop 1 dong

$scope.trustSrc = function (src) {
	try { return $sce.trustAsResourceUrl(src); } catch (e) { return src; }
};

function stopPoll() {
	try { if (pollTimer) $interval.cancel(pollTimer); } catch (e) {}
	pollTimer = null;
}
function teardown() {
	stopPoll();
	setupForSrc = null;
	try {
		if (ytPlayer && ytPlayer.destroy) ytPlayer.destroy();
	} catch (e) {}
	ytPlayer = null;
	try {
		if (videoEl) { videoEl.pause(); videoEl.removeAttribute('src'); videoEl.load(); }
	} catch (e) {}
	videoEl = null;
}

$scope.openLesson = function (i) {
	try { Text2SpeechStop(); } catch (e) {}
	teardown();
	$scope.lessonIdx = String(i);
	$scope.lesson = $scope.lessons[i] || null;
	$scope.curIdx = -1;
	$scope.videoErr = '';
	$scope.videoUrl = null;
	$scope.isAudio = false;
	$scope.loopIdx = -1;
	$scope.loopCount = 0;
	try { clearTimeout(loopTimer); loopTimer = null; } catch (e) {}
	if (!$scope.lesson) return;
	// trust 1 lan duy nhat -> ng-src on dinh, khong bi digest reset lien tuc
	try {
		if ($scope.lesson.type !== 'youtube') {
			$scope.videoUrl = $sce.trustAsResourceUrl($scope.lesson.src);
			$scope.isAudio = /\.(mp3|wav|m4a|ogg|oga|aac|flac|wma)$/i.test($scope.lesson.src || '');
		}
	} catch (e) {}
	$timeout(function () { setupPlayer(); }, 100);
};

function mediaEl() {
	try {
		return document.getElementById('watchVideo') || document.getElementById('watchAudio');
	} catch (e) { return null; }
}

function setupPlayer(retry) {
	if (!$scope.lesson) return;
	if ($scope.lesson.type === 'youtube') {
		setupYouTube(retry);
		return;
	}
	try {
		videoEl = mediaEl();
		if (!videoEl) {
			// template chua render xong (lan dau vao route) -> thu lai vai lan
			retry = retry || 0;
			if (retry < 8) {
				$timeout(function () { setupPlayer(retry + 1); }, 200);
			}
			return;
		}
		if (videoEl._watchBound !== $scope.lesson.src) {
				// go listener cu (doi bai) de khoi nhan doi timeupdate
				try {
					if (videoEl._watchTU) videoEl.removeEventListener('timeupdate', videoEl._watchTU);
					if (videoEl._watchEN) videoEl.removeEventListener('ended', videoEl._watchEN);
					if (videoEl._watchER) videoEl.removeEventListener('error', videoEl._watchER);
					if (videoEl._watchLD) videoEl.removeEventListener('loadeddata', videoEl._watchLD);
				} catch (e) {}
				videoEl._watchTU = function () {
					try { tick(videoEl.currentTime || 0); } catch (e) {}
				};
				videoEl._watchEN = function () {
					try { $scope.$applyAsync(); } catch (e) {}
				};
				videoEl._watchER = function () {
					try {
						// chi bao loi that (404): src khop bai hien tai + NO_SOURCE.
						// Bo qua error gia khi dang doi src (teardown/load).
						const src = videoEl.getAttribute('src') || videoEl.currentSrc || '';
						if (!src || videoEl.networkState !== 3) return;
						if (src.indexOf($scope.lesson.src) < 0 && $scope.lesson.src.indexOf(src) < 0) {
							// src la URL tuyet doi sau khi resolve: so sanh duoi file
							const a = String(src).split('/').pop(), b = String($scope.lesson.src).split('/').pop();
							if (a !== b) return;
						}
						$scope.videoErr = 'Không tải được video. Nếu mở từ GitHub Pages: file mp4 chưa được push lên (git add watch/media).';
						$scope.$applyAsync();
					} catch (e) {}
				};
				videoEl._watchLD = function () {
					try {
						if ($scope.videoErr) { $scope.videoErr = ''; $scope.$applyAsync(); }
					} catch (e) {}
				};
				videoEl.addEventListener('timeupdate', videoEl._watchTU);
				videoEl.addEventListener('ended', videoEl._watchEN);
				videoEl.addEventListener('error', videoEl._watchER);
				videoEl.addEventListener('loadeddata', videoEl._watchLD);
				videoEl._watchBound = $scope.lesson.src;
			}
			// Chi nap src khi bai DOI (tranh reset video khi viewContentLoaded goi lai).
			// Nap lai giua chung se dua currentTime ve 0 -> highlight nhay ve subs[0].
			if (setupForSrc !== $scope.lesson.src) {
				try {
					videoEl.pause();
					videoEl.removeAttribute('src');
					videoEl.load();
					videoEl.src = $scope.lesson.src;
					videoEl.load();
					setupForSrc = $scope.lesson.src;
				} catch (e) {}
			}
		} catch (e) {}
	}

function ensureYtApi(cb) {	try {
		if (window.YT && window.YT.Player) { cb(); return; }
		window.__ytQueue = window.__ytQueue || [];
		window.__ytQueue.push(cb);
		if (!document.getElementById('ytApiTag')) {
			const tag = document.createElement('script');
			tag.id = 'ytApiTag';
			tag.src = 'https://www.youtube.com/iframe_api';
			document.head.appendChild(tag);
			window.onYouTubeIframeAPIReady = function () {
				try {
					(window.__ytQueue || []).forEach(function (fn) { try { fn(); } catch (e) {} });
					window.__ytQueue = [];
				} catch (e) {}
			};
		}
	} catch (e) {}
}

function setupYouTube(retry) {
	if (!document.getElementById('watchYt')) {
		// template chua render xong -> thu lai
		retry = retry || 0;
		if (retry < 8) {
			$timeout(function () { setupYouTube(retry + 1); }, 200);
		}
		return;
	}
	ensureYtApi(function () {
		try {
			if (!$scope.lesson || $scope.lesson.type !== 'youtube') return;
			if (ytPlayer && ytPlayer._watchVid === $scope.lesson.src) return; // da tao roi
			try {
				if (ytPlayer && ytPlayer.destroy) ytPlayer.destroy();
			} catch (e) {}
			ytPlayer = null;
			ytPlayer = new YT.Player('watchYt', {
				width: '100%',
				videoId: $scope.lesson.src,
				playerVars: { rel: 0 },
				events: {
					onReady: function () { startPoll(); }
				}
			});
			try { ytPlayer._watchVid = $scope.lesson.src; } catch (e) {}
			startPoll();
		} catch (e) {}
	});
}

function startPoll() {
	stopPoll();
	pollTimer = $interval(function () {
		try {
			if (ytPlayer && ytPlayer.getCurrentTime) tick(ytPlayer.getCurrentTime() || 0);
		} catch (e) {}
	}, 250);
}

// Cuon PANEL sub (chi trong div.watch-subs, khong cuon ca trang)
function scrollPanelTo(idx) {
	try {
		const panels = document.querySelectorAll('.watch-subs');
		const el = document.getElementById('wsub' + idx);
		if (!el || !panels.length) return;
		const panel = panels[panels.length - 1];
		const pr = panel.getBoundingClientRect();
		const er = el.getBoundingClientRect();
		panel.scrollTop += (er.top - pr.top) - (panel.clientHeight / 2 - er.height / 2);
	} catch (e) {}
}

// t = giay hien tai -> highlight + auto-scroll + loop-line
function tick(t) {
	if (!$scope.lesson || !$scope.lesson.subs) return;
	if (Date.now() < seekGraceUntil) return; // dang seek: bo event cu
	const subs = $scope.lesson.subs;
	let idx = -1;
	for (let i = 0; i < subs.length; i++) {
		if (t >= subs[i].t - 0.15) idx = i;
		else break;
	}
	// loop 1 dong: het cau -> nghi theo delay roi phat lai mai
	if ($scope.loopIdx >= 0 && subs[$scope.loopIdx] && subs[$scope.loopIdx].e
		&& t >= subs[$scope.loopIdx].e - 0.05) {
		if (!loopTimer) {
			const _delay = Math.max(0, parseInt($scope.loopDelay, 10) || 0);
			loopTimer = setTimeout(function () {
				loopTimer = null;
				try {
					if ($scope.loopIdx >= 0 && $scope.lesson && $scope.lesson.subs[$scope.loopIdx]) {
						$scope.loopCount += 1;
						$scope.seekSub($scope.lesson.subs[$scope.loopIdx], null, true);
					}
				} catch (e) {}
			}, _delay);
		}
		if ($scope.curIdx !== $scope.loopIdx) {
			$scope.curIdx = $scope.loopIdx;
			try { $scope.$applyAsync(); } catch (e) {}
		}
		return;
	}
	if (idx === $scope.curIdx) return;
	$scope.curIdx = idx;
	try { $scope.$applyAsync(); } catch (e) {}
	if (idx >= 0 && $scope.follow) scrollPanelTo(idx);
}

// Cham 1 dong phu de -> video nhay ve time do (+ phat tiep)
// Bam sang dong KHAC thi tat loop cu (tranh bi giat ve)
$scope.seekSub = function (sub, ev, autoplay) {
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	if (!sub) return;
	try {
		const subs0 = $scope.lesson && $scope.lesson.subs;
		if (subs0 && $scope.loopIdx >= 0 && subs0.indexOf(sub) !== $scope.loopIdx) {
			$scope.loopIdx = -1;
			$scope.loopCount = 0;
			try { clearTimeout(loopTimer); loopTimer = null; } catch (e) {}
		}
	} catch (e) {}
	const t = Math.max(0, (sub.t || 0) + 0.01);
	// optimistic update ngay: highlight dung dong, ke timeupdate cu (khong scroll)
	try {
		const subs = $scope.lesson && $scope.lesson.subs;
		if (subs) {
			const ti = subs.indexOf(sub);
			if (ti >= 0) {
				$scope.curIdx = ti;
				seekGraceUntil = Date.now() + 600;
				try { $scope.$applyAsync(); } catch (e) {}
			}
		}
	} catch (e) {}
	try {
		if (ytPlayer && ytPlayer.seekTo) {
			ytPlayer.seekTo(t, true);
			if (autoplay !== false) { try { ytPlayer.playVideo(); } catch (e) {} }
			return;
		}
	} catch (e) {}
	// Lay element MOI (video hoac audio, khong tin bien cu) + doi metadata neu chua co
	try {
		videoEl = mediaEl() || videoEl;
		if (!videoEl) return;
		const doSeek = function () {
			try { videoEl.currentTime = t; } catch (e) {}
			if (autoplay !== false) {
				try {
					const p = videoEl.play();
					if (p && typeof p.catch === 'function') p.catch(function () {});
				} catch (e) {}
			}
		};
		if (videoEl.readyState === 0) {
			const onMeta = function () {
				try { videoEl.removeEventListener('loadedmetadata', onMeta); } catch (e) {}
				doSeek();
			};
			try { videoEl.addEventListener('loadedmetadata', onMeta); } catch (e) {}
			try { videoEl.load(); } catch (e2) {}
			setTimeout(function () {
				try { if (videoEl && videoEl.readyState === 0) videoEl.load(); } catch (e3) {}
			}, 1500);
		} else {
			doSeek();
		}
	} catch (e) {}
};

// Nut loop tren MOI dong sub: bat -> loop dong do mai (nghi theo delay), bam lai -> tat
$scope.toggleLoop = function (ev, idx) {
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	if ($scope.loopIdx === idx) {
		$scope.loopIdx = -1;
		$scope.loopCount = 0;
		try { clearTimeout(loopTimer); loopTimer = null; } catch (e) {}
	} else {
		$scope.loopIdx = idx;
		$scope.loopCount = 0;
		const sub = $scope.lesson && $scope.lesson.subs[idx];
		if (sub) $scope.seekSub(sub, null, true);
	}
};
$scope.speakSub = function (ev, sub) {
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	if (!sub || !sub.en) return;
	try { (typeof Text2SpeechReplay === 'function' ? Text2SpeechReplay : Text2Speech)(sub.en); } catch (e) {}
};

$scope.fmtTime = function (s) {
	s = Math.max(0, Math.floor(s || 0));
	const m = Math.floor(s / 60);
	return m + ':' + String(s % 60).padStart(2, '0');
};

$scope.$on('$destroy', function () {
	teardown();
	try { clearTimeout(loopTimer); loopTimer = null; } catch (e) {}
	try { Text2SpeechStop(); } catch (e) {}
});

// template render xong (lan dau vao route) -> setup lai cho chac
$scope.$on('$viewContentLoaded', function () {
	try {
		if ($scope.lesson) $timeout(function () { setupPlayer(); }, 50);
	} catch (e) {}
	topFunction();
});

// mo bai dau tien
if ($scope.lessons.length) $scope.openLesson(0);

});
