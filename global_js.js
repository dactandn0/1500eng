const HELPER_FOR_TEST = false
const UNCOUNT_TAG_BEGIN = '<x1x class="_y_z">'
const UNCOUNT_TAG_END = '</x1x>'
const SAME_N_V_TAG_BEGIN = '<y1 class="_y_1z">'
const SAME_N_V_TAG_END = '</y1>'

var Helper_AudioPitchKey = 'AudioPitch';
var Helper_AudioRateKey = 'AudioRate';
var Helper_AdjAudioTimeKey = 'AdjAudioTime';
var Helper_SelectedVoiceIdx = 'SelectedVoiceIdx';
var Helper_Voices
var UtterEnd = true;		// prevent a word from constantly double-click

var kReplaceWords = [
	{ src: 'ms\\.*', desc: 'Ms'},
	{ src: 'mr\\.*', desc: 'Mr'},
	{ src: 'p\\.m\\.*', desc: 'pm'},
	{ src: 'a\\.m\\.*', desc: 'am'},
	{ src: 'mrs\\.*', desc: 'Mrs'},
]

function IsRegexMatch(rg, txt) {
	var mmm = txt.match(rg);
	return mmm && mmm.length > 1
}

function fixDots(txt) {
	//txt = txt.replace(/\.{2,}/gi, "_ _");
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

var kAudioLoopSaveKey = "audioLoop";

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
	<u>u:</u> n = v<br>\
	</small>'
	);

var arrBOTH_COUNT_UNCOUNT = [];
var arrUNCOUNT_NOUNS = [];
var arrNOUN_SAME_VERBS = [];

function Helper_ArrRemoveDup(arr) {
	return arr.filter((item, index) => arr.indexOf(item.toLowerCase()) === index); // remove dup
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
	return arr.includes(ele);
};

function hLightWord(word, arr, graph, tagOpen, tagClose) {
	if (isInArr(word, arr)) {
		var regex = new RegExp(`\\b${word}\\b` , 'g')
		return graph.replace(regex, tagOpen + word + tagClose);
	}
	return graph;
}


function ngClickOnWord(word, graph) {
	if (word.trim().length == 0) return graph // safe
		const tagOpen = '<span ng-click="Idx_n_L_WSp_($event)">'
	if (ValidateWord(word) 
		&& word !=='br'
		&& word !=='hr'
		&& UNCOUNT_TAG_BEGIN.indexOf(word) === -1
		&& tagOpen.indexOf(word) === -1
		) 
	{
		const tagClose = '</span>'
		var regex = new RegExp(`\\b${word}\\b` , 'g')
		return graph.replace(regex, tagOpen + word + tagClose);
	} else // console.log("ngClickOnWord ignore: " + word)
	return graph
}

