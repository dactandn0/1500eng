// Puter.js TTS (neural, free) + speechSynthesis fallback
// Giữ nguyên tên hàm Text2Speech(word) nên không cần sửa chỗ gọi.

const utter = new SpeechSynthesisUtterance();

let puterAudio = null;
let puterLastText = '';

function Text2SpeechStop() {
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
function Text2SpeechBrowser(word) {
	try {
		if (typeof speechSynthesis === 'undefined') return;
		if (speechSynthesis.speaking) {
			speechSynthesis.cancel();
			if (word == utter.text) return;
		}
		utter.text = word;
		try { utter.pitch = Helper_loadFloat(Helper_AudioPitchKey, 1); } catch (e) { utter.pitch = 1; }
		try { utter.rate = Helper_loadFloat(Helper_AudioRateKey, 1); } catch (e) { utter.rate = 1; }
		utter.volume = 1;
		utter.lang = 'en-US';
		speechSynthesis.speak(utter);
	} catch (e) {}
}

function Text2Speech(word) {
	const text = Text2SpeechClean(word);
	if (!text) return;

	// Click lại cùng 1 từ đang đọc -> dừng (giữ hành vi cũ)
	if (text === puterLastText && puterAudio) {
		Text2SpeechStop();
		puterLastText = '';
		return;
	}
	Text2SpeechStop();
	puterLastText = text;

	// Chưa load được puter -> fallback ngay
	if (typeof puter === 'undefined' || !puter.ai || !puter.ai.txt2speech) {
		Text2SpeechBrowser(text);
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
		// Người dùng đã bấm từ khác trong lúc chờ mạng -> bỏ audio cũ
		if (puterLastText !== text) {
			try { audio.pause(); } catch (e) {}
			return;
		}
		puterAudio = audio;
		try { audio.playbackRate = rate; } catch (e) {}
		try {
			audio.addEventListener('ended', () => {
				if (puterAudio === audio) puterAudio = null;
			});
		} catch (e) {}
		audio.play().catch(() => {
			puterAudio = null;
			Text2SpeechBrowser(text);
		});
	}).catch(() => {
		// Rớt mạng / popup bị chặn / hết quota -> đọc tạm bằng giọng máy
		puterAudio = null;
		Text2SpeechBrowser(text);
	});
}
