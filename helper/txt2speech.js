// TTS simple: Puter (neural, can login) -> Browser speechSynthesis (offline).
// Gi nguyen ten ham Text2Speech(word) nen khong can sua cho goi.
const utter = new SpeechSynthesisUtterance();

let gLastText = '';
let gSeq = 0; // tang moi lan goi -> request cu (chua xong) bi huy

// Co BUSY: dang phat (hoac dang cho mang) -> Text2SpeechIsBusy() === true.
let ttsBusy = false;
function ttsSetBusy(v) { ttsBusy = !!v; }
function Text2SpeechIsBusy() {
	if (ttsBusy) return true;
	try {
		if (typeof speechSynthesis !== 'undefined' && speechSynthesis.speaking) return true;
	} catch (e) {}
	return false;
}

// Puter path state
let puterAudio = null;
let puterQueue = [];

// iOS Safari: audio chi duoc phat trong user-gesture -> mo khoa san.
let ttsCtx = null;
function ttsEnsureCtx() {
	try {
		if (!ttsCtx) {
			const AC = window.AudioContext || window.webkitAudioContext;
			if (AC) ttsCtx = new AC();
		}
		if (ttsCtx && ttsCtx.state === 'suspended') {
			const p = ttsCtx.resume();
			if (p && typeof p.catch === 'function') p.catch(function () {});
		}
	} catch (e) {}
	return ttsCtx;
}
try {
	['pointerdown', 'touchend', 'click', 'keydown'].forEach(function (ev) {
		document.addEventListener(ev, ttsEnsureCtx, { passive: true });
	});
} catch (e) {}

function Text2SpeechStop() {
	gSeq++;
	puterQueue = [];
	gLastText = '';
	ttsSetBusy(false);
	if (puterAudio) {
		try { puterAudio.pause(); } catch (e) {}
		try { puterAudio.currentTime = 0; } catch (e) {}
		try { puterAudio.onended = null; puterAudio.onerror = null; } catch (e) {}
		puterAudio = null;
	}
	try {
		if (typeof speechSynthesis !== 'undefined' && speechSynthesis.speaking) {
			speechSynthesis.cancel();
		}
	} catch (e) {}
}

function Text2SpeechClean(input) {
	let s = (input == null ? '' : String(input));
	try {
		if (typeof Helper_RemoveHTMLtag === 'function') s = Helper_RemoveHTMLtag(s);
		else s = s.replace(/(<([^>]+)>)/ig, '');
	} catch (e) {
		s = s.replace(/(<([^>]+)>)/ig, '');
	}
	s = s.replace(/&/g, ' and ').replace(/\s+/g, ' ').trim();
	return s;
}

function Text2SpeechSource() {
	try {
		if (typeof Helper_loadStr === 'function' && typeof Helper_TTSSourceKey !== 'undefined') {
			const v = Helper_loadStr(Helper_TTSSourceKey, 'puter');
			if (v === 'puter' || v === 'browser') return v;
			// migrate gia tri cu (edge/google) -> puter
			try { Helper_saveDB(Helper_TTSSourceKey, 'puter'); } catch (e2) {}
			return 'puter';
		}
	} catch (e) {}
	return 'puter';
}

function Text2SpeechRate() {
	let rate = 1;
	try { rate = Helper_loadFloat(Helper_AudioRateKey, 1) || 1; } catch (e) {}
	if (!(rate >= 0.5 && rate <= 2)) rate = 1;
	return rate;
}

function puterVoice() {
	try {
		if (typeof Helper_loadStr === 'function' && typeof Helper_PuterVoiceKey !== 'undefined') {
			const v = Helper_loadStr(Helper_PuterVoiceKey, 'Joanna');
			if (v) return v;
		}
	} catch (e) {}
	return 'Joanna';
}

// no-op giu tuong thich (truoc day dung cho Edge cooldown)
function Text2SpeechResetEdgeCooldown() {}

// =====================================================
// Puter path (chinh)
// Dang nhap 1 lan: puter.auth.signIn() (popup) -> token luu san.
// =====================================================
function puterEnsureAuth() {
	return new Promise(function (resolve) {
		try {
			if (typeof puter === 'undefined' || !puter.auth) { resolve(false); return; }
			try {
				if (puter.auth.isSignedIn()) { resolve(true); return; }
			} catch (e) {}
			// Chua login -> mo popup (can chay trong user-gesture; neu bi chan -> false)
			try {
				puter.auth.signIn().then(function () {
					try { resolve(!!puter.auth.isSignedIn()); }
					catch (e) { resolve(true); }
				}, function () { resolve(false); });
			} catch (e) { resolve(false); }
		} catch (e) { resolve(false); }
	});
}

