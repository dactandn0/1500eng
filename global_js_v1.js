var kRgexSen = /.*?((\.*\s*(<br>|<hr>))|(\!*\s*(<br>|<hr>))|(\?*\s*(<br>|<hr>))|('*\s*(<br>|<hr>))|("*\s*(<br>|<hr>))|(\d\.+\d+.+[\.\!\?])|[\.]+|[\!\?])/gi

var kAudioLoopSaveKey = "audioLoop";

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

var kNgClickTagName = 'kkk'
var kNgClickTagOpen = '<' +kNgClickTagName+' ng-click="Idx_n_L_WSp_($event)">';
var kNgClickTagClose = '</'+kNgClickTagName+'>';

var Helper_SelectedVoiceIdx = 'SelectedVoiceIdx';
var Helper_Voices

var kReplaceWords = [
	{ src: 'ms\\.*', desc: 'Ms'},
	{ src: 'mr\\.*', desc: 'Mr'},
	{ src: 'p\\.m\\.*', desc: 'pm'},
	{ src: 'a\\.m\\.*', desc: 'am'},
	{ src: 'mrs\\.*', desc: 'Mrs'},
]

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
	var matches = txt.match(/^\b\d+\./gi);
	if (matches) {
		for (var i = 0; i < matches.length; i++) {
			var src = matches[i]
			var desc  = src.replace('.' , ')');
			txt = txt.replaceAll(src , desc);
		}	
	}

	txt = txt.replace(".'", "'.");
	
	var rg = /\d+[\.]\d+/g;
	var mat = txt.match(rg)
	if (mat) {
		for (var i = 0; i < mat.length; i++) {
			var num = mat[i]
			var numRe = num.replace(/[\.]/gi, ',')
			txt = txt.replace(num, numRe)
		}
		
	}
	return txt.replaceAll("v.v", "vv");
}

function doReplaceWords(txt) {
	var rrr = txt
	for (var i = 0; i < kReplaceWords.length; i++) {
		var data = kReplaceWords[i]
		var regex = new RegExp(`\\b(${data.src})` , 'gi')
		rrr = rrr.replace(regex, data.desc);
	}
	return rrr;
}


function MYLOG(msg) {
	console.log(msg);
}

RANGE = function(min, max, step) {
	step = step || 1;
	var input = [];
	for (var i = min; i <= max; i += step) {
		input.push(i);
	}
	return input;
};

document.write('<small class="note">\
	' + UNCOUNT_TAG_BEGIN + 'uncount.n' + UNCOUNT_TAG_END + ' <br>\
	' + PHRA_VERB_TAG_BEGIN + 'phraVerb' + PHRA_VERB_TAG_END + ' <br>\
	' + SPECIAL_WORDS_HL_TAG_BEGIN + '(Special)' + SPECIAL_WORDS_HL_TAG_END + ' <br>\
	' + SAME_N_V_TAG_BEGIN + 'n = v' + SAME_N_V_TAG_END + ' <br>\
	</small>'
	);

var arrBOTH_COUNT_UNCOUNT = [];
var arrUNCOUNT_NOUNS = [];
var arrNOUN_SAME_VERBS = [];

function Helper_ArrRemoveDup(arr) {
	if (!arr) return arr;
	var result = [];
    for(i=0;i<arr.length;i++){
    	var ele = arr[i] // .toLowerCase()
      if(result.indexOf(ele) == -1)
      {
        result.push(ele)
      }
    }
    return result
}


function titleCase(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function longStrToArray(long_txt, deter = ',') {
	var arr  = long_txt.replace(/\s*\,\s*/g, ",");
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
		var tCase = titleCase(word)
		var regex = new RegExp(`\\b(${word})\\b` , 'g')
		graph =  graph.replace(regex, tagOpen + word + tagClose);
		regex = new RegExp(`\\b(${tCase})\\b` , 'g')
		graph =  graph.replace(regex, tagOpen + tCase + tagClose);
		return graph;
	}
	return graph;
}

function ngClickOnWord(word, graph) {
	if (word.trim().length == 0) return graph // safe
	if (ValidateWord(word) 
		&& word !=='br'
		&& word !=='hr'
		&& word !=='b'
		&& UNCOUNT_TAG_BEGIN.indexOf(word) === -1
		&& kNgClickTagOpen.indexOf(word) === -1
		) 
	{
		regex = new RegExp(`\\b${word}\\b` , 'g')
		return graph.replace(regex, kNgClickTagOpen + word + kNgClickTagClose);
	}  else //  console.log("ngClickOnWord ignore: " + word)
	return graph
}


function processStory (story, isAlert = true) {
	if (!story) return story;

	var isBlank = !story.en || story.en.trim().length == 0;

	if (isBlank)  story.enShow = "Blank"
	else story.enShow = story.en;
	
	var enShow = story.enShow
	var viShow = !story.vi ? "" : story.vi.trim()

	enShow = doReplaceWords(enShow)
//	enShow = fixDots(enShow)

	var bHasVi = viShow.length > 0
//	if (bHasVi) viShow= fixDots(viShow)

	var foundWords = IRR_ExtractWords(story)
	
	if (story.voca) {
		var vocas = story.voca.split(',');
		for (var i = 0; i < vocas.length; i++) {
			voca = vocas[i].trim();

	//		if (IsIgnoreVocaBold(voca, foundWords)) continue;

			voca = voca.replace(/\[.*\]/g, '').trim();
			var regex = new RegExp(`\\b${voca}\\b` , 'g')
			if (voca!='event')
				enShow = enShow.replace(regex, '<b>' + voca + '</b>');
		}
	}

	var words = foundWords.words
	var phraVerbs = foundWords.phraVerbs || []
	var specialWords = foundWords.specialWords || []
	var dones = []
	
	for (var i = 0; i < words.length; i++) 
	{
		var word = words[i];
		if (!isInArr(word, dones)) 
		{
			enShow = hLightWord(word, phraVerbs, enShow , PHRA_VERB_TAG_BEGIN, PHRA_VERB_TAG_END );
			enShow = hLightWord(word, arrUNCOUNT_NOUNS, enShow , UNCOUNT_TAG_BEGIN, UNCOUNT_TAG_END );
			enShow = hLightWord(word, arrNOUN_SAME_VERBS, enShow , SAME_N_V_TAG_BEGIN, SAME_N_V_TAG_END );
		//	enShow = hLightWord(word, notedDBArr, enShow , NOTED_WORD_TAG_BEGIN, NOTED_WORD_TAG_END );
			enShow = ngClickOnWord(word, enShow);
			dones.push(word);
		}
	}
	for (var i = 0; i < specialWords.length; i++) 
	{
		var word = specialWords[i]
		enShow = hLightWord(word, specialWords, enShow , SPECIAL_WORDS_HL_TAG_BEGIN, SPECIAL_WORDS_HL_TAG_END );
		enShow = ngClickOnWord(word, enShow);
	}
	var rr = ''
	var sentencesEn = enShow.match(kRgexSen);
	if (sentencesEn)
	{
		for (var i = 0; i < sentencesEn.length; i++) 
		{
			var enSen = sentencesEn[i]
			rr += '<zui>' + enSen + '</zui>'
		}
		enShow = rr
	}

	var enAndVi = ''
	if (!isBlank && bHasVi) 
	{
		var kBrTag = '<br>'
		
		var viii = ''
		var sentencesVi = '';

		if (viShow) sentencesVi = viShow.match(kRgexSen);
		if (sentencesEn)
		{
			if (sentencesEn.length === sentencesVi.length) 
			{
			} else if (isAlert) alert('sentencesEn.length !== sentencesVi.length')

				for (var i = 0; i < sentencesEn.length; i++) 
				{
					var enSen = sentencesEn[i]
					var viSen = sentencesVi[i]
					if (viSen)
					{
						var rep = viSen.trim().replace(/^\w*(B|G|W|M)*\d*\s*\:+\s*/gi, '')
						{
							rep = rep.replace(/<\/*(b>)/,'');  // don't bold text in Vietnamese
							viii = '(' + rep + ')'
							if (viii.indexOf(kBrTag)!==-1) {
								viii = viii.replace(kBrTag,'');
								viii += kBrTag
							}
						}
						if (viii.indexOf('()')!==-1) viii=viii.replace('()','')
						if (viii.indexOf('(<hr>)')!==-1) viii=''
						if (enSen.indexOf(kBrTag)!==-1) {
							enSen = enSen.replace(kBrTag,'');
						}
						enAndVi += enSen + ' <i class="text-primary">' + viii  + '</i>'
					} // viSen
				} // for
		} // sentencesEn
		

	} // end (bHasVi)
	else enAndVi = enShow
		
	story.viShow = enAndVi
	story.enShow = enShow
	
	// show title con acc_click
	var json = getFullTile(story)
	story.fTitle = json.fTitle
	story.hasNote = json.hasNote

	story.enShow = story.enShow.replace(/Examiner/gi,'<i class="color-anim">Examiner</i>')
	story.enShow = story.enShow.replace(/Candidate/gi,'<i class="color-anim">Candidate</i>')
	story.enShow = story.enShow.replace(/FE\:/gi,'<i class="color-anim">FE:</i>')

	return story;
}


Helper_AudioLoop = function (scope, rootScope) {
	if (!rootScope) 
	{
		alert('Helper_AudioLoop :: rootScope = undefined!')
		return;
	}
	var nextStoryIdx = scope.storyIdx;
	var num = scope.stories.length;

    var loopRadio = Helper_loadAudioLoop();
    if (loopRadio !== 1) // jump when audio done
    {
    	rootScope.audio_repeatCur += 1
    	if (rootScope.audio_repeatCur >= rootScope.audio_repeatNum) 
    	{
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
    	if (nextStoryIdx > num - 1) { nextStoryIdx = 0 }; 
    }
    if (loopRadio !== 1 && rootScope.audio_repeatCur === 0) // jump when audio done
    {
    	scope.storyIdx = nextStoryIdx;
    	scope.fetchStory(scope.storyIdx, true);
    }
    scope.$broadcast('child_playFullSound')  
}

Helper_FetchStory = function(idx, scope, rootScope, keySaveDb, isAlert = true) 
{
	rootScope.audio_repeatCur = 0;

	scope.$broadcast("child_stopSound");

	if (idx > scope.stories.length - 1) { idx = 0 }; 
	scope.storyIdx = idx;
	scope.story = scope.stories[idx];

	if (scope.createAudioSrc) rootScope.audioSrc = scope.createAudioSrc();

	// save DB
	Helper_saveDB(keySaveDb, idx);
	if (!scope.story) {MYLOG('Dont have Unit'); return;}

	var story = scope.story;
	rootScope.storyHasVi = story.vi && story.vi.trim().length > 0;
	scope.story = processStory(story, isAlert);
}

function IsIgnoreVocaBold(boldWord, hightlightWord)
{	
	boldWord = boldWord.trim()
	if (boldWord.length == 0) return true

	var rrr = false;

	var phraVerbArr = hightlightWord.phraVerbs
	var specialWordArr= hightlightWord.specialWords

	var parts = boldWord.split(' ')
	for (var i = 0; i < parts.length; i++) {
		var part = parts[i]
		if (
			phraVerbArr.includes(part) 
		||	phraVerbArr.includes(boldWord) 
		|| specialWordArr.includes(part)
		|| specialWordArr.includes(boldWord)
	
		) 
		{
			rrr = true;
			break;
		}
	}
	
	return rrr;
}


function removeStrDigit(input)
{
	return input.replace(/\d+/g, '')
}