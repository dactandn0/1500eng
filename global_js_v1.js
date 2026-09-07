const kRgexSen = /.*?((\.*\s*(<br>|<hr>))|(\!*\s*(<br>|<hr>))|(\?*\s*(<br>|<hr>))|('*\s*(<br>|<hr>))|("*\s*(<br>|<hr>))|(\d\.+\d+.+[\.\!\?])|[\.]+|[\!\?])/gi

const kAudioLoopSaveKey = "audioLoop";

const UNCOUNT_TAG_BEGIN = '<x1x class="_y_z">'
const UNCOUNT_TAG_END = '</x1x>'
const SAME_N_V_TAG_BEGIN = '<y1 class="_y_1z">'
const SAME_N_V_TAG_END = '</y1>'
const PHRA_VERB_TAG_BEGIN = '<z1a class="_y_2z">'
const PHRA_VERB_TAG_END = '</z1a>'
const SPECIAL_WORDS_HL_TAG_BEGIN = '<advHL class="advHL_123">'
const SPECIAL_WORDS_HL_TAG_END = '</advHL>'

const NOTED_WORD_TAG_BEGIN = '<NOTED_WORD_HL class="_noted_word_hl">'
const NOTED_WORD_TAG_END = '</NOTED_WORD_HL>'

const kNgClickTagName = 'kkk'
const kNgClickTagOpen = '<' + kNgClickTagName + ' ng-click="Idx_n_L_WSp_($event)">';
const kNgClickTagClose = '</' + kNgClickTagName + '>';

const Helper_SelectedVoiceIdx = 'SelectedVoiceIdx';
let Helper_Voices

const rgConversatinal = /^\w*(B|G|W|M)*\d*\s*\:+\s*/gi

const kReplaceWords = [{
	src: 'ms\\.*',
	desc: 'Ms'
}, {
	src: 'mr\\.*',
	desc: 'Mr'
}, {
	src: 'p\\.m\\.*',
	desc: 'pm'
}, {
	src: 'a\\.m\\.*',
	desc: 'am'
}, {
	src: 'mrs\\.*',
	desc: 'Mrs'
}, ]

function IsRegexMatch(rg, txt) {
	var matches = getRegexMatch(rg, txt)
	return matches && matches.length > 0
}

function getRegexMatch(rg, txt) {
	return txt.match(rg);
}

function fixDots(txt) {
	txt = txt.trim()
	// 1. 2. -> 1) 2)
	const matches = txt.match(/^\b\d+\./gi);
	if (matches) {
		for (let i = 0; i < matches.length; i++) {
			const src = matches[i]
			const desc = src.replace('.', ')');
			txt = txt.replaceAll(src, desc);
		}
	}

	txt = txt.replace(".'", "'.");

	const rg = /\d+[\.]\d+/g;
	const mat = txt.match(rg)
	if (mat) {
		for (let i = 0; i < mat.length; i++) {
			const num = mat[i]
			const numRe = num.replace(/[\.]/gi, ',')
			txt = txt.replace(num, numRe)
		}

	}
	return txt.replaceAll("v.v", "vv");
}

function doReplaceWords(txt) {
	let rrr = txt
	for (let i = 0; i < kReplaceWords.length; i++) {
		const data = kReplaceWords[i]
		const regex = new RegExp(`\\b(${data.src})`, 'gi')
		rrr = rrr.replace(regex, data.desc);
	}
	return rrr;
}


function MYLOG(msg) {
	console.log(msg);
}

window.RANGE = function(min, max, step) {
	step = step || 1;
	const input = [];
	for (let i = min; i <= max; i += step) {
		input.push(i);
	}
	return input;
};

document.write('<small class="note">\
	' + UNCOUNT_TAG_BEGIN + 'uncount.n' + UNCOUNT_TAG_END + ' <br>\
	' + PHRA_VERB_TAG_BEGIN + 'phraVerb' + PHRA_VERB_TAG_END + ' <br>\
	' + SPECIAL_WORDS_HL_TAG_BEGIN + '(Special)' + SPECIAL_WORDS_HL_TAG_END + ' <br>\
	' + SAME_N_V_TAG_BEGIN + 'n = v' + SAME_N_V_TAG_END + ' <br>\
	</small>');

let arrBOTH_COUNT_UNCOUNT = [];
let arrUNCOUNT_NOUNS = [];
let arrNOUN_SAME_VERBS = [];

function Helper_ArrRemoveDup(arr) {
	if (!arr) return arr;
	const result = [];
	for (let i = 0; i < arr.length; i++) {
		const ele = arr[i] // .toLowerCase()
		if (result.indexOf(ele) == -1) {
			result.push(ele)
		}
	}
	return result
}


function titleCase(val) {
	return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function longStrToArray(long_txt, deter = ',') {
	let arr = long_txt.replace(/\s*\,\s*/g, ",");
	arr = arr.split(deter);
	return Helper_ArrRemoveDup(arr)
};

function preprocess() {
	arrUNCOUNT_NOUNS = longStrToArray(UNCOUNT_NOUNS);
	arrNOUN_SAME_VERBS = longStrToArray(NOUN_SAME_VERBS);
};

function isInArr(ele, arr) {
	return arr && arr.includes(ele);
};

function hLightWord(word, arr, graph, tagOpen, tagClose) {
	if (isInArr(word, arr)) {
		const tCase = titleCase(word)
		let regex = new RegExp(`\\b(${word})\\b`, 'g')
		graph = graph.replace(regex, tagOpen + word + tagClose);
		regex = new RegExp(`\\b(${tCase})\\b`, 'g')
		graph = graph.replace(regex, tagOpen + tCase + tagClose);
		return graph;
	}
	return graph;
}

function ngClickOnWord(word, graph) {
	if (word.trim().length == 0) return graph // safe
	if (ValidateWord(word) &&
		word !== 'br' &&
		word !== 'hr' &&
		word !== 'b' &&
		UNCOUNT_TAG_BEGIN.indexOf(word) === -1 &&
		kNgClickTagOpen.indexOf(word) === -1
	) {
		const regex = new RegExp(`\\b${word}\\b`, 'g')
		return graph.replace(regex, kNgClickTagOpen + word + kNgClickTagClose);
	} else //  console.log("ngClickOnWord ignore: " + word)
		return graph
}


function processStory(story, isAlert = true) {
	if (!story) return story;

	const isBlank = !story.en || story.en.trim().length == 0;

	if (isBlank) story.enShow = "Blank"
	else story.enShow = story.en;

	let enShow = story.enShow
	const viShow = !story.vi ? "" : story.vi.trim()

	enShow = doReplaceWords(enShow)
	//	enShow = fixDots(enShow)

	const bHasVi = viShow.length > 0
	//	if (bHasVi) viShow= fixDots(viShow)

	const foundWords = IRR_ExtractWords(story)

	const words = foundWords.words
	const phraVerbs = foundWords.phraVerbs || []
	const specialWords = foundWords.specialWords || []

	if (story.voca) {
		const vocas = story.voca.split(',');
		for (let i = 0; i < vocas.length; i++) {
			let voca = vocas[i].trim();

			// dont bold specical_words
			const idx = specialWords.findIndex(ele => ele.includes(voca) == true)
			if (idx >= 0) continue;

			voca = voca.replace(/\[.*\]/g, '').trim();
			const regex = new RegExp(`\\b${voca}\\b`, 'g')
			if (voca != 'event')
				enShow = enShow.replace(regex, '<b>' + voca + '</b>');
		}
	}


	const dones = []

	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		if (!isInArr(word, dones)) {
			enShow = hLightWord(word, phraVerbs, enShow, PHRA_VERB_TAG_BEGIN, PHRA_VERB_TAG_END);
			enShow = hLightWord(word, arrUNCOUNT_NOUNS, enShow, UNCOUNT_TAG_BEGIN, UNCOUNT_TAG_END);
			enShow = hLightWord(word, arrNOUN_SAME_VERBS, enShow, SAME_N_V_TAG_BEGIN, SAME_N_V_TAG_END);
			enShow = ngClickOnWord(word, enShow);
			dones.push(word);
		}
	}
	for (let i = 0; i < specialWords.length; i++) {
		const word = specialWords[i]
		enShow = hLightWord(word, specialWords, enShow, SPECIAL_WORDS_HL_TAG_BEGIN, SPECIAL_WORDS_HL_TAG_END);
		enShow = ngClickOnWord(word, enShow);
	}
	let rr = ''
	const sentencesEn = enShow.match(kRgexSen);
	if (sentencesEn) {
		for (let i = 0; i < sentencesEn.length; i++) {
			const enSen = sentencesEn[i]
			rr += '<zui>' + enSen + '</zui>'
		}
		enShow = rr
	}

	let enAndVi = ''
	if (!isBlank && bHasVi) {
		const kBrTag = '<br>'

		let viii = ''
		let sentencesVi = '';

		if (viShow) sentencesVi = viShow.match(kRgexSen);
		if (sentencesEn) {
			if (sentencesEn.length === sentencesVi.length) {} else if (isAlert) alert('sentencesEn.length !== sentencesVi.length')

			for (let i = 0; i < sentencesEn.length; i++) {
				let enSen = sentencesEn[i]
				const viSen = sentencesVi[i]
				if (viSen) {
					let rep = viSen.trim().replace(rgConversatinal, '')
					rep = rep.replace(/<\/*(b>)/, ''); // don't bold text in Vietnamese
					viii = '(' + rep + ')'
					if (viii.indexOf(kBrTag) !== -1) {
						viii = viii.replace(kBrTag, '');
						viii += kBrTag
					}
					if (viii.indexOf('()') !== -1) viii = viii.replace('()', '')
					if (viii.indexOf('(<hr>)') !== -1) viii = ''
					if (enSen.indexOf(kBrTag) !== -1) {
						enSen = enSen.replace(kBrTag, '');
					}
					enAndVi += enSen + ' <i class="text-primary">' + viii + '</i>'
				} // viSen
			} // for
		} // sentencesEn


	} // end (bHasVi)
	else enAndVi = enShow

	story.viShow = enAndVi
	story.enShow = enShow

	// show title con acc_click
	const json = getFullTile(story)
	story.fTitle = json.fTitle

	const images = story.images
	if (images) {
		const answerImages = []
		for (let i = 0; i < images.length; i++) {
			const image = images[i].replace('-min', '')
			const answerImage = image + '_ans-min'
			answerImages.push(answerImage)
		}
		story.ans_images = answerImages
	}
	return story;
}


Helper_AudioLoop = function(scope, rootScope) {
	if (!rootScope) {
		alert('Helper_AudioLoop :: rootScope = undefined!')
		return;
	}
	let nextStoryIdx = scope.storyIdx;
	const num = scope.stories.length;

	const loopRadio = Helper_loadAudioLoop();
	if (loopRadio !== 1) // jump when audio done
	{
		rootScope.audio_repeatCur += 1
		if (rootScope.audio_repeatCur >= rootScope.audio_repeatNum) {
			rootScope.audio_repeatCur = 0;
		}
	}
	if (loopRadio === 0) // play random
	{
		nextStoryIdx = Math.floor(Math.random() * num);
	}
	if (loopRadio === 2) // play next
	{
		nextStoryIdx += 1;
		if (nextStoryIdx > num - 1) {
			nextStoryIdx = 0
		};
	}
	if (loopRadio !== 1 && rootScope.audio_repeatCur === 0) // jump when audio done
	{
		scope.storyIdx = nextStoryIdx;
		scope.fetchStory(scope.storyIdx, true);
	}
	scope.$broadcast('child_playFullSound')
}

Helper_FetchStory = function(idx, scope, rootScope, keySaveDb, isAlert = true) {
	rootScope.audio_repeatCur = 0;

	scope.$broadcast("child_stopSound");

	if (idx > scope.stories.length - 1) {
		idx = 0
	};
	scope.storyIdx = idx;
	scope.story = scope.stories[idx];

	if (scope.createAudioSrc) rootScope.audioSrc = scope.createAudioSrc();

	// save DB
	Helper_saveDB(keySaveDb, idx);
	if (!scope.story) {
		MYLOG('Dont have Unit');
		return;
	}

	const story = scope.story;
	rootScope.storyHasVi = story.vi && story.vi.trim().length > 0;
	scope.story = processStory(story, isAlert);
}

function IsIgnoreVocaBold(boldWord, hightlightWord) {
	boldWord = boldWord.trim()
	if (boldWord.length == 0) return true

	let rrr = false;

	const phraVerbArr = hightlightWord.phraVerbs
	const specialWordArr = hightlightWord.specialWords

	const parts = boldWord.split(' ')
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i]
		if (
			phraVerbArr.includes(part) ||
			phraVerbArr.includes(boldWord) ||
			specialWordArr.includes(part) ||
			specialWordArr.includes(boldWord)

		) {
			rrr = true;
			break;
		}
	}

	return rrr;
}


function removeStrDigit(input) {
	return input.replace(/\d+/g, '')
}