// Cat text dai thanh chunk (~1200 ky tu, ngat o cau/tu). Puter gioi han ~3000 ky tu.
function puterChunk(text) {
	const MAX = 1200;
	const out = [];
	const sentences = String(text).split(/(?<=[.!?])\s+|\n+/);
	let cur = '';
	function pushCur() { if (cur.trim()) out.push(cur.trim()); cur = ''; }
	sentences.forEach(function (sen) {
		sen = (sen || '').trim();
		if (!sen) return;
		while (sen.length > MAX) {
			let cut = sen.lastIndexOf(' ', MAX);
			if (cut < 40) cut = MAX;
			const piece = (cur + ' ' + sen.slice(0, cut)).trim();
			if (piece.length <= MAX + 200) { cur = piece; }
			else { pushCur(); cur = sen.slice(0, cut); }
			sen = sen.slice(cut).trim();
		}
		if ((cur + ' ' + sen).trim().length <= MAX) cur = (cur + ' ' + sen).trim();
		else { pushCur(); cur = sen; }
	});
	pushCur();
	return out.length ? out : [text];
}

function puterPlayQueue(mySeq) {
	if (mySeq !== gSeq) return;
	const chunk = puterQueue.shift();
	if (chunk == null) {
		puterAudio = null;
		ttsSetBusy(false);
		return;
	}
	ttsSetBusy(true);
	let audio = null;
	try {
		const pr = puter.ai.txt2speech(chunk, {
			voice: puterVoice(),
			engine: 'neural',
			language: 'en-US'
		});
		Promise.resolve(pr).then(function (a) {
			if (mySeq !== gSeq) return;
			audio = a;
			puterAudio = audio;
			try { window.__lastTtsEngine = 'puter'; } catch (e) {}
			try { audio.playbackRate = Text2SpeechRate(); } catch (e) {}
			let settled = false;
			audio.onended = function () {
				if (settled) return;
				settled = true;
				puterPlayQueue(mySeq);
			};
			audio.onerror = function () {
				if (settled) return;
				settled = true;
				browserFallbackQueue(mySeq);
			};
			try {
				const p = audio.play();
				if (p && typeof p.catch === 'function') {
					p.catch(function () {
						// iOS chan play() sau async -> rot xuong browser cho chunk nay
						if (settled || mySeq !== gSeq) return;
						settled = true;
						browserFallbackQueue(mySeq);
					});
				}
			} catch (e) {
				if (!settled) {
					settled = true;
					browserFallbackQueue(mySeq);
				}
			}
		}, function () {
			// puter loi (chua login/bi chan) -> ca text rot xuong browser
			if (mySeq !== gSeq) return;
			browserFallbackText(mySeq);
		});
	} catch (e) {
		if (mySeq !== gSeq) return;
		browserFallbackText(mySeq);
	}
}

// Phat 1 chunk bang browser roi tiep tuc queue puter con lai
function browserFallbackQueue(mySeq) {
	if (mySeq !== gSeq) return;
	const rest = puterQueue.slice();
	puterQueue = [];
	if (!rest.length) {
		puterAudio = null;
		ttsSetBusy(false);
		return;
	}
	try { Text2SpeechBrowser(rest[0], true, function () {
		if (mySeq !== gSeq) return;
		puterQueue = rest.slice(1);
		puterPlayQueue(mySeq);
	}); } catch (e) {
		puterQueue = rest.slice(1);
		puterPlayQueue(mySeq);
	}
}

// Rot ca text hien tai xuong browser
function browserFallbackText(mySeq) {
	if (mySeq !== gSeq) return;
	puterQueue = [];
	puterAudio = null;
	try { Text2SpeechBrowser(gLastText, true); }
	catch (e) { ttsSetBusy(false); }
}

function puterSpeak(text, mySeq) {
	if (mySeq !== gSeq) return;
	puterEnsureAuth().then(function (ok) {
		if (mySeq !== gSeq) return;
		if (!ok) { browserFallbackText(mySeq); return; }
		const chunks = puterChunk(text.length > 6000 ? text.slice(0, 6000) : text);
		puterQueue = chunks.slice();
		puterPlayQueue(mySeq);
	});
}

