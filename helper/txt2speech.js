// Edge neural TTS (hay, free, KHONG login/key) -> Google -> speechSynthesis fallback
// Chay thang tu browser qua WebSocket wss://speech.platform.bing.com (Read Aloud endpoint).
// Giữ nguyên tên hàm Text2Speech(word) nên không cần sửa chỗ gọi.

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
// Edge path state
let edgeAudio = null;
let edgeUrl = null;
let edgeWS = null;
let EDGE_DOWN_UNTIL = 0; // cooldown khi Edge loi -> tam dung Edge, dung Google

function revokeEdgeUrl() {
	if (edgeUrl) {
		try { URL.revokeObjectURL(edgeUrl); } catch (e) {}
		edgeUrl = null;
	}
}

function Text2SpeechStop() {
	gSeq++;
	gQueue = [];
	gLastText = '';
	ttsSetBusy(false);
	try {
		if (edgeWS) {
			edgeWS.onopen = null; edgeWS.onclose = null;
			edgeWS.onerror = null; edgeWS.onmessage = null;
			edgeWS.close();
		}
	} catch (e) {}
	edgeWS = null;
	if (edgeAudio) {
		try { edgeAudio.pause(); } catch (e) {}
		edgeAudio = null;
	}
	revokeEdgeUrl();
	if (gAudio) {
		try { gAudio.pause(); } catch (e) {}
		try { gAudio.currentTime = 0; } catch (e) {}
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
			let v = Helper_loadStr(Helper_TTSSourceKey, 'edge');
			// migrate 1 lan: ban Google cu nghe do -> chuyen sang Edge neural
			try {
				if (v === 'google' && typeof Helper_loadStr === 'function'
					&& Helper_loadStr('TTSSourceMigrated', '') !== '1') {
					Helper_saveDB(Helper_TTSSourceKey, 'edge');
					Helper_saveDB('TTSSourceMigrated', '1');
					v = 'edge';
				}
			} catch (e2) {}
			if (v === 'edge' || v === 'google' || v === 'browser') return v;
		}
	} catch (e) {}
	return 'edge';
}

function Text2SpeechRate() {
	let rate = 1;
	try { rate = Helper_loadFloat(Helper_AudioRateKey, 1) || 1; } catch (e) {}
	if (!(rate >= 0.5 && rate <= 2)) rate = 1;
	return rate;
}

// =====================================================
// SHA-256 (sync, cho Sec-MS-GEC). Dung khi crypto.subtle khong co.
// Chuoi hash luon ASCII (so + hex token) nen chi can ban ASCII.
// =====================================================
function sha256Ascii(str) {
	function rr(v, a) { return (v >>> a) | (v << (32 - a)); }
	const maxWord = Math.pow(2, 32);
	let result = '';
	const words = [];
	const asciiBitLength = str.length * 8;
	let hash = sha256Ascii.h = sha256Ascii.h || [];
	const k = sha256Ascii.k = sha256Ascii.k || [];
	let primeCounter = k.length;
	const isComposite = {};
	for (let candidate = 2; primeCounter < 64; candidate++) {
		if (!isComposite[candidate]) {
			for (let i = 0; i < 313; i += candidate) { isComposite[i] = candidate; }
			hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
			k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
		}
	}
	str += '\x80';
	while (str.length % 64 - 56) str += '\x00';
	for (let i = 0; i < str.length; i++) {
		const j = str.charCodeAt(i);
		if (j >> 8) return '';
		words[i >> 2] |= j << ((3 - i) % 4) * 8;
	}
	words[words.length] = (asciiBitLength / maxWord) | 0;
	words[words.length] = asciiBitLength;
	for (let j = 0; j < words.length;) {
		const w = words.slice(j, j += 16);
		const oldHash = hash;
		hash = hash.slice(0, 8);
		for (let i = 0; i < 64; i++) {
			const w15 = w[i - 15], w2 = w[i - 2];
			const a = hash[0], e = hash[4];
			const temp1 = hash[7]
				+ (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25))
				+ ((e & hash[5]) ^ ((~e) & hash[6]))
				+ k[i]
				+ (w[i] = (i < 16) ? w[i] : (
					w[i - 16]
					+ (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3))
					+ w[i - 7]
					+ (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))
				) | 0);
			const temp2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22))
				+ ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
			hash = [(temp1 + temp2) | 0].concat(hash);
			hash[4] = (hash[4] + temp1) | 0;
		}
		for (let i = 0; i < 8; i++) { hash[i] = (hash[i] + oldHash[i]) | 0; }
	}
	for (let i = 0; i < 8; i++) {
		for (let j = 3; j + 1; j--) {
			const b = (hash[i] >> (j * 8)) & 255;
			result += ((b < 16) ? '0' : '') + b.toString(16);
		}
	}
	return result;
}

