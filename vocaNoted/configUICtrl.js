

// https://codepen.io/lonekorean/pen/PozMjgO
var app = angular.module("configUIApp",
[
]);
app.controller("configUICtrl", function($scope, $rootScope, $location) {

$scope.audioPitch = 1.5
$scope.audioRate = 0.8

$scope.toastTimeOut = HELPER_TOASTER_TIMEOUT_DEF
$scope.toastTimeOutMed = HELPER_TOASTER_TIMEOUT_MED_DEF
$scope.toastTimeOutLong = HELPER_TOASTER_TIMEOUT_LONG_DEF
$scope.toastTimeOutMax = HELPER_TOASTER_TIMEOUT_MAX_DEF
$scope.TOAST_MAX_OPTIONS = (typeof TOAST_MAX_OPTIONS !== 'undefined') ? TOAST_MAX_OPTIONS : [30, 45, 60, 90, 120];

$scope.TTS_SOURCES = (typeof TTS_SOURCES !== 'undefined') ? TTS_SOURCES : [{ id: 'edge', desc: 'Edge' }, { id: 'browser', desc: 'Browser' }];
$scope.ttsSource = 'browser';
$scope.EDGE_VOICES = (typeof EDGE_VOICES !== 'undefined') ? EDGE_VOICES : [{ id: 'en-US-AriaNeural', desc: 'Aria' }];
$scope.edgeVoice = 'en-US-AriaNeural';
$scope.EL_VOICES = (typeof EL_VOICES !== 'undefined') ? EL_VOICES : [{ id: '21m00Tcm4TlvDq8ikWAM', desc: 'Rachel' }];
$scope.elVoice = '21m00Tcm4TlvDq8ikWAM';
$scope.elKey = '';
$scope.elKeyVisible = false;
$scope.toggleELKeyVisible = function () { $scope.elKeyVisible = !$scope.elKeyVisible; };
$scope.elVoicesLoading = false;
$scope.loadELVoices = function () {
	// Tai danh sach giong that tu API (ID cung co the bi doi/xoa) thay vi list cung
	const k = ($scope.elKey || '').trim();
	if (!k || typeof fetch === 'undefined') return;
	$scope.elVoicesLoading = true;
	fetch('https://api.elevenlabs.io/v1/voices', { headers: { 'xi-api-key': k } }).then(function (r) {
		if (!r.ok) throw new Error('HTTP ' + r.status);
		return r.json();
	}).then(function (d) {
		const vs = (d && d.voices) || [];
		if (vs.length) {
			$scope.EL_VOICES = vs.map(function (v) {
				let desc = v.name || v.voice_id;
				const labels = v.labels || {};
				const bits = [];
				if (labels.gender) bits.push(labels.gender);
				if (labels.accent) bits.push(labels.accent);
				else if (labels.language) bits.push(labels.language);
				if (bits.length) desc += ' - ' + bits.join(' ');
				return { id: v.voice_id, desc: desc };
			});
			let keep = false;
			for (let i = 0; i < $scope.EL_VOICES.length; i++) {
				if ($scope.EL_VOICES[i].id === $scope.elVoice) { keep = true; break; }
			}
			if (!keep) {
				$scope.elVoice = $scope.EL_VOICES[0].id;
				try { Helper_saveDB(Helper_ELVoiceKey, $scope.elVoice); } catch (e) {}
			}
		}
		$scope.elVoicesLoading = false;
		try { $scope.$applyAsync(); } catch (e2) {}
	}, function () {
		$scope.elVoicesLoading = false;
		try { $scope.$applyAsync(); } catch (e2) {}
	});
};
$scope.keyLinkCopied = false;
$scope.copyKeyLink = function () {
	// Copy link co san key de mo tren iPhone (khoi go tay)
	$scope.keyLinkCopied = false;
	try {
		if (!$scope.elKey) return;
		//const url = location.origin + location.pathname + '#!/configUI?key=' + encodeURIComponent($scope.elKey);
		const url = $scope.elKey;
		const done = function () {
			$scope.keyLinkCopied = true;
			try { $scope.$applyAsync(); } catch (e) {}
			setTimeout(function () { $scope.keyLinkCopied = false; try { $scope.$applyAsync(); } catch (e) {} }, 2000);
		};
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(url).then(done, done);
		} else {
			const ta = document.createElement('textarea');
			ta.value = url;
			document.body.appendChild(ta);
			ta.select();
			try { document.execCommand('copy'); } catch (e) {}
			document.body.removeChild(ta);
			done();
		}
	} catch (e) {}
};
$scope.keyLinkCopied = false;
$scope.elCheck = '';
$scope.checkELKey = function () {
	// console.log('checkELKey: ' + $scope.elKey);
	// Kiem tra key bang API user (khong ton quota): hien tier + so ky tu con lai
	$scope.elCheck = '...';
	try { $scope.$applyAsync(); } catch (e) {}
	try {
		const k = ($scope.elKey || '').trim();
		if (!k) { $scope.elCheck = 'Chưa nhập key.'; return; }
		fetch('https://api.elevenlabs.io/v1/user', { headers: { 'xi-api-key': k } }).then(function (r) {
			if (!r.ok) throw new Error('HTTP ' + r.status);
			return r.json();
		}).then(function (d) {
			let msg = 'Key OK.';
			try {
				const s = (d && d.subscription) || {};
				msg = 'Key OK (' + (s.tier || '?') + '): đã dùng ' + (s.character_count ?? '?') + '/' + (s.character_limit ?? '?') + ' ký tự.';
			} catch (e) {}
			$scope.elCheck = msg;
			try { $scope.$applyAsync(); } catch (e2) {}
			// Kiem them quyen voices de phan biet 401 thieu quyen TTS
			try {
				fetch('https://api.elevenlabs.io/v1/voices', { headers: { 'xi-api-key': k } }).then(function (r2) {
					$scope.elCheck = msg + (r2.ok ? ' Voices OK.' : ' Voices HTTP ' + r2.status + ' (key thieu quyen).');
					try { $scope.$applyAsync(); } catch (e3) {}
				}, function () {});
			} catch (e3) {}
		}, function (err) {
			$scope.elCheck = 'Key lỗi: ' + String((err && err.message) || err) + ' (401 = key sai/cũ, 402 = hết quota).';
			try { $scope.$applyAsync(); } catch (e2) {}
		});
	} catch (e) { $scope.elCheck = 'Không gọi được API.'; }
};
$scope.lastEngine = '';
$scope.BROWSER_VOICES = [];
$scope.browserVoiceURI = '';

$scope.setTtsSource = function () {
	Helper_saveDB(Helper_TTSSourceKey, $scope.ttsSource);
	try { if (typeof Text2SpeechResetEdgeCooldown === 'function') Text2SpeechResetEdgeCooldown(); } catch (e) {}
	try { if (typeof Text2SpeechStop === 'function') Text2SpeechStop(); } catch (e) {}
}

$scope.setEdgeVoice = function () {
	Helper_saveDB(Helper_EdgeVoiceKey, $scope.edgeVoice);
	try { if (typeof Text2SpeechResetEdgeCooldown === 'function') Text2SpeechResetEdgeCooldown(); } catch (e) {}
	try { if (typeof Text2SpeechStop === 'function') Text2SpeechStop(); } catch (e) {}
}

$scope.setELKey = function () {
	Helper_saveDB(Helper_ELKey, ($scope.elKey || '').trim());
	try { if (typeof Text2SpeechResetEdgeCooldown === 'function') Text2SpeechResetEdgeCooldown(); } catch (e) {}
	try { if (typeof Text2SpeechStop === 'function') Text2SpeechStop(); } catch (e) {}
}

$scope.setELVoice = function () {
	Helper_saveDB(Helper_ELVoiceKey, $scope.elVoice);
	try { if (typeof Text2SpeechResetEdgeCooldown === 'function') Text2SpeechResetEdgeCooldown(); } catch (e) {}
	try { if (typeof Text2SpeechStop === 'function') Text2SpeechStop(); } catch (e) {}
}

$scope.speechTest = function () {
	// force=true: nut Test cung 1 cau bam lai la replay, khong toggle-stop.
	try { Text2Speech('I love English.', true); } catch (e) {}
	$scope.lastEngine = '...';
	try {
		setTimeout(function () {
			try { $scope.lastEngine = window.__lastTtsEngine || '?'; } catch (e) { $scope.lastEngine = '?'; }
			try { $scope.$applyAsync(); } catch (e2) {}
		}, 1800);
	} catch (e) {}
}

$scope.setBrowserVoice = function () {
	try { Helper_saveDB(Helper_BrowserVoiceKey, $scope.browserVoiceURI || ''); } catch (e) {}
	try { if (typeof Text2SpeechStop === 'function') Text2SpeechStop(); } catch (e2) {}
};

$scope.refreshBrowserVoices = function () {
	try {
		if (typeof speechSynthesis === 'undefined') return;
		const vs = speechSynthesis.getVoices() || [];
		$scope.BROWSER_VOICES = vs;
		let keep = false;
		for (let i = 0; i < vs.length; i++) {
			if (vs[i] && vs[i].voiceURI === $scope.browserVoiceURI) { keep = true; break; }
		}
		if (!keep) {
			for (let i = 0; i < vs.length; i++) {
				const lang = ((vs[i] && vs[i].lang) || '').toLowerCase();
				if (lang.indexOf('en') === 0) { $scope.browserVoiceURI = vs[i].voiceURI; break; }
			}
		}
		try { $scope.$applyAsync(); } catch (e) {}
	} catch (e) {}
};
try {
	// Safari load voices cham (can voiceschanged) -> hook 1 lan, goi scope moi nhat
	window.__ttsVoiceScopes = window.__ttsVoiceScopes || [];
	if (typeof speechSynthesis !== 'undefined') {
		try { speechSynthesis.getVoices(); } catch (e) {}
		if (!window.__ttsVoicesHooked) {
			window.__ttsVoicesHooked = true;
			try {
				speechSynthesis.onvoiceschanged = function () {
					try {
						(window.__ttsVoiceScopes || []).forEach(function (fn) { try { fn(); } catch (e2) {} });
					} catch (e) {}
				};
			} catch (e) {}
		}
		window.__ttsVoiceScopes.push($scope.refreshBrowserVoices);
	}
} catch (e) {}


$scope.setAudioPitch = function () {
	Helper_saveDB(Helper_AudioPitchKey, $scope.audioPitch);
}

$scope.setAudioRate = function () {
	Helper_saveDB(Helper_AudioRateKey, $scope.audioRate);
}

$scope.setRepeatNum = function () {
	Helper_saveDB(Helper_RepeatNumKey, $rootScope.audio_repeatNum);
}

$scope.setAdjAudioTime = function () {
	Helper_saveDB(Helper_AdjAudioTimeKey, $rootScope.adjAudioTime);
}

$scope.setToastTimeOut = function () {
	Helper_saveDB(Helper_ToastTimeOutKey, $scope.toastTimeOut);
}

$scope.setToastTimeOutLong = function () {
	Helper_saveDB(Helper_ToastTimeOutLongKey, $scope.toastTimeOutLong);
}

$scope.setToastTimeOutMax = function () {
	let v = parseInt($scope.toastTimeOutMax) || HELPER_TOASTER_TIMEOUT_MAX_DEF;
	if (v < 30) v = 30; // min 30s
	$scope.toastTimeOutMax = v;
	Helper_saveDB(Helper_ToastTimeOutMaxKey, v);
}

$scope.setToastTimeOutMed = function () {
	Helper_saveDB(Helper_ToastTimeOutMedKey, $scope.toastTimeOutMed);
}

$scope.loadDB = function () {
	$scope.audioPitch = Helper_loadFloat(Helper_AudioPitchKey, 1.5)
	$scope.audioRate = Helper_loadFloat(Helper_AudioRateKey, 0.8)
	$scope.ttsSource = Helper_loadStr(Helper_TTSSourceKey, 'browser')
	if ($scope.ttsSource !== 'edge' && $scope.ttsSource !== 'el' && $scope.ttsSource !== 'browser')
		$scope.ttsSource = 'browser'; // migrate gia tri cu
	$scope.edgeVoice = 'en-US-AriaNeural'
	try {
		if (typeof Helper_EdgeVoiceKey !== 'undefined')
			$scope.edgeVoice = Helper_loadStr(Helper_EdgeVoiceKey, 'en-US-AriaNeural')
	} catch (e) {}
	$scope.elVoice = '21m00Tcm4TlvDq8ikWAM'
	try {
		if (typeof Helper_ELVoiceKey !== 'undefined')
			$scope.elVoice = Helper_loadStr(Helper_ELVoiceKey, '21m00Tcm4TlvDq8ikWAM')
	} catch (e) {}
	$scope.elKey = ''
	try {
		if (typeof Helper_ELKey !== 'undefined')
			$scope.elKey = Helper_loadStr(Helper_ELKey, '')
	} catch (e) {}
	if ($scope.elKey) { try { $scope.loadELVoices(); } catch (e) {} }

	$rootScope.audio_repeatNum = Helper_loadFloat(Helper_RepeatNumKey, HELPER_REPEAT_NUM_DEF)
	$rootScope.adjAudioTime = Helper_loadInt(Helper_AdjAudioTimeKey, HELPER_ADJ_AUDIO_TIME_DEF)
	$scope.toastTimeOut = Helper_loadFloat(Helper_ToastTimeOutKey, HELPER_TOASTER_TIMEOUT_DEF)
	$scope.toastTimeOutMed = Helper_loadFloat(Helper_ToastTimeOutMedKey, HELPER_TOASTER_TIMEOUT_MED_DEF)
	$scope.toastTimeOutLong = Helper_loadFloat(Helper_ToastTimeOutLongKey, HELPER_TOASTER_TIMEOUT_LONG_DEF)
	let maxV = HELPER_TOASTER_TIMEOUT_MAX_DEF
	try {
		if (typeof Helper_ToastTimeOutMaxKey !== 'undefined')
			maxV = Helper_loadInt(Helper_ToastTimeOutMaxKey, HELPER_TOASTER_TIMEOUT_MAX_DEF)
	} catch (e) {}
	if (!(maxV >= 30)) maxV = 30; // min 30s
	$scope.toastTimeOutMax = maxV

	try {
		if (typeof Helper_BrowserVoiceKey !== 'undefined')
			$scope.browserVoiceURI = Helper_loadStr(Helper_BrowserVoiceKey, '');
	} catch (e) {}
	$scope.refreshBrowserVoices();
};


$scope.$on('$viewContentLoaded', function(){
	$scope.loadDB();
	// Nhan key qua URL: mo https://.../#!/configUI?key=API_KEY tren iPhone la tu luu.
	// Tien: copy tren PC -> gui link qua Zalo/Mail -> mo tren Safari (khoi go tay).
	try {
		const k = $location.search().key;
		if (k && String(k).trim()) {
			$scope.elKey = String(k).trim();
			Helper_saveDB(Helper_ELKey, $scope.elKey);
			$location.search('key', null); // xoa key khoi URL ngay
		}
	} catch (e) {}
	topFunction();
});


});