// =====================================================
// Browser path (offline) - ton trong voice da chon o Setting
// =====================================================
let browserVoicesCache = null;
try {
	if (typeof speechSynthesis !== 'undefined') {
		try { speechSynthesis.getVoices(); } catch (e) {}
		try {
			speechSynthesis.onvoiceschanged = function () { browserVoicesCache = null; };
		} catch (e) {}
	}
} catch (e) {}
function pickBestBrowserVoice() {
	try {
		if (typeof speechSynthesis === 'undefined') return null;
		const vs = browserVoicesCache || (browserVoicesCache = speechSynthesis.getVoices() || []);
		if (!vs.length) return null;
		const en = vs.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf('en') === 0; });
		const pool = en.length ? en : vs;
		const score = function (v) {
			const n = (v.name || '').toLowerCase();
			let s = 0;
			if (n.indexOf('natural') >= 0) s += 5;
			if (n.indexOf('google') >= 0) s += 4;
			if (n.indexOf('samantha') >= 0 || n.indexOf('aria') >= 0 || n.indexOf('jenny') >= 0) s += 4;
			if ((v.lang || '').toLowerCase() === 'en-us') s += 2;
			return s;
		};
		let best = pool[0], bs = -1;
		pool.forEach(function (v) { const sc = score(v); if (sc > bs) { bs = sc; best = v; } });
		return best;
	} catch (e) { return null; }
}
function Text2SpeechBrowser(word, force, onDone) {
	try {
		if (typeof speechSynthesis === 'undefined') {
			ttsSetBusy(false);
			if (typeof onDone === 'function') onDone();
			return;
		}
		if (speechSynthesis.speaking) {
			try { utter.onend = null; utter.onerror = null; } catch (e) {}
			speechSynthesis.cancel();
			if (!force && !onDone && word == utter.text) { ttsSetBusy(false); return; }
		}
		utter.text = word;
		utter.onend = function () {
			ttsSetBusy(false);
			if (typeof onDone === 'function') { const f = onDone; onDone = null; try { f(); } catch (e) {} }
		};
		utter.onerror = function () {
			ttsSetBusy(false);
			if (typeof onDone === 'function') { const f = onDone; onDone = null; try { f(); } catch (e) {} }
		};
		try {
			let bv = null;
			const vs = browserVoicesCache || (browserVoicesCache = speechSynthesis.getVoices() || []);
			try {
				if (typeof Helper_loadStr === 'function' && typeof Helper_BrowserVoiceKey !== 'undefined') {
					const uri = Helper_loadStr(Helper_BrowserVoiceKey, '');
					if (uri && vs) {
						for (let i = 0; i < vs.length; i++) {
							if (vs[i] && vs[i].voiceURI === uri) { bv = vs[i]; break; }
						}
					}
				}
			} catch (e2) {}
			if (!bv) bv = pickBestBrowserVoice();
			if (bv) utter.voice = bv;
		} catch (e) {}
		try { utter.pitch = Helper_loadFloat(Helper_AudioPitchKey, 1); } catch (e) { utter.pitch = 1; }
		try { utter.rate = Text2SpeechRate(); } catch (e) { utter.rate = 1; }
		utter.volume = 1;
		utter.lang = 'en-US';
		ttsSetBusy(true);
		try { window.__lastTtsEngine = 'browser'; } catch (e) {}
		speechSynthesis.speak(utter);
	} catch (e) {
		ttsSetBusy(false);
		if (typeof onDone === 'function') { try { onDone(); } catch (e2) {} }
	}
}

// =====================================================
// Entry chinh
// =====================================================
function Text2Speech(word, force) {
	const text = Text2SpeechClean(word);
	if (!text) return;
	try { ttsEnsureCtx(); } catch (e) {} // iOS: mo khoa audio ngay trong gesture

	// Click lai cung 1 cau dang doc -> dung (giu hanh vi cu).
	// force=true (nut loa Quiz): bam lai la replay tu dau, khong toggle-stop.
	if (!force && text === gLastText && (puterAudio || puterQueue.length)) {
		Text2SpeechStop();
		return;
	}
	Text2SpeechStop();
	gLastText = text;
	const mySeq = ++gSeq;
	ttsSetBusy(true); // dung co ngay tu luc bam -> click spam ke tiep bi chan

	const src = Text2SpeechSource();
	if (src === 'browser') {
		Text2SpeechBrowser(text, force);
		return;
	}
	puterSpeak(text, mySeq);
}

// Bam loa Quiz: moi lan bam la replay tu dau (khong toggle-stop nhu Text2Speech thuong)
function Text2SpeechReplay(word) {
	Text2Speech(word, true);
}
