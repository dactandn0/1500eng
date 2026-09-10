

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
$scope.toastTimeOutMax = HELPER_TOASTER_TIMEOUT_MAX_DEF
$scope.TOAST_MAX_OPTIONS = (typeof TOAST_MAX_OPTIONS !== 'undefined') ? TOAST_MAX_OPTIONS : [30, 45, 60, 90, 120];

$scope.TTS_SOURCES = (typeof TTS_SOURCES !== 'undefined') ? TTS_SOURCES : [{ id: 'puter', desc: 'Puter' }, { id: 'browser', desc: 'Browser' }];
$scope.ttsSource = 'puter';
$scope.PUTER_VOICES = (typeof PUTER_VOICES !== 'undefined') ? PUTER_VOICES : [{ id: 'Joanna', desc: 'Joanna' }];
$scope.puterVoice = 'Joanna';
$scope.puterSignedIn = false;
$scope.puterUser = '';
$scope.lastEngine = '';
$scope.BROWSER_VOICES = [];
$scope.browserVoiceURI = '';

$scope.setTtsSource = function () {
	Helper_saveDB(Helper_TTSSourceKey, $scope.ttsSource);
	try { if (typeof Text2SpeechStop === 'function') Text2SpeechStop(); } catch (e) {}
}

$scope.setPuterVoice = function () {
	Helper_saveDB(Helper_PuterVoiceKey, $scope.puterVoice);
	try { if (typeof Text2SpeechStop === 'function') Text2SpeechStop(); } catch (e) {}
}

$scope.puterSignIn = function () {
	try {
		if (typeof puter === 'undefined' || !puter.auth) return;
		puter.auth.signIn().then(function () { $scope.refreshPuterStatus(); },
			function () { $scope.refreshPuterStatus(); });
	} catch (e) {}
}

$scope.puterSignOut = function () {
	try {
		if (typeof puter === 'undefined' || !puter.auth) return;
		puter.auth.signOut();
	} catch (e) {}
	$scope.refreshPuterStatus();
}

$scope.refreshPuterStatus = function () {
	$scope.puterSignedIn = false;
	$scope.puterUser = '';
	try {
		if (typeof puter !== 'undefined' && puter.auth && puter.auth.isSignedIn()) {
			$scope.puterSignedIn = true;
			try {
				const u = puter.auth.getUser();
				if (u && u.username) $scope.puterUser = u.username;
			} catch (e) {}
		}
	} catch (e) {}
	try { $scope.$applyAsync(); } catch (e2) {}
}

$scope.speechTest = function () {
	// force=true: nut Test cung 1 cau bam lai la replay, khong toggle-stop.
	// Lan dau dung Puter se mo popup login (can bam trong gesture nay).
	try { Text2Speech('Hello, how are you today? I love learning English.', true); } catch (e) {}
	$scope.lastEngine = '...';
	$scope.refreshPuterStatus();
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
	$scope.ttsSource = Helper_loadStr(Helper_TTSSourceKey, 'puter')
	if ($scope.ttsSource !== 'puter' && $scope.ttsSource !== 'browser')
		$scope.ttsSource = 'puter'; // migrate edge/google cu
	$scope.puterVoice = 'Joanna'
	try {
		if (typeof Helper_PuterVoiceKey !== 'undefined')
			$scope.puterVoice = Helper_loadStr(Helper_PuterVoiceKey, 'Joanna')
	} catch (e) {}

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
	$scope.refreshPuterStatus();
};


$scope.$on('$viewContentLoaded', function(){
	$scope.loadDB();
	topFunction();
});


});
