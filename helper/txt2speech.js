// TTS simple: Google Translate TTS (free, khong key/login) -> Browser speechSynthesis (offline).
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

// Google path state
let gAudio = null;
let gQueue = [];

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
	gQueue = [];
	gLastText = '';
	ttsSetBusy(false);
	if (gAudio) {
		try { gAudio.pause(); } catch (e) {}
		try { gAudio.currentTime = 0; } catch (e) {}
		try { gAudio.onended = null; gAudio.onerror = null; } catch (e) {}
		gAudio = null;
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
			const v = Helper_loadStr(Helper_TTSSourceKey, 'google');
			if (v === 'google' || v === 'browser') return v;
			// migrate gia tri cu (puter/edge) -> google
			try { Helper_saveDB(Helper_TTSSourceKey, 'google'); } catch (e2) {}
			return 'google';
		}
	} catch (e) {}
	return 'google';
}

function Text2SpeechRate() {
	let rate = 1;
	try { rate = Helper_loadFloat(Helper_AudioRateKey, 1) || 1; } catch (e) {}
	if (!(rate >= 0.5 && rate <= 2)) rate = 1;
	return rate;
}

// =====================================================
// Google path (chinh) - Google Translate TTS, free, khong key/login.
// Phat qua <audio> nen khong vuong CORS; chunk <=170 ky tu theo cau.
// Chunk loi -> rot chunk do xuong browser, cac chunk sau van chay Google.
// =====================================================
function Text2SpeechGoogleURL(chunk) {
	return 'https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=' + encodeURIComponent(chunk);
}
function Text2SpeechChunk(text) {
	const MAX = 170;
	const parts = [];
	let cur = '';
	const sentences = String(text).split(/(?<=[.!?])\s+|;\s*|,\s*(?=. {20,})/);
	sentences.forEach(function (sen) {
		sen = (sen || '').trim();
		if (!sen) return;
		while (sen.length > MAX) {
			let cut = sen.lastIndexOf(' ', MAX);
			if (cut < 40) cut = MAX;
			parts.push(sen.slice(0, cut));
			sen = sen.slice(cut).trim();
		}
		if ((cur + ' ' + sen).trim().length <= MAX) {
			cur = (cur + ' ' + sen).trim();
		} else {
			if (cur) parts.push(cur);
			cur = sen;
		}
	});
	if (cur) parts.push(cur);
	return parts.length ? parts : [text];
}
function Text2SpeechPlayQueue(mySeq) {
	if (mySeq !== gSeq) return;
	const chunk = gQueue.shift();
	if (chunk == null) {
		gAudio = null;
		ttsSetBusy(false);
		return;
	}
	ttsSetBusy(true);
	const audio = new Audio();
	gAudio = audio;
	try { audio.playbackRate = Text2SpeechRate(); } catch (e) {}
	try { audio.preload = 'auto'; } catch (e) {}
	let settled = false;
	audio.onended = function () {
		if (settled) return;
		settled = true;
		Text2SpeechPlayQueue(mySeq);
	};
	audio.onerror = function () {
		if (settled) return;
		settled = true;
		try { Text2SpeechBrowser(chunk, true, function () { Text2SpeechPlayQueue(mySeq); }); }
		catch (e) { Text2SpeechPlayQueue(mySeq); }
	};
	try {
		audio.src = Text2SpeechGoogleURL(chunk);
		const p = audio.play();
		if (p && typeof p.catch === 'function') {
			p.catch(function () {
				// iOS chan play() -> rot chunk nay xuong browser, giu queue Google
				if (settled || mySeq !== gSeq) return;
				settled = true;
				try { Text2SpeechBrowser(chunk, true, function () { Text2SpeechPlayQueue(mySeq); }); }
				catch (e) { Text2SpeechPlayQueue(mySeq); }
			});
		}
	} catch (e) {
		if (!settled) {
			settled = true;
			try { Text2SpeechBrowser(chunk, true, function () { Text2SpeechPlayQueue(mySeq); }); }
			catch (e2) { Text2SpeechPlayQueue(mySeq); }
		}
	}
}
function googleSpeak(text, mySeq) {
	if (mySeq !== gSeq) return;
	try { window.__lastTtsEngine = 'google'; } catch (e) {}
	const chunks = Text2SpeechChunk(text.length > 2800 ? text.slice(0, 2800) : text);
	gQueue = chunks.slice();
	Text2SpeechPlayQueue(mySeq);
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
	if (!force && text === gLastText && (gAudio || gQueue.length)) {
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
	googleSpeak(text, mySeq);
}

// Bam loa Quiz: moi lan bam la replay tu dau (khong toggle-stop nhu Text2Speech thuong)
function Text2SpeechReplay(word) {
	Text2Speech(word, true);
}
