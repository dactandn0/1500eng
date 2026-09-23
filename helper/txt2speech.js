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
	gSeq++;
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
	try {
		if (typeof speechSynthesis !== 'undefined' && speechSynthesis.speaking) {
			speechSynthesis.cancel();
		}
	} catch (e) {}
}

function Text2SpeechClean(input) {
	console.log('Text2SpeechClean input:', input);
	let s = (input == null ? '' : String(input));
	try {
		if (typeof Helper_RemoveHTMLtag === 'function') s = Helper_RemoveHTMLtag(s);
		else s = s.replace(/(<([^>]+)>)/ig, '');
	} catch (e) {
		s = s.replace(/(<([^>]+)>)/ig, '');
	}
	s = s.replace(/&/g, ' and ').replace(/\s+/g, ' ').trim();
	// Noi am tu nhien (reductions) truoc khi dua vao TTS: want to -> wanna...
	s = s.replace(/\bwant\s+to\b/gi, 'wanna').replace(/\bwant\s+a\b/gi, 'wanna')
		.replace(/\bhave\s+to\b/gi, 'hafta')
		.replace(/\bgot\s+to\b/gi, 'gotta').replace(/\bgoing\s+to\b/gi, 'gonna')
		.replace(/\bought\s+to\b/gi, 'oughta').replace(/\bkind\s+of\b/gi, 'kinda')
		.replace(/\bout\s+of\b/gi, 'outta').replace(/\bsort\s+of\b/gi, 'sorta')
		.replace(/\blots\s+of\b/gi, 'lotsa').replace(/\bcup\s+of\b/gi, 'cuppa');
	// Bo IPA /.../ va nhan loai tu (n) (v) (adj) (adv) (n,v)... -> thay bang dau cham (ngat cau)
	// VD: "Blow my mind (v) /bloU mai maind/ The visual effects..."
	//  -> "Blow my mind. The visual effects..."
	s = s.replace(/\/[^\/]+\//g, '.');
	s = s.replace(/\([A-Za-z]+(?:\s*[,/]\s*[A-Za-z]+)*\)/g, '.');
	// gon dau cham + khoang trang: "word . . The" -> "word. The"
	s = s.replace(/\s+\./g, '.').replace(/\.{2,}/g, '.').replace(/\.([A-Za-z])/g, '. $1').replace(/\s+/g, ' ').trim();
	return s;
}

// Giu de tuong thich: 'edge' | 'se' | 'browser'. Gia tri cu -> browser.
function Text2SpeechSource() {
	try {
		if (typeof Helper_loadStr === 'function' && typeof Helper_TTSSourceKey !== 'undefined') {
			const v = Helper_loadStr(Helper_TTSSourceKey, 'browser');
			if (v === 'edge' || v === 'se' || v === 'browser') return v;
			try { Helper_saveDB(Helper_TTSSourceKey, 'browser'); } catch (e2) {}
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
// Edge neural TTS (direct WSS, khong can proxy/server).
// Browser khong set duoc header Edg/Origin nen nhieu mang se 403
// -> tu rot xuong browser, khong vo app.
let gSeq = 0; // stale-guard cho Edge async
let edgeAudio = null;
let edgeUrl = null;
let edgeWS = null;
let EDGE_DOWN_UNTIL = 0; // Edge loi -> nghi 2 phut, dung browser
// iOS Safari: chi cho phat am trong user-gesture -> mo khoa AudioContext san,
// audio fetch ve sau (mat gesture) thi phat qua WebAudio thay vi <audio>.
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
const EDGE_TRUSTED_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const EDGE_GEC_VERSION = '1-143.0.3650.75';

function Text2SpeechResetEdgeCooldown() { EDGE_DOWN_UNTIL = 0; try { EDGE_PROXY_DOWN_UNTIL = 0; } catch (e) {} try { SE_DOWN_UNTIL = 0; } catch (e2) {} }
function revokeEdgeUrl() {
	if (edgeUrl) { try { URL.revokeObjectURL(edgeUrl); } catch (e) {} edgeUrl = null; }
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
function edgeSSML(voice, text) {
	const lang = voice.split('-').slice(0, 2).join('-') || 'en-US';
	return "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='" + lang + "'>"
		+ "<voice name='" + voice + "'>"
		+ "<prosody pitch='" + edgePitchStr() + "' rate='" + edgeRateStr() + "' volume='+0%'>"
		+ edgeXmlEscape(String(text).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, ' '))
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
function edgeSecMsGec() {
	const WIN_EPOCH = 11644473600;
	const sec = Math.floor(Date.now() / 1000);
	let ticksStr;
	try {
		if (typeof BigInt !== 'undefined') {
			let t = BigInt(sec) + BigInt(WIN_EPOCH);
			t -= t % BigInt(300);
			ticksStr = (t * BigInt(10000000)).toString();
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
	return Promise.reject(new Error('no subtle crypto'));
}
function edgeWssUrl(gec) {
	return 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1'
		+ '?TrustedClientToken=' + EDGE_TRUSTED_TOKEN
		+ '&ConnectionId=' + edgeHexId()
		+ '&Sec-MS-GEC=' + encodeURIComponent(gec)
		+ '&Sec-MS-GEC-Version=' + encodeURIComponent(EDGE_GEC_VERSION);
}
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
function edgeParseBinary(buf, parts, decoder) {
	try {
		if (!buf || buf.byteLength < 2) return;
		const hlen = new DataView(buf).getUint16(0);
		let header = '';
		try { header = decoder ? decoder.decode(buf.slice(2, 2 + hlen)) : ''; } catch (e) {}
		if (header.indexOf('Path:audio') >= 0) parts.push(buf.slice(2 + hlen));
	} catch (e) {}
}
function edgeOneTurn(ws, ssml) {
	return new Promise(function (resolve, reject) {
		const reqId = edgeHexId();
		const parts = [];
		let done = false;
		let resolved = false;
		const timer = setTimeout(function () {
			if (!done) { done = true; resolved = true; reject(new Error('edge timeout')); }
		}, 15000);
		let decoder = null;
		try { decoder = new TextDecoder(); } catch (e) {}
		ws.onmessage = function (ev) {
			if (resolved) return;
			try {
				const data = ev.data;
				if (typeof data === 'string') {
					if (data.indexOf('Path:turn.end') >= 0) {
						done = true; clearTimeout(timer);
						setTimeout(function () { resolved = true; resolve(parts); }, 300);
					}
				} else if (typeof Blob !== 'undefined' && data instanceof Blob) {
					try {
						if (typeof data.arrayBuffer === 'function') {
							data.arrayBuffer().then(function (buf) {
								if (resolved) return;
								edgeParseBinary(buf, parts, decoder);
							}, function () {});
						} else {
							const fr = new FileReader();
							fr.onload = function () {
								if (resolved) return;
								try { edgeParseBinary(fr.result, parts, decoder); } catch (e2) {}
							};
							try { fr.readAsArrayBuffer(data); } catch (e2) {}
						}
					} catch (e) {}
				} else if (data instanceof ArrayBuffer) {
					edgeParseBinary(data, parts, decoder);
				}
			} catch (e) { done = true; resolved = true; clearTimeout(timer); reject(e); }
		};
		try {
			ws.send('X-RequestId:' + reqId + '\r\n'
				+ 'Content-Type:application/ssml+xml\r\n'
				+ 'X-Timestamp:' + edgeDateStr() + 'Z\r\n'
				+ 'Path:ssml\r\n\r\n' + ssml);
		} catch (e) { done = true; resolved = true; clearTimeout(timer); reject(e); }
	});
}
function edgePlayBlob(parts, mySeq, done, tag) {
	let finished = false;
	const ok = function (v) { if (!finished) { finished = true; done(v); } };
	let played = false; // Safari cu: play() khong tra promise -> chi tin onplaying
	// Safari chan <audio>.play() sau fetch async -> decode phat qua WebAudio
	const webFallback = function () {
		try { window.__seFail = 'play(' + (tag || 'edge') + ')'; } catch (e) {}
		try {
			const bufs = [];
			let total = 0;
			for (let i = 0; i < parts.length; i++) {
				if (parts[i] instanceof ArrayBuffer) { bufs.push(new Uint8Array(parts[i])); total += parts[i].byteLength; }
			}
			if (!total) { ok(false); return; }
			const cat = new Uint8Array(total);
			let off = 0;
			bufs.forEach(function (u) { cat.set(u, off); off += u.length; });
			edgeDecodePlay(cat.buffer, ok);
		} catch (e) { ok(false); }
	};
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
			edgeAudio = null; revokeEdgeUrl(); webFallback();
		};
		try { audio.playbackRate = 1; } catch (e) {}
		audio.src = edgeUrl;
		audio.onplaying = function () { played = true; try { window.__lastTtsEngine = tag || 'edge'; } catch (e) {} ok(true); };
		try {
			const pr = audio.play();
			if (pr && typeof pr.catch === 'function') {
				pr.catch(function () {
					if (audio !== edgeAudio) return;
					edgeAudio = null; revokeEdgeUrl(); webFallback();
				});
			}
		} catch (e) {
			try { edgeAudio = null; revokeEdgeUrl(); } catch (e2) {}
			webFallback();
		}
		// Het 2s ma chua onplaying -> coi nhu bi chan, ep WebAudio fallback.
		// (finished = da xong (that bai -> browser) -> khong lam gi them de khoi chong tieng)
		setTimeout(function () {
			if (finished) return;
			if (!played) { try { if (audio === edgeAudio) { edgeAudio = null; revokeEdgeUrl(); } } catch (e) {} webFallback(); }
			else ok(true);
		}, 2000);
	} catch (e) { ok(false); }
}
// Phat ArrayBuffer mp3 qua WebAudio (fallback khi Safari chan <audio>)
function edgeDecodePlay(ab, done) {
	let finished = false;
	const ok = function (v) { if (!finished) { finished = true; done(v); } };
	try {
		const ctx = ttsEnsureCtx();
		if (!ctx || typeof ctx.decodeAudioData !== 'function') { ok(false); return; }
		const playBuf = function (audioBuf) {
			try {
				const src = ctx.createBufferSource();
				src.buffer = audioBuf;
				src.connect(ctx.destination);
				src.onended = function () {
					try { if (edgeAudio && edgeAudio._wa) edgeAudio = null; } catch (e2) {}
					ttsSetBusy(false);
				};
				ttsSetBusy(true);
				src.start(0);
				try {
					edgeAudio = { _wa: true, pause: function () { try { src.stop(); } catch (e2) {} try { edgeAudio = null; } catch (e3) {} ttsSetBusy(false); } };
				} catch (e2) {}
				try { window.__lastTtsEngine = 'edge(webaudio)'; } catch (e3) {}
				ok(true);
			} catch (e) { ok(false); }
		};
		let buf = ab;
		try { buf = ab.slice(0); } catch (e) {}
		try {
			const p = ctx.decodeAudioData(buf);
			if (p && typeof p.then === 'function') p.then(playBuf, function () { ok(false); });
			else ok(false);
		} catch (e) {
			// Safari cu: dang callback
			try { ctx.decodeAudioData(buf, playBuf, function () { ok(false); }); }
			catch (e2) { ok(false); }
		}
	} catch (e) { ok(false); }
}
function blobToArrayBuffer(blob) {
	return new Promise(function (resolve, reject) {
		try {
			if (blob && typeof blob.arrayBuffer === 'function') {
				blob.arrayBuffer().then(resolve, reject);
				return;
			}
			const fr = new FileReader();
			fr.onload = function () { resolve(fr.result); };
			fr.onerror = function () { reject(new Error('blob read')); };
			fr.readAsArrayBuffer(blob);
		} catch (e) { reject(e); }
	});
}
// =====================================================
// Edge qua proxy local (python edge_proxy.py -> /api/edge-tts).
// Chay local.bat thi browser goi proxy (cung origin) thay vi WSS truc tiep
// (Chrome khong set duoc header Edg/Origin nen hay 403).
let EDGE_PROXY_DOWN_UNTIL = 0;
function edgeProxyEligible() {
	try {
		if (typeof location === 'undefined' || !location.hostname) return false;
		const h = location.hostname;
		if (h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0') return true;
		if (h.indexOf('192.168.') === 0 || h.indexOf('10.') === 0) return true;
		if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(h)) return true;
	} catch (e) {}
	return false;
}
// Tra ve Promise<boolean>: true = dang phat Edge (qua proxy)
function edgeViaProxy(text, mySeq) {
	return new Promise(function (resolve) {
		let settled = false;
		const finish = function (v) { if (!settled) { settled = true; resolve(v); } };
		try {
			if (typeof fetch === 'undefined' || typeof AbortController === 'undefined') { finish(false); return; }
			if (!edgeProxyEligible()) { finish(false); return; }
			if (Date.now() < EDGE_PROXY_DOWN_UNTIL) { finish(false); return; }
		} catch (e) { finish(false); return; }
		let ctrl = null;
		let timer = null;
		try {
			ctrl = new AbortController();
			timer = setTimeout(function () { try { ctrl.abort(); } catch (e) {} }, 12000);
			fetch('api/edge-tts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					voice: edgeVoice(),
					text: text.length > 6000 ? text.slice(0, 6000) : text,
					rate: edgeRateStr(),
					pitch: edgePitchStr()
				}),
				signal: ctrl.signal
			}).then(function (resp) {
				if (mySeq !== gSeq) { finish(false); return null; }
				if (!resp || !resp.ok) throw new Error('proxy http ' + (resp && resp.status));
				return resp.blob();
			}).then(function (blob) {
				try {
					if (!blob) { finish(false); return; }
					if (mySeq !== gSeq) { finish(false); return; }
					if (!blob.size) { EDGE_PROXY_DOWN_UNTIL = Date.now() + 60 * 1000; finish(false); return; }
					try { clearTimeout(timer); } catch (e) {}
					// Dua ve ArrayBuffer roi phat chung 1 duong (co WebAudio fallback cho Safari)
					blobToArrayBuffer(blob).then(function (ab) {
						if (mySeq !== gSeq) { finish(false); return; }
						if (!ab || !ab.byteLength) { finish(false); return; }
						edgePlayBlob([ab], mySeq, finish);
					}, function () { finish(false); });
				} catch (e) {
					try { clearTimeout(timer); } catch (e2) {}
					EDGE_PROXY_DOWN_UNTIL = Date.now() + 60 * 1000;
					finish(false);
				}
			}, function () {
				try { clearTimeout(timer); } catch (e) {}
				if (mySeq !== gSeq) { finish(false); return; }
				EDGE_PROXY_DOWN_UNTIL = Date.now() + 60 * 1000;
				finish(false);
			});
		} catch (e) {
			try { if (timer) clearTimeout(timer); } catch (e2) {}
			finish(false);
		}
	});
}

// Tra ve Promise<boolean>: true = dang phat Edge, false = that bai -> fallback browser
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
// StreamElements TTS (free, khong key, CORS *).
// Chay truc tiep tu browser -> dung duoc tren GitHub Pages (tinh).
// API: GET https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=...
let SE_DOWN_UNTIL = 0;
function seVoice() {
	try {
		if (typeof Helper_loadStr === 'function' && typeof Helper_SEVoiceKey !== 'undefined') {
			const v = Helper_loadStr(Helper_SEVoiceKey, 'Brian');
			if (v) return v;
		}
	} catch (e) {}
	return 'Brian';
}
function seChunk(text) {
	const MAX = 300; // giu URL ngan
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
			if (piece.length <= MAX + 100) { cur = piece; }
			else { pushCur(); cur = sen.slice(0, cut); }
			sen = sen.slice(cut).trim();
		}
		if ((cur + ' ' + sen).trim().length <= MAX) cur = (cur + ' ' + sen).trim();
		else { pushCur(); cur = sen; }
	});
	pushCur();
	return out.length ? out : [text];
}
// Tra ve Promise<boolean>: true = dang phat, false -> fallback browser
function seSpeak(text, mySeq) {
	return new Promise(function (resolve) {
		let settled = false;
		const finish = function (v) { if (!settled) { settled = true; resolve(v); } };
		try {
			if (typeof fetch === 'undefined') { finish(false); return; }
		} catch (e) { finish(false); return; }
		const guard = setTimeout(function () { finish(false); }, 25000);
		const done = function (v) { try { clearTimeout(guard); } catch (e) {} finish(v); };
		try { window.__seFail = ''; } catch (e) {}
		const chunks = seChunk(text.length > 3000 ? text.slice(0, 3000) : text);
		const all = [];
		let i = 0;
		const next = function () {
			if (mySeq !== gSeq) { done(false); return; }
			if (i >= chunks.length) {
				if (!all.length) { try { window.__seFail = 'empty'; } catch (e) {} done(false); return; }
				edgePlayBlob(all, mySeq, done, 'se');
				return;
			}
			const url = 'https://api.streamelements.com/kappa/v2/speech?voice='
				+ encodeURIComponent(seVoice()) + '&text=' + encodeURIComponent(chunks[i++]);
			fetch(url).then(function (resp) {
				if (mySeq !== gSeq) { done(false); return null; }
				if (!resp || !resp.ok) throw new Error('se http ' + (resp && resp.status));
				return resp.arrayBuffer();
			}).then(function (buf) {
				if (!buf) return;
				if (mySeq !== gSeq) { done(false); return; }
				if (buf.byteLength) all.push(buf);
				next();
			}, function () { try { window.__seFail = 'network'; } catch (e) {} done(false); });
		};
		next();
	});
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
	if (!force && text === gLastText) {
		let playing = false;
		try {
			playing = (typeof speechSynthesis !== 'undefined' && speechSynthesis.speaking) || !!edgeAudio || !!edgeWS;
		} catch (e) {}
		if (playing) {
			Text2SpeechStop();
			return;
		}
	}
	Text2SpeechStop();
	gLastText = text;
	ttsSetBusy(true); // dung co ngay tu luc bam -> click spam ke tiep bi chan

	if (Text2SpeechSource() === 'edge') {
		if (Date.now() < EDGE_DOWN_UNTIL) {
			Text2SpeechBrowser(text, force);
			return;
		}
		const mySeq = ++gSeq;
		// Thu tu: proxy local (local.bat) -> WSS truc tiep -> browser
		edgeViaProxy(text, mySeq).then(function (okProxy) {
			if (mySeq !== gSeq) return;
			if (okProxy) return; // dang phat Edge qua proxy
			edgeSpeak(text, mySeq).then(function (ok) {
				if (mySeq !== gSeq) return;
				if (ok) return; // dang phat Edge direct
				EDGE_DOWN_UNTIL = Date.now() + 2 * 60 * 1000; // nghi Edge 2 phut
				try {
					console.warn('[TTS] Edge loi/block (Chrome thuong bi 403 do thieu header Edg/Origin).'
						+ ' De nghe giong Edge: chay local.bat (python edge_proxy.py) hoac mo web bang Microsoft Edge.'
						+ ' Tam dung browser.');
				} catch (e) {}
				Text2SpeechBrowser(text, force);
			});
		});
		return;
	}
	if (Text2SpeechSource() === 'se') {
		if (Date.now() < SE_DOWN_UNTIL) {
			Text2SpeechBrowser(text, force);
			return;
		}
		const mySeqSe = ++gSeq;
		seSpeak(text, mySeqSe).then(function (ok) {
			if (mySeqSe !== gSeq) return;
			if (ok) return; // dang phat StreamElements
			SE_DOWN_UNTIL = Date.now() + 2 * 60 * 1000;
			try {
				const st = window.__seFail || 'failed';
				window.__lastTtsEngine = 'browser (se ' + st + ')';
				console.warn('[TTS] StreamElements that bai buoc ' + st + ', dung browser tam.');
			} catch (e) {}
			Text2SpeechBrowser(text, force);
		});
		return;
	}
	Text2SpeechBrowser(text, force);
}

// Bam loa Quiz: moi lan bam la replay tu dau (khong toggle-stop nhu Text2Speech thuong)
function Text2SpeechReplay(word) {
	Text2Speech(word, true);
}
