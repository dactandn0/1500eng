var app = angular.module("listensrtApp", ['toastr']);
app.controller("listensrtCtrl", function($scope, $rootScope, $timeout, $interval, $sce, toastr) {

$scope.lessons = (typeof LISTEN_DATA !== 'undefined') ? LISTEN_DATA.slice() : [];
// order: so nho len truoc. Khong co order -> xuong cuoi (giu thu tu cu).
$scope.lessons.sort(function (a, b) {
	const oa = (a && typeof a.order === 'number') ? a.order : 1e9;
	const ob = (b && typeof b.order === 'number') ? b.order : 1e9;
	return oa - ob;
});
// bIgnored: 1 -> an khoi dropbox (0/khong co -> hien)
$scope.lessonChoices = $scope.lessons.map(function (ls, i) {
	return { i: i, title: ls.title, show: !(ls && ls.bIgnored) };
}).filter(function (c) { return c.show; });
$scope.lessonIdx = ($scope.lessonChoices.length ? $scope.lessonChoices[0].i : 0);
// Nho bai dang mo (theo id cho chac) -> mo lai dung bai
try {
	if (typeof Helper_ListenLessonKey !== 'undefined' && typeof Helper_loadStr === 'function') {
		const savedId = Helper_loadStr(Helper_ListenLessonKey, '');
		if (savedId) {
			for (let k = 0; k < $scope.lessonChoices.length; k++) {
				if ($scope.lessons[$scope.lessonChoices[k].i].id === savedId) {
					$scope.lessonIdx = $scope.lessonChoices[k].i;
					break;
				}
			}
		}
	}
} catch (e) {}
$scope.lessonSearch = '';
$scope.lessonDropOpen = false;
$scope.pickLesson = function (c) {
	if (!c) return;
	$scope.lessonSearch = c.title;
	$scope.lessonDropOpen = false;
	$scope.openLesson(c.i);
};
$scope.closeLessonDrop = function () {
	$timeout(function () { $scope.lessonDropOpen = false; }, 150);
};
$scope.selectAllLesson = function (ev) {
	// Bam vao o tim la boi den het de go de
	try { if (ev && ev.target && ev.target.select) ev.target.select(); } catch (e) {}
};
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
let programPause = false; // pause do CODE (loop) -> bo qua pause handler
let userPaused = false; // pause do USER bam tay

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
	// reset loop TRUOC teardown (event seeking async tu load() toi sau phai thay loop da tat)
	$scope.loopIdx = -1;
	$scope.loopCount = 0;
	try { clearTimeout(loopTimer); loopTimer = null; } catch (e) {}
	try { Text2SpeechStop(); } catch (e2) {}
	teardown();
	$scope.lessonIdx = +i || 0;
	$scope.lesson = $scope.lessons[$scope.lessonIdx] || null;
	// luu bai dang mo
	try {
		if ($scope.lesson && typeof Helper_ListenLessonKey !== 'undefined')
			Helper_saveDB(Helper_ListenLessonKey, $scope.lesson.id || '');
	} catch (e) {}
	$scope.curIdx = -1;
	$scope.lessonSearch = ($scope.lesson && $scope.lesson.title) || '';
	$scope.videoErr = '';
	$scope.videoUrl = null;
	$scope.isAudio = false;
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
					if (videoEl._watchPA) videoEl.removeEventListener('pause', videoEl._watchPA);
					if (videoEl._watchPL) videoEl.removeEventListener('play', videoEl._watchPL);
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
				// pause tay -> huy replay dang cho (play lai se hen moi qua tick)
				videoEl._watchPA = function () {
					if (programPause) { programPause = false; return; }
					userPaused = true;
					try { clearTimeout(loopTimer); loopTimer = null; } catch (e) {}
				};
				videoEl.addEventListener('pause', videoEl._watchPA);
				videoEl._watchPL = function () {
					userPaused = false;
				};
				videoEl.addEventListener('play', videoEl._watchPL);
				videoEl._watchSK = function () {
					// seeking trong 3s sau thao tac code (seek/load/nap bai) -> bo qua.
					// Chi user keo tay that (xa thao tac code) moi tat loop.
					try { if (Date.now() - lastProgMediaAt < 3000) return; } catch (e) {}
					if ($scope.loopIdx >= 0) {
						$scope.loopIdx = -1;
						$scope.loopCount = 0;
						try { clearTimeout(loopTimer); loopTimer = null; } catch (e) {}
						try { $scope.$applyAsync(); } catch (e2) {}
					}
				};
				videoEl.addEventListener('seeking', videoEl._watchSK);
				videoEl._watchBound = $scope.lesson.src;
			}
			// Chi nap src khi bai DOI (tranh reset video khi viewContentLoaded goi lai).
			// Nap lai giua chung se dua currentTime ve 0 -> highlight nhay ve subs[0].
			if (setupForSrc !== $scope.lesson.src) {
				try {
					markProgMedia(); // nap bai moi -> seeking ke tiep la chu dong
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
	// loop 1 dong: HEN GIO dung hinh dung cuoi cau, nghi im lang du delay roi phat lai.
	// (Ban cu: delay chi tri hoan lenh seek, video van chay lot sang cau B -> noise.)
	if ($scope.loopIdx >= 0 && subs[$scope.loopIdx] && subs[$scope.loopIdx].e) {
		const li = $scope.loopIdx;
		const endT = subs[li].e;
		const _delay = Math.max(0, parseInt($scope.loopDelay, 10) || 0);
		const pauseMedia = function () {
			programPause = true;
			setTimeout(function () { programPause = false; }, 1500); // an toan neu pause event ko toi
			try {
				if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
				else { const me = mediaEl(); if (me) me.pause(); }
			} catch (e) {}
		};
		const mediaPlaying = function () {
			try {
				if (ytPlayer && ytPlayer.getPlayerState) return (ytPlayer.getPlayerState() === 1);
				const me = mediaEl();
				return !!(me && !me.paused && !me.ended);
			} catch (e) { return true; }
		};
		// toi gio: dung hinh ngay + hen phat lai sau delay (im lang tuyet doi)
		const beginPause = function () {
			loopTimer = null;
			try {
				if ($scope.loopIdx !== li) return;
				if (!$scope.lesson || $scope.lesson.subs[li] !== subs[li]) return;
				if (!mediaPlaying()) return; // user pause roi -> thoi
				pauseMedia();
				loopTimer = setTimeout(function () {
					loopTimer = null;
					try {
						if ($scope.loopIdx !== li) return;
						if (!$scope.lesson || $scope.lesson.subs[li] !== subs[li]) return;
						$scope.loopCount += 1;
						$scope.seekSub(subs[li], null, true);
						// watchdog: play() doi khi bi reject am tham -> video dung im.
						// 1.2s sau van pause (ma khong phai user pause) thi play lai.
						setTimeout(function () {
							try {
								if ($scope.loopIdx !== li) return;
								if (userPaused) return;
								const me = mediaEl();
								if (me && me.paused && !me.ended) {
									const p = me.play();
									if (p && typeof p.catch === 'function') p.catch(function () {});
								}
							} catch (e) {}
						}, 1200);
					} catch (e) {}
				}, _delay);
			} catch (e) {}
		};
		if (t >= endT - 0.03) {
			// sat/dung cuoi cau. NHUNG: neu video dang pause (dang nghi cho delay
			// hoac user pause) thi DE YEN cho timer cu, khong duoc xoa + hen lai.
			let playingNow = true;
			try {
				if (ytPlayer && ytPlayer.getPlayerState) playingNow = (ytPlayer.getPlayerState() === 1);
				else { const me0 = mediaEl(); playingNow = !!(me0 && !me0.paused && !me0.ended); }
			} catch (e) {}
			if (!playingNow) {
				if ($scope.curIdx !== li) {
					$scope.curIdx = li;
					try { $scope.$applyAsync(); } catch (e2) {}
				}
				return;
			}
			if (loopTimer) { try { clearTimeout(loopTimer); } catch (e) {} loopTimer = null; }
			beginPause();
		} else if (!loopTimer) {
			// chua toi: hen truoc theo thoi gian con lai de cat dung gio
			loopTimer = setTimeout(beginPause, Math.max(0, (endT - t) * 1000));
		}
		if ($scope.curIdx !== li) {
			$scope.curIdx = li;
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
		} else {
			// cung dong (replay/tu bam lai): xoa timer cu de tick hen lai chinh xac
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
		// Tu va: element mat src (ng-if render lai...) -> nap lai tu lesson
		try {
			const hasSrc = videoEl.getAttribute('src') || videoEl.currentSrc;
			if (!hasSrc && $scope.lesson && $scope.lesson.src) {
				videoEl.src = $scope.lesson.src;
				try { videoEl.load(); } catch (e2) {}
			}
		} catch (e) {}
		markProgMedia(); // seek chu dong -> seeking toi muon bao lau cung bo qua
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
	console.log('toggleLoop', idx, $scope.loopIdx);
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	if ($scope.loopIdx === idx) {
		$scope.loopIdx = -1;
		$scope.loopCount = 0;
		try { clearTimeout(loopTimer); loopTimer = null; } catch (e) {}
	} else 
	{
		$scope.loopIdx = idx;
		$scope.loopCount = 0;
		const sub = $scope.lesson && $scope.lesson.subs[idx];
		if (sub) $scope.seekSub(sub, null, true);
	}
};
// Nut "vi": chay pipeline ClickWordToSpeech (toast dict + TTS cau tieng Anh).
// Ham goc o indexCtrl scope khac (khong ke thua) nhung ngClickSpeechShowToast la global.
$scope.showVi = function (ev, sub) {
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	if (!sub || !sub.en) return;
	try {
		if (typeof ngClickSpeechShowToast === 'function') { ngClickSpeechShowToast(sub.en, true, false); return; }
	} catch (e) {}
	// fallback: toast nghia Viet
	const done = function (vi) {
		try { toastr.info(vi || '(chua co nghia Viet)', sub.en, { allowHtml: true }); } catch (e) {}
	};
	if (sub.vi) { done(sub.vi); return; }
	try {
		if (typeof dictFetchVi === 'function') {
			dictFetchVi(sub.en).then(function (vi) {
				$timeout(function () { done(vi); });
			}, function () { $timeout(function () { done(''); }); });
		} else done('');
	} catch (e) { done(''); }
};

// Seek chu dong (code) vs user keo thanh tua native:
// keo tay trong luc loop -> TAT loop. Danh dau THOI DIEM thay vi dem event
// (load()/metadata cham van dung; event toi tre bao lau cung dung).
let lastProgMediaAt = 0;
function markProgMedia() {
	try { lastProgMediaAt = Date.now(); } catch (e) {}
}

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

// Debug: chay trong Console khi loop/seek hong -> paste ket qua
// JSON.stringify(__watchDbg())
window.__watchDbg = function () {
	try {
		const me = mediaEl();
		return {
			lesson: ($scope.lesson && $scope.lesson.title) || null,
			curIdx: $scope.curIdx, loopIdx: $scope.loopIdx, loopCount: $scope.loopCount,
			hasEl: !!me,
			elTag: me && me.tagName,
			srcAttr: me && me.getAttribute('src'),
			currentSrc: me && me.currentSrc && String(me.currentSrc).slice(-50),
			readyState: me && me.readyState, paused: me && me.paused,
			time: me && me.currentTime,
			bound: me && me._watchBound
		};
	} catch (e) { return { err: String(e) }; }
};

// mo bai dau tien KHONG bi ignore (uu tien bai da luu truoc do)
if ($scope.lessons.length) $scope.openLesson($scope.lessonIdx);

});
