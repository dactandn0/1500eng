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
// Nho bai dang mo (1 key 'lstLesson' = '<tenLesson>|<subIdx>') -> dropbox tu chon dung bai
try {
	const raw0 = localStorage.getItem('lstLesson') || '';
	const bar0 = raw0.lastIndexOf('|');
	if (bar0 > 0) {
		const lid = raw0.slice(0, bar0);
		for (let k = 0; k < $scope.lessonChoices.length; k++) {
			if (String($scope.lessons[$scope.lessonChoices[k].i].id) === lid) {
				$scope.lessonIdx = $scope.lessonChoices[k].i;
				break;
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
// Dieu huong dropbox bang phim tren PC: len/xuong doi highlight, Enter chon, Esc dong
$scope.lessonActive = 0;
$scope.filteredLessons = function () {
	const q = ($scope.lessonSearch || '').toLowerCase().trim();
	if (!q) return $scope.lessonChoices;
	return $scope.lessonChoices.filter(function (c) { return (c.title || '').toLowerCase().indexOf(q) >= 0; });
};
$scope.lessonKey = function (ev) {
	const key = ev.which || ev.keyCode;
	const list = $scope.filteredLessons();
	if (key === 40) { // Down
		ev.preventDefault();
		$scope.lessonDropOpen = true;
		$scope.lessonActive = Math.min(list.length - 1, $scope.lessonActive + 1);
	} else if (key === 38) { // Up
		ev.preventDefault();
		$scope.lessonDropOpen = true;
		$scope.lessonActive = Math.max(0, $scope.lessonActive - 1);
	} else if (key === 13) { // Enter
		ev.preventDefault();
		const pick = list[$scope.lessonActive] || list[0];
		if (pick) $scope.pickLesson(pick);
		else $scope.lessonDropOpen = false;
	} else if (key === 27) { // Esc
		$scope.lessonDropOpen = false;
	}
};
$scope.lesson = null;
$scope.curIdx = -1;
$scope.follow = false;
$scope.showScript = false;
$scope.lessonNotes = '';
$scope.toggleFollow = function () {
	// phai qua ham (ghi thang scope cha): nut nam trong ng-if (scope con),
	// gán trực tiếp sẽ tạo biến shadow, nút bấm mà tick không thấy
	$scope.follow = !$scope.follow;
};
$scope.toggleScript = function () {
	$scope.showScript = !$scope.showScript;
};
// Nut copy ke Script: xoay vong copy full -> tung cum N cau (N = listenNoChunkCopied 2-10) -> ve full.
$scope.copyStep = 0; // 0 = lan toi copy full; >=1 = copy cum thu copyStep
let lastCopyToast = null; // toast Copy dang mo -> mo moi thi clear cu truoc
function getChunkN() {
	try {
		let n = 2;
		if (typeof Helper_ListenChunkKey !== 'undefined' && typeof Helper_loadInt === 'function')
			n = Helper_loadInt(Helper_ListenChunkKey, 2);
		n = parseInt(n, 10);
		if (!(n >= 2 && n <= 10)) n = 2;
		return n;
	} catch (e) { return 2; }
}
function copyTextToClipboard(text, done) {
	try {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(text).then(done, done);
			return;
		}
	} catch (e) {}
	try {
		const ta = document.createElement('textarea');
		ta.value = text;
		document.body.appendChild(ta);
		ta.select();
		try { document.execCommand('copy'); } catch (e2) {}
		document.body.removeChild(ta);
	} catch (e3) {}
	done();
}
// iPhone/man hep: toast Copy dung div custom top-center; desktop dung toastr nhu cu
function isNarrowCopyToast() {
	try {
		const ua = (navigator.userAgent || '');
		if (/iPhone|iPod/i.test(ua)) return true;
		if (window.innerWidth && window.innerWidth <= 640) return true;
	} catch (e) {}
	return false;
}
$scope.copyToastMsg = '';
let copyToastTimer = null;
$scope.showCopyToast = function (msg) {
	$scope.copyToastMsg = msg;
	try { $scope.$applyAsync(); } catch (e) {}
	try { if (copyToastTimer) $timeout.cancel(copyToastTimer); } catch (e2) {}
	copyToastTimer = $timeout(function () { $scope.copyToastMsg = ''; }, 2500);
};
$scope.copyLabel = function () {
	if ($scope.copyStep <= 0) return 'all';
	try {
		const subs = ($scope.lesson && $scope.lesson.subs) || [];
		const total = Math.max(1, Math.ceil(subs.length / getChunkN()));
		return $scope.copyStep + '/' + total;
	} catch (e) { return String($scope.copyStep); }
};
$scope.copySubs = function (ev) {
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	try {
		const subs = ($scope.lesson && $scope.lesson.subs) || [];
		if (!subs.length) return;
		const n = getChunkN();
		const chunks = Math.max(1, Math.ceil(subs.length / n));
		const step = $scope.copyStep || 0;
		let text = '', msg = '';
		if (step <= 0) {
			text = subs.map(function (s) { return s.en; }).join('\n');	
			msg = 'Copied all (' + subs.length + ' lines)';
		} else {
			const a = (step - 1) * n, b = Math.min(subs.length, a + n);
			text = subs.slice(a, b).map(function (s) { return s.en; }).join('\n');
			msg = 'Copied ' + (a + 1) + '-' + b + '/' + subs.length;
		}
		$scope.copyStep = (step + 1) % (chunks + 1);
		copyLock = true; // khoa auto-copy cua tick de giu nguyen clipboard vua copy
		copyTextToClipboard(text, function () {
			try {
				if (isNarrowCopyToast()) $scope.showCopyToast(msg);
				else {
					if (lastCopyToast) toastr.clear(lastCopyToast);
					lastCopyToast = toastr.info(msg, 'Copied');
				}
			} catch (e) {}
		});
	} catch (e) {}
};
$scope.loopIdx = -1; // index dong dang loop (-1 = tat)
$scope.loopCount = 0; // dem so vong da lap
// 1 note tai 1 thoi diem (accordion): mo Note B -> Note A tu dong.
// Bam lai nut Note cua dong dang mo -> dong. Doi bai -> dong het.
$scope.openNoteIdx = -1;
$scope.toggleNote = function (ev, idx) {
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	$scope.openNoteIdx = ($scope.openNoteIdx === idx) ? -1 : idx;
	if ($scope.openNoteIdx >= 0) {
		// mo xong cuon nhe panel toi dong note (chi cuon panel sub, khong cuon ca trang)
		// + tam dung follow-scroll 1.5s de panel kip toi note roi AutoFollow chay tiep
		noteScrollGraceUntil = Date.now() + 1500;
		$timeout(function () { try { scrollPanelTo($scope.openNoteIdx); } catch (e) {} }, 120);
	}
};
// Star: luu dong sub yeu thich. Gom 1 key duy nhat 'lstStar' = JSON {<lessonId>:[idx,...]}.
// Vao route / doi bai -> load lai de set icon on/off.
$scope.starMap = {}; // idx -> true (bai hien tai)
function readStarStore() {
	try {
		const raw = localStorage.getItem('lstStar');
		if (!raw) return {};
		const o = JSON.parse(raw);
		return (o && typeof o === 'object') ? o : {};
	} catch (e) { return {}; }
}
function writeStarStore(o) {
	try { localStorage.setItem('lstStar', JSON.stringify(o)); } catch (e) {}
}
function lessonStarId() {
	try { return String(($scope.lesson && $scope.lesson.id) || ''); } catch (e) { return ''; }
}
function loadStars() {
	$scope.starMap = {};
	try {
		// migrate 1 lan key cu kieu lstStar_<id>-<idx> -> gom vao JSON roi xoa key cu
		const olds = [];
		for (let i = 0; i < localStorage.length; i++) {
			const k = localStorage.key(i);
			if (k && k.indexOf('lstStar_') === 0) olds.push(k);
		}
		if (olds.length) {
			const store = readStarStore();
			olds.forEach(function (k) {
				try {
					const rest = k.slice('lstStar_'.length);
					const dash = rest.lastIndexOf('-');
					if (dash > 0) {
						const lid = rest.slice(0, dash);
						const idx = parseInt(rest.slice(dash + 1), 10);
						if (lid && !isNaN(idx)) {
							store[lid] = store[lid] || [];
							if (store[lid].indexOf(idx) < 0) store[lid].push(idx);
						}
					}
				} catch (e2) {}
				try { localStorage.removeItem(k); } catch (e3) {}
			});
			writeStarStore(store);
		}
		const id = lessonStarId();
		const arr = readStarStore()[id] || [];
		for (let j = 0; j < arr.length; j++) {
			const idx = parseInt(arr[j], 10);
			if (!isNaN(idx)) $scope.starMap[idx] = true;
		}
	} catch (e) {}
}
$scope.isStarred = function (idx) { try { return !!$scope.starMap[idx]; } catch (e) { return false; } };
$scope.toggleStar = function (ev, idx) {
	if (ev) { try { ev.stopPropagation(); } catch (e) {} }
	try {
		const id = lessonStarId();
		if (!id) return;
		const store = readStarStore();
		let arr = store[id] || [];
		if ($scope.starMap[idx]) {
			delete $scope.starMap[idx];
			arr = arr.filter(function (v) { return parseInt(v, 10) !== idx; });
		} else {
			$scope.starMap[idx] = true;
			if (arr.indexOf(idx) < 0) arr.push(idx);
		}
		if (arr.length) store[id] = arr;
		else delete store[id];
		writeStarStore(store);
	} catch (e) {}
};
$scope.videoErr = '';
$scope.videoUrl = null; // trusted 1 lan/khi doi bai (tranh reload loop)
$scope.isAudio = false; // true khi lesson la file tieng (mp3/wav...)

let videoEl = null;
let ytPlayer = null;
let pollTimer = null;
let seekGraceUntil = 0; // bo qua timeupdate cu ngay sau khi seek (tranh highlight nhay ve dau)
let noteScrollGraceUntil = 0; // sau khi mo note: tam dung follow-scroll 1.5s de panel kip cuon toi note
let seekTarget = null; // dang seek toi giay nay -> tick cu (vi tri cu) thi bo, chi nhan khi toi noi
let seekSince = 0;
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
	seekTarget = null;
	try { clearTimeout(loopTimer); loopTimer = null; } catch (e) {}
	try { Text2SpeechStop(); } catch (e2) {}
	teardown();
	$scope.lessonIdx = +i || 0;
	$scope.lesson = $scope.lessons[$scope.lessonIdx] || null;
	// giu subIdx cu de resume (doc TRUOC khi ghi de key; doi bai khac -> resumeIdx = -1)
	let resumeIdx = -1;
	try {
		const rawOld = localStorage.getItem('lstLesson') || '';
		const barOld = rawOld.lastIndexOf('|');
		if (barOld > 0 && $scope.lesson && rawOld.slice(0, barOld) === String($scope.lesson.id)) {
			const r = parseInt(rawOld.slice(barOld + 1), 10);
			if (!isNaN(r)) resumeIdx = r;
		}
	} catch (e) {}
	// luu bai dang mo NGAY LAP TUC: 'lstLesson' = '<id>|-1' (chua nghe sub nao; sub chay se ghi de subIdx)
	try {
		if ($scope.lesson) localStorage.setItem('lstLesson', $scope.lesson.id + '|-1');
	} catch (e) {}
	$scope.curIdx = -1;
	$scope.openNoteIdx = -1; // doi bai -> dong het note cu
	$scope.copyStep = 0; // doi bai -> copy lai tu full
	loadStars(); // doi bai -> load star tu local de set icon on/off
	$scope.lessonSearch = ($scope.lesson && $scope.lesson.title) || '';
	$scope.showScript = false;
	try {
		$scope.lessonNotes = ($scope.lesson && typeof LISTEN_NOTES !== 'undefined' && LISTEN_NOTES[$scope.lesson.id]) || '';
	} catch (e) { $scope.lessonNotes = ''; }
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
	// resume: ve lai sub dang nghe truoc do (highlight + cuon panel + dua video ve moc gio, khong autoplay)
	$timeout(function () {
		try {
			if (!$scope.lesson || !$scope.lesson.subs) return;
			// don key cu ('listenSrt', 'listenSrt|<id>', 'ListenLessonId') -> chi giu 'lstLesson'
			try {
				try { localStorage.removeItem('listenSrt'); } catch (e1) {}
				try { localStorage.removeItem('ListenLessonId'); } catch (e2) {}
				const olds = [];
				for (let i = 0; i < localStorage.length; i++) {
					const k = localStorage.key(i);
					if (k && k.indexOf('listenSrt|') === 0) olds.push(k);
				}
				olds.forEach(function (k) { try { localStorage.removeItem(k); } catch (e3) {} });
			} catch (e0) {}
			const saved = resumeIdx; // da doc giu tu dau openLesson (key gio la '<id>|-1')
			if (isNaN(saved) || saved < 0 || !$scope.lesson.subs[saved]) return;
			$scope.seekSub($scope.lesson.subs[saved], null, false);
			scrollPanelTo(saved);
			lastSavedSub = -2; // ep ghi lai key (vua bi openLesson ghi de |-1)
			saveSubPos(saved);
		} catch (e) {}
	}, 800);
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
					if (videoEl._watchSD) videoEl.removeEventListener('seeked', videoEl._watchSD);
					if (videoEl._watchPA) videoEl.removeEventListener('pause', videoEl._watchPA);
					if (videoEl._watchPL) videoEl.removeEventListener('play', videoEl._watchPL);
				} catch (e) {}
				videoEl._watchTU = function () {
					try { tick(videoEl.currentTime || 0); } catch (e) {}
				};
				videoEl._watchEN = function () {
					try {
						// het file -> ve sub 0 (dau bai), dung yen cho user bam play
						const subs = ($scope.lesson && $scope.lesson.subs) || [];
						if (subs.length) {
							$scope.seekSub(subs[0], null, false);
							if ($scope.follow) scrollPanelTo(0);
						}
						$scope.$applyAsync();
					} catch (e) {}
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
				// seek xong -> mo khoa tick ngay (khong doi timeupdate toi noi)
				videoEl._watchSD = function () {
					try { seekTarget = null; } catch (e) {}
				};
				videoEl.addEventListener('seeked', videoEl._watchSD);
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
					// seeking do CODE (da dem truoc) -> tru va bo qua
					try { if (expectSeeks > 0) { expectSeeks--; } } catch (e) {}
					// Tat loop CHI KHI vi tri hien tai NAM NGOAI dong loop.
					// (seeking gia tu load()/replay nam trong dong -> bo qua.
					//  keo tay that nhay ra ngoai -> tat loop ngay ca khi counter con du.)
					try {
						if ($scope.loopIdx >= 0) {
							const ls = $scope.lesson && $scope.lesson.subs;
							const lo = ls && ls[$scope.loopIdx];
							let ct = -1;
							try { ct = videoEl.currentTime; } catch (e2) { ct = -1; }
							if (lo && ct >= 0 && ct >= (lo.t || 0) - 0.6 && ct <= (lo.e || 0) + 1.5) return;
							$scope.loopIdx = -1;
							$scope.loopCount = 0;
							try { clearTimeout(loopTimer); loopTimer = null; } catch (e3) {}
							try { $scope.$applyAsync(); } catch (e4) {}
						}
					} catch (e) {}
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

// Sub chay/chuyen sang dong nao -> dua EN vao clipboard luon.
// copyLock: bam nut Copy chunk -> khoa auto-copy (tick) de khoi ghi de clipboard vua copy;
// click sub thu cong thi mo khoa + copy nhu thuong.
let copyLock = false;
function copySubEn(sub) {
	try {
		if (copyLock) return;
		if (!sub || !sub.en) return;
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(sub.en).catch(function () {});
		}
	} catch (e) {}
}
// Ep chay lai animation moi lan doi cau (keyframes chi tu chay khi element moi sinh)
function replayCurAnim(idx) {
	try {
		const nows = document.querySelectorAll('.watch-now');
		for (let k = 0; k < nows.length; k++) {
			nows[k].classList.remove('watch-anim');
			void nows[k].offsetWidth;
			nows[k].classList.add('watch-anim');
		}
		if (idx >= 0) {
			const el = document.getElementById('wsub' + idx);
			if (el) {
				el.classList.remove('row-anim');
				void el.offsetWidth;
				el.classList.add('row-anim');
			}
		}
	} catch (e) {}
}
// Cuon PANEL sub (chi trong div.watch-subs, khong cuon ca trang)
// Vua mo note -> tam nghi follow-scroll 1.5s (de thay duoc note), het grace AutoFollow chay lai
function followPausedForNote() { try { return Date.now() < noteScrollGraceUntil; } catch (e) { return false; } }
// Nho vi tri sub dang nghe: 1 key duy nhat 'lstLesson' = '<tenLesson>|<subIdx>' (chi bai gan nhat)
let lastSavedSub = -2;
function saveSubPos(idx) {
	try {
		if (idx === lastSavedSub) return;
		lastSavedSub = idx;
		const id = ($scope.lesson && $scope.lesson.id) || '';
		localStorage.setItem('lstLesson', id + '|' + idx);
	} catch (e) {}
}
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
	// seek cham (file nang): chua toi noi thi bo het tick cu, khong cho giat highlight/scroll ve
	if (seekTarget !== null) {
		if (Math.abs(t - seekTarget) < 1.0) { seekTarget = null; }
		else if (Date.now() - seekSince > 8000) { seekTarget = null; }
		else return;
	}
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
				}, 0);
			} catch (e) {}
		};
		if (t >= endT - 0.03) {
			// sat/dung cuoi cau. NHUNG: neu video dang pause (user pause)
			// thi DE YEN cho timer cu, khong duoc xoa + hen lai.
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
			copySubEn(subs[li]);
			replayCurAnim(li);
			saveSubPos(li);
		}
		// vua mo note (1.5s) -> tam dung follow-scroll de panel kip toi note, sau do AutoFollow chay tiep
		if ($scope.follow && !followPausedForNote()) scrollPanelTo(li);
		return;
	}
	// het sub cuoi (con duoi file van chay) -> quay ve sub 0 (dau bai). Pause thi thoi.
	const lastSub = subs[subs.length - 1];
	if (lastSub && lastSub.e && t >= lastSub.e + 0.5) {
		let playingNow = true;
		try {
			if (ytPlayer && ytPlayer.getPlayerState) playingNow = (ytPlayer.getPlayerState() === 1);
			else { const me0 = mediaEl(); playingNow = !!(me0 && !me0.paused && !me0.ended); }
		} catch (e) {}
		if (playingNow && subs.length) {
			$scope.seekSub(subs[0], null, false); // seek giu nguyen play -> bai lap lien mach
			return;
		}
	}
	if (idx === $scope.curIdx) return;
	$scope.curIdx = idx;
	try { $scope.$applyAsync(); } catch (e) {}
	copySubEn(subs[idx]);
	replayCurAnim(idx);
	saveSubPos(idx);
	// vua mo note (1.5s) -> tam dung follow-scroll de panel kip toi note, sau do AutoFollow chay tiep
	if (idx >= 0 && $scope.follow && !followPausedForNote()) scrollPanelTo(idx);
}

