// TTS: Browser speechSynthesis (offline, chay tot tren Safari/Desktop).
// Gi nguyen ten ham Text2Speech(word) nen khong can sua cho goi.
const utter = new SpeechSynthesisUtterance();

let gLastText = '';

// Co BUSY: dang phat -> Text2SpeechIsBusy() === true.
let ttsBusy = false;
function ttsSetBusy(v) { ttsBusy = !!v; }
function Text2SpeechIsBusy() {
	if (ttsBusy) return true;
	try {
		if (typeof speechSynthesis !== 'undefined' && speechSynthesis.speaking) return true;
	} catch (e) {}
	return false;
}

function Text2SpeechStop() {
	gLastText = '';
	ttsSetBusy(false);
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
	// Bo IPA /.../ va nhan loai tu (n) (v) (adj) (adv) (n,v)... -> thay bang dau cham (ngat cau)
	// VD: "Blow my mind (v) /bloU mai maind/ The visual effects..."
	//  -> "Blow my mind. The visual effects..."
	s = s.replace(/\/[^\/]+\//g, '.');
	s = s.replace(/\([A-Za-z]+(?:\s*[,/]\s*[A-Za-z]+)*\)/g, '.');
	// gon dau cham + khoang trang: "word . . The" -> "word. The"
	s = s.replace(/\s+\./g, '.').replace(/\.{2,}/g, '.').replace(/\.([A-Za-z])/g, '. $1').replace(/\s+/g, ' ').trim();
	return s;
}

// Giu de tuong thich: luon tra ve 'browser', migrate gia tri cu (google/puter/edge).
function Text2SpeechSource() {
	try {
		if (typeof Helper_loadStr === 'function' && typeof Helper_TTSSourceKey !== 'undefined') {
			const v = Helper_loadStr(Helper_TTSSourceKey, 'browser');
			if (v !== 'browser') {
				try { Helper_saveDB(Helper_TTSSourceKey, 'browser'); } catch (e2) {}
			}
		}
	} catch (e) {}
	return 'browser';
}

function Text2SpeechRate() {
	let rate = 1;
	try { rate = Helper_loadFloat(Helper_AudioRateKey, 1) || 1; } catch (e) {}
	if (!(rate >= 0.5 && rate <= 2)) rate = 1;
	return rate;
}

// =====================================================
// Browser path - ton trong voice da chon o Setting
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

	// Click lai cung 1 cau dang doc -> dung (giu hanh vi cu).
	// force=true (nut loa Quiz): bam lai la replay tu dau, khong toggle-stop.
	if (!force && text === gLastText) {
		try {
			if (typeof speechSynthesis !== 'undefined' && speechSynthesis.speaking) {
				Text2SpeechStop();
				return;
			}
		} catch (e) {}
	}
	Text2SpeechStop();
	gLastText = text;
	ttsSetBusy(true); // dung co ngay tu luc bam -> click spam ke tiep bi chan

	Text2SpeechBrowser(text, force);
}

// Bam loa Quiz: moi lan bam la replay tu dau (khong toggle-stop nhu Text2Speech thuong)
function Text2SpeechReplay(word) {
	Text2Speech(word, true);
}