// =====================================================
// Edge TTS helpers (dulieu tu edge-tts, token public)
// =====================================================
const EDGE_TRUSTED_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const EDGE_GEC_VERSION = '1-143.0.3650.75';

function edgeHexId() {
	try {
		const a = new Uint8Array(16);
		crypto.getRandomValues(a);
		a[6] = (a[6] & 0x0f) | 0x40;
		a[8] = (a[8] & 0x3f) | 0x80;
		return Array.from(a, function (b) { return b.toString(16).padStart(2, '0'); }).join('');
	} catch (e) {
		let s = '';
		for (let i = 0; i < 32; i++) s += '0123456789abcdef'[Math.floor(Math.random() * 16)];
		return s;
	}
}

function edgeDateStr() {
	const d = new Date();
	const D = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()];
	const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()];
	const p = function (n) { return String(n).padStart(2, '0'); };
	return D + ' ' + M + ' ' + p(d.getUTCDate()) + ' ' + d.getUTCFullYear() + ' '
		+ p(d.getUTCHours()) + ':' + p(d.getUTCMinutes()) + ':' + p(d.getUTCSeconds())
		+ ' GMT+0000 (Coordinated Universal Time)';
}

function edgeVoice() {
	try {
		if (typeof Helper_loadStr === 'function' && typeof Helper_EdgeVoiceKey !== 'undefined') {
			const v = Helper_loadStr(Helper_EdgeVoiceKey, 'en-US-AriaNeural');
			if (v) return v;
		}
	} catch (e) {}
	return 'en-US-AriaNeural';
}

// rate 0.5..2 -> "-50%".."+100%"; pitch 0..2 -> "-20Hz".."+20Hz"
function edgeRateStr() {
	const pct = Math.round((Text2SpeechRate() - 1) * 100);
	return (pct >= 0 ? '+' : '') + pct + '%';
}
function edgePitchStr() {
	let pitch = 1;
	try { pitch = Helper_loadFloat(Helper_AudioPitchKey, 1); } catch (e) {}
	if (!(pitch >= 0 && pitch <= 2)) pitch = 1;
	const hz = Math.round((pitch - 1) * 20);
	return (hz >= 0 ? '+' : '') + hz + 'Hz';
}

function edgeXmlEscape(s) {
	return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function edgeCleanText(s) {
	// service khong chiu cac ky tu dieu khien
	return String(s).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, ' ');
}
function edgeSSML(voice, text) {
	const lang = voice.split('-').slice(0, 2).join('-') || 'en-US';
	return "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='" + lang + "'>"
		+ "<voice name='" + voice + "'>"
		+ "<prosody pitch='" + edgePitchStr() + "' rate='" + edgeRateStr() + "' volume='+0%'>"
		+ edgeXmlEscape(edgeCleanText(text))
		+ '</prosody></voice></speak>';
}
function edgeConfigMsg() {
	return 'X-Timestamp:' + edgeDateStr() + '\r\n'
		+ 'Content-Type:application/json; charset=utf-8\r\n'
		+ 'Path:speech.config\r\n\r\n'
		+ '{"context":{"synthesis":{"audio":{"metadataoptions":'
		+ '{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},'
		+ '"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n';
}

