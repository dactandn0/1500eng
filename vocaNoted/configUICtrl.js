

// https://codepen.io/lonekorean/pen/PozMjgO
var app = angular.module("configUIApp", 
[
]);
app.controller("configUICtrl", function($scope, $rootScope) {

$scope.audioPitch = 1.5
$scope.audioRate = 0.8

$scope.toastTimeOut = HELPER_TOASTER_TIMEOUT_DEF
$scope.toastTimeOutMed = HELPER_TOASTER_TIMEOUT_MED_DEF
$scope.toastTimeOutLong = HELPER_TOASTER_TIMEOUT_LONG_DEF

$scope.selectedVoiceIdx = -1
$scope.VOICES = Helper_Voices

$scope.TTS_SOURCES = (typeof TTS_SOURCES !== 'undefined') ? TTS_SOURCES : [{ id: 'edge', desc: 'Edge' }, { id: 'google', desc: 'Google' }, { id: 'browser', desc: 'Browser' }];
$scope.ttsSource = 'edge';
$scope.EDGE_VOICES = (typeof EDGE_VOICES !== 'undefined') ? EDGE_VOICES : [{ id: 'en-US-AriaNeural', desc: 'Aria' }];
$scope.edgeVoice = 'en-US-AriaNeural';
$scope.edgeProxy = '?'; // on | off (chi co khi chay python edge_proxy.py)
$scope.edgeProxyUrl = '';
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

$scope.speechTest = function () {
	// force=true: nut Test cung 1 cau bam lai la replay, khong toggle-stop
	// -> doi voice/source xong bam Test luon nghe giong moi.
	try { Text2Speech('Hello, how are you today? I love learning English.', true); } catch (e) {}
	$scope.lastEngine = '...';
	try {
		setTimeout(function () {
			try { $scope.lastEngine = window.__lastTtsEngine || '?'; } catch (e) { $scope.lastEngine = '?'; }
			try { $scope.$applyAsync(); } catch (e2) {}
		}, 1800);
	} catch (e) {}
}

$scope.setEdgeProxyUrl = function () {
	try {
		let u = ($scope.edgeProxyUrl || '').trim().replace(/\/+$/, '');
		// nhap IP/port don gian -> tu them http://
		if (u && u.indexOf('://') < 0) u = 'http://' + u;
		$scope.edgeProxyUrl = u;
		Helper_saveDB(Helper_EdgeProxyKey, u);
	} catch (e) {}
	try { if (typeof Text2SpeechResetEdgeCooldown === 'function') Text2SpeechResetEdgeCooldown(); } catch (e2) {}
	try { if (typeof Text2SpeechStop === 'function') Text2SpeechStop(); } catch (e3) {}
	$scope.checkEdgeProxy();
}

$scope.checkEdgeProxy = function () {
	$scope.edgeProxy = '?';
	let url = 'api/edge-status';
	try { if (typeof edgeProxyStatusUrl === 'function') url = edgeProxyStatusUrl(); } catch (e) {}
	try {
		if (typeof fetch !== 'undefined')
			fetch(url, { cache: 'no-store' }).then(function (r) {
				$scope.edgeProxy = (r && r.ok) ? 'on' : 'off';
				try { $scope.$applyAsync(); } catch (e) {}
			}, function () {
				$scope.edgeProxy = 'off';
				try { $scope.$applyAsync(); } catch (e) {}
			});
		else $scope.edgeProxy = '?';
	} catch (e) { $scope.edgeProxy = '?'; }
};

$scope.setBrowserVoice = function () {
	try { Helper_saveDB(Helper_BrowserVoiceKey, $scope.browserVoiceURI || ''); } catch (e) {}
	try { if (typeof Text2SpeechStop === 'function') Text2SpeechStop(); } catch (e2) {}
};

$scope.refreshBrowserVoices = function () {
	try {
		if (typeof speechSynthesis === 'undefined') return;
		const vs = speechSynthesis.getVoices() || [];
		$scope.BROWSER_VOICES = vs;
		// giu lua chon cu neu van con
		let keep = false;
		for (let i = 0; i < vs.length; i++) {
			if (vs[i] && vs[i].voiceURI === $scope.browserVoiceURI) { keep = true; break; }
		}
		if (!keep) {
			// mac dinh: voice EN dau tien
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

$scope.setToastTimeOutMed = function () {
	Helper_saveDB(Helper_ToastTimeOutMedKey, $scope.toastTimeOutMed);
}

$scope.saveSelectedVoiceIdx = function () {
	Helper_saveDB(Helper_SelectedVoiceIdx, $scope.selectedVoiceIdx);
}

$scope.loadDB = function () {
	$scope.VOICES = Helper_Voices
	$scope.audioPitch = Helper_loadFloat(Helper_AudioPitchKey, 1.5)
	$scope.audioRate = Helper_loadFloat(Helper_AudioRateKey, 0.8)
	$scope.ttsSource = Helper_loadStr(Helper_TTSSourceKey, 'edge')
	$scope.edgeVoice = 'en-US-AriaNeural'
	try {
		if (typeof Helper_EdgeVoiceKey !== 'undefined')
			$scope.edgeVoice = Helper_loadStr(Helper_EdgeVoiceKey, 'en-US-AriaNeural')
	} catch (e) {}

	// LoadDb in audioCtrl.js
	// $rootScope.audio_repeatNum = Helper_loadFloat(Helper_RepeatNumKey, 1)
	$rootScope.audio_repeatNum = Helper_loadFloat(Helper_RepeatNumKey, HELPER_REPEAT_NUM_DEF)
	$rootScope.adjAudioTime = Helper_loadInt(Helper_AdjAudioTimeKey, HELPER_ADJ_AUDIO_TIME_DEF)
	$scope.toastTimeOut = Helper_loadFloat(Helper_ToastTimeOutKey, HELPER_TOASTER_TIMEOUT_DEF)
	$scope.toastTimeOutMed = Helper_loadFloat(Helper_ToastTimeOutMedKey, HELPER_TOASTER_TIMEOUT_MED_DEF)
	$scope.toastTimeOutLong = Helper_loadFloat(Helper_ToastTimeOutLongKey, HELPER_TOASTER_TIMEOUT_LONG_DEF)

	$scope.selectedVoiceIdx  = Helper_loadInt(Helper_SelectedVoiceIdx, -1)

	try {
		if (typeof Helper_EdgeProxyKey !== 'undefined')
			$scope.edgeProxyUrl = Helper_loadStr(Helper_EdgeProxyKey, '');
	} catch (e) {}
	try {
		if (typeof Helper_BrowserVoiceKey !== 'undefined')
			$scope.browserVoiceURI = Helper_loadStr(Helper_BrowserVoiceKey, '');
	} catch (e) {}
	$scope.refreshBrowserVoices();
	$scope.checkEdgeProxy();
};


$scope.$on('$viewContentLoaded', function(){
	$scope.loadDB();
	topFunction();
});


});

