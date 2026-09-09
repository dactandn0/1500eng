// Puter.js TTS (neural, free) + speechSynthesis fallback
// Giữ nguyên tên hàm Text2Speech(word) nên không cần sửa chỗ gọi.

const utter = new SpeechSynthesisUtterance();

let puterAudio = null;
let puterLastText = '';
let puterSeq = 0; // tang moi lan goi -> request cu (chua ve) bi huy, chi cau moi nhat duoc play

// Co BUSY + callback play-done: chong spam click nut loa.
// Dang phat (hoac dang cho request) -> Text2SpeechIsBusy() === true.
// Phat xong (ended) / loi / stop -> tu clear ve false.
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
	ttsSetBusy(false);
	if (puterAudio) {
		try { puterAudio.pause(); } catch (e) {}
		try { puterAudio.currentTime = 0; } catch (e) {}
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
	// helper này load sau file này nên phải guard
	try {
		if (typeof Helper_RemoveHTMLtag === 'function') s = Helper_RemoveHTMLtag(s);
		else s = s.replace(/(<([^>]+)>)/ig, '');
	} catch (e) {
		s = s.replace(/(<([^>]+)>)/ig, '');
	}
	s = s.replace(/&/g, ' and ').replace(/\s+/g, ' ').trim();
	return s;
}

function Text2SpeechVoice() {
	try {
		if (typeof Helper_loadStr === 'function' && typeof Helper_PuterVoiceKey !== 'undefined') {
			const v = Helper_loadStr(Helper_PuterVoiceKey, 'Joanna');
			if (v) return v;
		}
	} catch (e) {}
	return 'Joanna';
}
function Text2SpeechBrowser(word, force) {
	try {
		if (typeof speechSynthesis === 'undefined') { ttsSetBusy(false); return; }
		if (speechSynthesis.speaking) {
			// go handlers cu truoc khi cancel de event roi khong clear nham co moi
			try { utter.onend = null; utter.onerror = null; } catch (e) {}
			speechSynthesis.cancel();
			if (!force && word == utter.text) { ttsSetBusy(false); return; }
		}
		utter.text = word;
		// callback play-done: phat xong / loi -> ha co
		utter.onend = function () { ttsSetBusy(false); };
		utter.onerror = function () { ttsSetBusy(false); };
		try { utter.pitch = Helper_loadFloat(Helper_AudioPitchKey, 1); } catch (e) { utter.pitch = 1; }
		try { utter.rate = Helper_loadFloat(Helper_AudioRateKey, 1); } catch (e) { utter.rate = 1; }
		utter.volume = 1;
		utter.lang = 'en-US';
		ttsSetBusy(true);
		speechSynthesis.speak(utter);
	} catch (e) { ttsSetBusy(false); }
}

function Text2Speech(word, force) {
	const text = Text2SpeechClean(word);
	if (!text) return;

	// Click lai cung 1 tu dang doc -> dung (giu hanh vi cu).
	// force=true (nut loa Quiz): bam lai la replay tu dau, khong toggle-stop.
	if (!force && text === puterLastText && puterAudio) {
		Text2SpeechStop();
		puterLastText = '';
		return;
	}
	Text2SpeechStop();
	puterLastText = text;
	const mySeq = ++puterSeq;
	ttsSetBusy(true); // dung co ngay tu luc bam -> click spam ke tiep bi chan

	// Chua load duoc puter -> fallback ngay
	if (typeof puter === 'undefined' || !puter.ai || !puter.ai.txt2speech) {
		Text2SpeechBrowser(text, force);
		return;
	}

	// Puter giới hạn ~3000 ký tự / request -> cắt để khỏi lỗi
	const chunk = text.length > 2800 ? text.slice(0, 2800) : text;

	let rate = 1;
	try { rate = Helper_loadFloat(Helper_AudioRateKey, 1) || 1; } catch (e) {}
	rate = Math.min(1.5, Math.max(0.7, rate));

	puter.ai.txt2speech(chunk, {
		voice: Text2SpeechVoice(),
		engine: 'neural',
		language: 'en-US'
	}).then((audio) => {
		// Co request moi hon trong luc cho mang -> bo audio cu (tranh 2 tieng chong nhau)
		if (mySeq !== puterSeq || puterLastText !== text) {
			try { audio.pause(); } catch (e) {}
			return;
		}
		puterAudio = audio;
		try { audio.playbackRate = rate; } catch (e) {}
		try {
			// callback play-done: chi ha co khi dung la audio dang phat
			// (audio cu bi thay the thi ke moi giu co)
			audio.addEventListener('ended', () => {
				if (puterAudio === audio) { puterAudio = null; ttsSetBusy(false); }
			});
			audio.addEventListener('error', () => {
				if (puterAudio === audio) { puterAudio = null; ttsSetBusy(false); }
			});
		} catch (e) {}
		audio.play().catch(() => {
			if (mySeq !== puterSeq) return;
			puterAudio = null;
			Text2SpeechBrowser(text, force);
		});
	}).catch(() => {
		// Rot mang / popup bi chan / het quota -> doc tam bang giong may
		if (mySeq !== puterSeq) return;
		puterAudio = null;
		ttsSetBusy(false);
		Text2SpeechBrowser(text, force);
	});
}

// Bam loa Quiz: moi lan bam la replay tu dau (khong toggle-stop nhu Text2Speech thuong)
function Text2SpeechReplay(word) {
	Text2Speech(word, true);
}