// Sec-MS-GEC = SHA256(<win ticks tron 5 phut> + token), uu tien crypto.subtle
function edgeSecMsGec() {
	const WIN_EPOCH = 11644473600;
	let sec = Math.floor(Date.now() / 1000);
	let ticksStr;
	try {
		if (typeof BigInt !== 'undefined') {
			let t = BigInt(sec) + BigInt(WIN_EPOCH);
			t -= t % BigInt(300);
			t *= BigInt(10000000);
			ticksStr = t.toString();
		} else {
			let t = sec + WIN_EPOCH;
			t -= t % 300;
			ticksStr = String(t * 10000000);
		}
	} catch (e) {
		let t = sec + WIN_EPOCH;
		t -= t % 300;
		ticksStr = String(t * 10000000);
	}
	const raw = ticksStr + EDGE_TRUSTED_TOKEN;
	try {
		if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
			return crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw)).then(function (buf) {
				return Array.from(new Uint8Array(buf), function (b) {
					return b.toString(16).padStart(2, '0');
				}).join('').toUpperCase();
			});
		}
	} catch (e) {}
	try {
		const h = sha256Ascii(raw);
		if (h) return Promise.resolve(h.toUpperCase());
	} catch (e) {}
	return Promise.reject(new Error('no sha256'));
}
function edgeWssUrl(gec) {
	return 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1'
		+ '?TrustedClientToken=' + EDGE_TRUSTED_TOKEN
		+ '&ConnectionId=' + edgeHexId()
		+ '&Sec-MS-GEC=' + encodeURIComponent(gec)
		+ '&Sec-MS-GEC-Version=' + encodeURIComponent(EDGE_GEC_VERSION);
}

// Cat text dai thanh chunk (~1200 ky tu, ngat o cau/tu)
function edgeChunk(text) {
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

// 1 turn: gui SSML, gom audio bytes den khi Path:turn.end
function edgeOneTurn(ws, ssml) {
	return new Promise(function (resolve, reject) {
		const reqId = edgeHexId();
		const parts = [];
		let done = false;
		const timer = setTimeout(function () {
			if (!done) { done = true; reject(new Error('edge timeout')); }
		}, 15000);
		let decoder = null;
		try { decoder = new TextDecoder(); } catch (e) {}
		ws.onmessage = function (ev) {
			if (done) return;
			try {
				const data = ev.data;
				if (typeof data === 'string') {
					if (data.indexOf('Path:turn.end') >= 0) {
						done = true; clearTimeout(timer); resolve(parts);
					}
					// turn.start / response / metadata -> bo qua
				} else if (data instanceof ArrayBuffer) {
					if (data.byteLength < 2) return;
					const hlen = new DataView(data).getUint16(0);
					let header = '';
					try { header = decoder ? decoder.decode(data.slice(2, 2 + hlen)) : ''; } catch (e) {}
					if (header.indexOf('Path:audio') >= 0) parts.push(data.slice(2 + hlen));
				}
			} catch (e) { done = true; clearTimeout(timer); reject(e); }
		};
		try {
			ws.send('X-RequestId:' + reqId + '\r\n'
				+ 'Content-Type:application/ssml+xml\r\n'
				+ 'X-Timestamp:' + edgeDateStr() + 'Z\r\n'
				+ 'Path:ssml\r\n\r\n' + ssml);
		} catch (e) { done = true; clearTimeout(timer); reject(e); }
	});
}

function edgePlayBlob(parts, mySeq, done) {
	let finished = false;
	const ok = function (v) { if (!finished) { finished = true; done(v); } };
	try {
		const blob = new Blob(parts, { type: 'audio/mpeg' });
		revokeEdgeUrl();
		edgeUrl = URL.createObjectURL(blob);
		const audio = new Audio();
		edgeAudio = audio;
		audio.onended = function () {
			if (audio !== edgeAudio) return;
			edgeAudio = null; revokeEdgeUrl(); ttsSetBusy(false);
		};
		audio.onerror = function () {
			if (audio !== edgeAudio) return;
			edgeAudio = null; revokeEdgeUrl(); ttsSetBusy(false);
		};
		try { audio.playbackRate = 1; } catch (e) {}
		audio.src = edgeUrl;
		audio.onplaying = function () { ok(true); };
		const pr = audio.play();
		if (pr && typeof pr.catch === 'function') {
			pr.catch(function () {
				if (audio !== edgeAudio) return;
				edgeAudio = null; revokeEdgeUrl(); ok(false);
			});
		}
		setTimeout(function () { ok(true); }, 2000); // trinh duyet cu khong co playing/play-promise
	} catch (e) { ok(false); }
}

// Tra ve Promise<boolean>: true = dang phat Edge, false = that bai -> fallback
function edgeSpeak(text, mySeq) {
	return new Promise(function (resolve) {
		let settled = false;
		const finish = function (v) { if (!settled) { settled = true; resolve(v); } };
		let ws = null;
		try {
			if (typeof WebSocket === 'undefined') { finish(false); return; }
		} catch (e) { finish(false); return; }
		edgeSecMsGec().then(function (gec) {
			if (mySeq !== gSeq) { finish(false); return; }
			try { ws = new WebSocket(edgeWssUrl(gec)); }
			catch (e) { finish(false); return; }
			edgeWS = ws;
			try { ws.binaryType = 'arraybuffer'; } catch (e) {}
			const openTimer = setTimeout(function () {
				if (!settled) { try { ws.close(); } catch (e) {} finish(false); }
			}, 10000);
			ws.onerror = function () { if (!settled) { clearTimeout(openTimer); finish(false); } };
			ws.onclose = function () { if (!settled) { clearTimeout(openTimer); finish(false); } };
			ws.onopen = function () {
				clearTimeout(openTimer);
				(async function () {
					try {
						if (mySeq !== gSeq) throw new Error('stale');
						ws.send(edgeConfigMsg());
						const chunks = edgeChunk(text.length > 6000 ? text.slice(0, 6000) : text);
						const all = [];
						for (let i = 0; i < chunks.length; i++) {
							if (mySeq !== gSeq) throw new Error('stale');
						 const parts = await edgeOneTurn(ws, edgeSSML(edgeVoice(), chunks[i]));
							for (let k = 0; k < parts.length; k++) all.push(parts[k]);
						}
						try { ws.close(); } catch (e) {}
						if (edgeWS === ws) edgeWS = null;
						if (mySeq !== gSeq) throw new Error('stale');
						if (!all.length) throw new Error('no audio');
						edgePlayBlob(all, mySeq, finish);
					} catch (e) {
						try { ws.close(); } catch (e2) {}
						if (edgeWS === ws) edgeWS = null;
						finish(false);
					}
				})();
			};
		}, function () { finish(false); });
	});
}

// =====================================================
// Google path (du phong khi Edge loi)
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
				if (settled || mySeq !== gSeq) return;
				settled = true;
				try { Text2SpeechBrowser(chunk, true, function () { Text2SpeechPlayQueue(mySeq); }); }
				catch (e) { Text2SpeechPlayQueue(mySeq); }
			});
		}
	} catch (e) {
		if (!settled) {
			settled = true;
			Text2SpeechBrowser(chunk, true, function () { Text2SpeechPlayQueue(mySeq); });
		}
	}
}
function googleSpeak(text, mySeq) {
	if (mySeq !== gSeq) return;
	const chunks = Text2SpeechChunk(text.length > 2800 ? text.slice(0, 2800) : text);
	gQueue = chunks.slice();
	Text2SpeechPlayQueue(mySeq);
}