// Cham 1 dong phu de -> video nhay ve time do (+ phat tiep)
// Bam sang dong KHAC thi tat loop cu (tranh bi giat ve)
$scope.seekSub = function (sub, ev, autoplay) {
	if (ev) { try { ev.stopPropagation(); } catch (e) {} copyLock = false; } // click sub tay -> mo khoa, copy nhu thuong
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
	// khoa tick cho toi khi seek toi noi (seek cham thi timeupdate cu khong giat ve)
	seekTarget = t;
	seekSince = Date.now();
	// optimistic update ngay: highlight dung dong, ke timeupdate cu (khong scroll)
	try {
		const subs = $scope.lesson && $scope.lesson.subs;
		if (subs) {
			const ti = subs.indexOf(sub);
			if (ti >= 0) {
				$scope.curIdx = ti;
				seekGraceUntil = Date.now() + 600;
				saveSubPos(ti);
				try { $scope.$applyAsync(); } catch (e) {}
				copySubEn(sub);
				replayCurAnim(ti);
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
				// play() lan dau hay rot (mat gesture sau async) -> thu lai vai lan
				let tries = 0;
				const tryPlay = function () {
					try {
						const p = videoEl.play();
						if (p && typeof p.catch === 'function') p.catch(function () {
							if (++tries < 3) setTimeout(tryPlay, 350);
						});
					} catch (e) {
						if (++tries < 3) setTimeout(function () { tryPlay(); }, 350);
					}
				};
				tryPlay();
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
// Dem seek CHU DONG: goi markProgMedia() truoc moi currentTime/load.
// seeking toi (ke ca tre/muon) thi tru 1 va bo qua.
let expectSeeks = 0;
function markProgMedia() {
	try { expectSeeks++; } catch (e) {}
}

$scope.fmtTime = function (s) {
	s = Math.max(0, Math.floor(s || 0));
	const m = Math.floor(s / 60);
	return m + ':' + String(s % 60).padStart(2, '0');
};

// Thanh watch-row: cuon xuong qua 80px -> dock day man hinh (opa .7 qua CSS),
// ve dau trang -> ve cho cu (opa 1)
function updateRowDock() {
	try {
		const row = document.querySelector('.watch-row-sticky');
		if (!row) return;
		const y = window.pageYOffset || document.documentElement.scrollTop || 0;
		if (y > 80) row.classList.add('is-docked');
		else row.classList.remove('is-docked');
	} catch (e) {}
}
try { window.addEventListener('scroll', updateRowDock, { passive: true }); } catch (e) {}

$scope.$on('$destroy', function () {
	teardown();
	try { window.removeEventListener('scroll', updateRowDock); } catch (e) {}
	try { clearTimeout(loopTimer); loopTimer = null; } catch (e) {}
	try { Text2SpeechStop(); } catch (e) {}
});

// template render xong (lan dau vao route) -> setup lai cho chac
$scope.$on('$viewContentLoaded', function () {
	try {
		if ($scope.lesson) $timeout(function () { setupPlayer(); }, 50);
	} catch (e) {}
	topFunction();
	try { updateRowDock(); } catch (e) {}
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