function processStory (story, isAlert = true) {
	if (!story || !story.en || story.en.trim().length == 0) return story;
	
	story.enShow = story.en;
	let enShow = story.enShow
	let viShow = story.vi
	enShow = doReplaceWords(enShow)
	enShow = fixDots(enShow)
	if (viShow) viShow= fixDots(viShow)

	if (story.voca) {
		var vocas = story.voca.split(',');
		for (var i = 0; i < vocas.length; i++) {
			voca = vocas[i].trim();
			if (voca.length===0) continue;
			voca = voca.replace(/\[.*\]/g, '').trim();
			var regex = new RegExp(`\\b${voca}\\b` , 'g')
			if (voca!='event')
				enShow = enShow.replace(regex, '<b>' + voca + '</b>');
		}
	}

	var words = story.en.match(/\b(\w+)('ll)*\b/g);
	var dones = []
	for (var i = 0; i < words.length; i++) {
		var word = words[i];
		if (!isInArr(word, dones)) {
			enShow = hLightWord(word, arrUNCOUNT_NOUNS, enShow , UNCOUNT_TAG_BEGIN, UNCOUNT_TAG_END );
			enShow = hLightWord(word, arrNOUN_SAME_VERBS, enShow , SAME_N_V_TAG_BEGIN, SAME_N_V_TAG_END );
			enShow = ngClickOnWord(word, enShow);
			dones.push(word);
		}
	}


	var kBrTag = '<br>'
	var rgSen = /.*?((\.*\s*<br>)|(\!*\s*<br>)|(\?*\s*<br>)|('*\s*<br>)|("*\s*<br>)|[\.]+|\!|\?'")/gi
	var enAndVi = ''
	var viii = ''
	var sentencesEn = enShow.match(rgSen);
	var sentencesVi = '';
	if (viShow) sentencesVi = viShow.match(rgSen);
	if (sentencesEn.length === sentencesVi.length) {
	
	} else if (isAlert) alert('sentencesEn.length !== sentencesVi.length')
		for (var i = 0; i < sentencesEn.length; i++) {
			var enSen = sentencesEn[i]
			var viSen = sentencesVi[i]
			if (viSen && viSen.trim()!=='<br>') {
				var rep = viSen.trim().replace(/^\w*(B|G|W|M)*\d*\s*\:+\s*/gi, '')
				if (rep.length > 1 ) {
					viii = '(' + rep + ')'
					if (viii.indexOf(kBrTag)!==-1) {
						viii = viii.replace(kBrTag,'');
						viii += kBrTag
					}
				}
				if (enSen.indexOf(kBrTag)!==-1) {
					enSen = enSen.replace(kBrTag,'');
				}
				enAndVi += enSen + ' <i class="text-primary">' + viii  + '</i>'
			}
		}
	story.viShow = enAndVi
	story.enShow = enShow

	return story;
}

function removeVietnameseTones(str) {
	str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
	str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
	str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
	str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
	str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
	str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
	str = str.replace(/đ/g,"d");
	str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
	str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
	str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
	str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
	str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
	str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
	str = str.replace(/Đ/g, "D");
	    // Some system encode vietnamese combining accent as individual utf-8 characters
	    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
	    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
	    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
	    // Remove extra spaces
	    // Bỏ các khoảng trắng liền nhau
	    str = str.replace(/ + /g," ");
	    str = str.trim();
	    // Remove punctuations
	    // Bỏ dấu câu, kí tự đặc biệt
	    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
	    return str;
	}


	function getLastWord(splitChar, string) {
		var str = string.split(splitChar);
		return str[str.length - 1];
	}

	function deleteLastWord(splitChar, string) {
		if (!string.includes(splitChar)) return string;
		var lastW = getLastWord(splitChar, string)
		return string.replace(splitChar + lastW, "");
	}

	function ValidateWord(word, minL = 2) 
	{	
	var reg = /^[^\d]$/;   // length = 1 but not digit
	if (word.match(reg)) return false
	var exceptTag = 'bui'   // allow <B><u><i> in story.en Data
	var result = true;
	word = word.trim().toLowerCase();

	if (exceptTag.indexOf(word) !== -1) return false;
	if (!isAsciiString(word)) result = false;

	let arr = ['<br>','</br>','<b>','</b>', '/','(',')', '[',']','<u>','</u>'];
	for (var i = 0; i < arr.length; i++) {
		var bList = arr[i];
		if (word.indexOf(bList) >= 0) {
			result = false;
		}
	}
	return result;
}

// for word3000.js
function _scrollIntoView(idx) {
	var ele = document.getElementsByClassName("scroll")[idx];
	setTimeout(function () {
		if (ele)
			ele.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
	}, 100);
}

preprocess();



window.onscroll = function() {scrollFunction()};
function scrollFunction() {
	let mybutton = document.getElementById("btn_back_to_top");
	
	if (!mybutton) return;
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		mybutton.style.display = "block";
	} else {
		mybutton.style.display = "none";
	}
}


function shuffle(array) {
	return array.sort(function() {
		return .5 - Math.random();
	});
}

function isAsciiString(text) {
	var tiengViet = ['giao','vui','trong', 'bao', 'kinh', 'tinh']
	var r = /^[\x00-\x7F]+$/g.test(text) && !isInArr(r, tiengViet);
	return r;
} 

function Helper_GetVocaFromWordFull(wordFull) {
	wordFull = Helper_RemoveHTMLtag(wordFull);
	var splitW = wordFull.trim().split(" ");
	var result = "";
	for (var i = 0; i < splitW.length; i++) {
		var part = splitW[i].trim();
		if (ValidateWord(part)) 
			result = result + " " + part;
		else break;
	}
	return result.trim();
}

// arrow up scroll
topFunction = function() {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}


function ArrayRemove(arr, eleName) {
	return arr.filter((item) => {
		return item !== eleName
	});
}

function Helper_RemoveHTMLtag(input) {
	var rrr = input.replace(/(<([^>]+)>)/ig, '')
	return	rrr;
}

Helper_Speak = function (event, txt) {
	var target = Helper_GetVocaFromWordFull(txt);
	Text2Speech(target)
}

Helper_ngClickWordSpeak = function (event) {
	var target = event.target.innerText;
	Text2Speech(target)
}

function Text2Speech(word) {
	if (!UtterEnd) return;
	speechSynthesis.getVoices();
	const utter = new SpeechSynthesisUtterance(word);
	utter.text = word;
	utter.pitch  = Helper_loadFloat(Helper_AudioPitchKey, 1);
	utter.rate  = Helper_loadFloat(Helper_AudioRateKey, 1);
	utter.volume  = 1;
	utter.lang='en-US';
	var selectedVoice = Helper_loadInt(Helper_SelectedVoiceIdx, -1)
	if (selectedVoice !== -1)
	utter.voice= Helper_Voices[selectedVoice];

	utter.addEventListener('end', (evt) => {
		const { charIndex, utterance } = evt
		UtterEnd = true;
	})

	speechSynthesis.speak(utter);
	UtterEnd = false;
}

Helper_SliceHalfString = function (str) {
	var partOne = ""
	var partTwo = ""

	var matchTags = str.match(/<.+>/);
	if (matchTags && matchTags.length > 0) {
		partOne = matchTags[0]
		partTwo = str.substr(partOne.length)
		return { p1:partOne, p2:partTwo, full:str }
	}

	var arr = str.split(" ");
	if (arr.length===1) {
		partOne = str;
		partTwo = ' /unknown/'
	}
	else {
		var mm = Math.floor(arr.length/2)
		for (var i = 0; i < mm; i++) 
		{
			partOne += arr[i] + " "
		}
		partTwo = str.substr(partOne.length)
	}

	return { p1:partOne, p2:partTwo, full:str }
}


function setSpeech() {
    return new Promise(
        function (resolve, reject) {
            let synth = window.speechSynthesis;
            let id;

            id = setInterval(() => {
                if (synth.getVoices().length !== 0) {
                    resolve(synth.getVoices());
                    clearInterval(id);
                }
            }, 10);
        }
    )
}

let s = setSpeech();
s.then((voices) => Helper_Voices = voices); 