// =====================================================
// Browser path (offline) - tu chon voice EN hay nhat
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
			if (n.indexOf('aria') >= 0 || n.indexOf('jenny') >= 0 || n.indexOf('guy') >= 0) s += 4;
			if (n.indexOf('microsoft') >= 0) s += 2;
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
			const bv = pickBestBrowserVoice();
			if (bv) utter.voice = bv;
		} catch (e) {}
		try { utter.pitch = Helper_loadFloat(Helper_AudioPitchKey, 1); } catch (e) { utter.pitch = 1; }
		try { utter.rate = Text2SpeechRate(); } catch (e) { utter.rate = 1; }
		utter.volume = 1;
		utter.lang = 'en-US';
		ttsSetBusy(true);
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
	if (!force && text === gLastText && (edgeAudio || gAudio || gQueue.length || edgeWS)) {
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
	if (src === 'google') {
		googleSpeak(text, mySeq);
		return;
	}
	// Edge mac dinh; loi/timeout -> nghi Edge 3 phut, rot xuong Google
	if (Date.now() < EDGE_DOWN_UNTIL) {
		googleSpeak(text, mySeq);
		return;
	}
	edgeSpeak(text, mySeq).then(function (ok) {
		if (mySeq !== gSeq) return; // da co request moi hon
		if (ok) return; // dang phat Edge, busy se ha khi audio ended
		EDGE_DOWN_UNTIL = Date.now() + 3 * 60 * 1000;
		googleSpeak(text, mySeq);
	});
}

// Bam loa Quiz: moi lan bam la replay tu dau (khong toggle-stop nhu Text2Speech thuong)
function Text2SpeechReplay(word) {
	Text2Speech(word, true);
}
