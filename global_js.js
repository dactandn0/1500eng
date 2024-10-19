const HELPER_FOR_TEST = false
const UNCOUNT_TAG_BEGIN = '<x1x class="_y_z">'
const UNCOUNT_TAG_END = '</x1x>'
const SAME_N_V_TAG_BEGIN = '<y1 class="_y_1z">'
const SAME_N_V_TAG_END = '</y1>'

var Helper_AudioSpeed = 0.7;
var UtterEnd = true;

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

function longStrToArray(long_txt, deter = ',') {
	var arr  = long_txt.replace(/\s*\,\s*/g, ",");
	arr = arr.split(deter);
	arr = arr.filter((item, index) => arr.indexOf(item) === index); // remove dup
	return arr;
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

function processStory (story) {
	if (!story || !story.en || story.en.trim().length == 0) return story;
	
	story.enShow = story.en;
	story.viShow = story.vi;

	if (story.voca) {
		var vocas = story.voca.split(',');
		for (var i = 0; i < vocas.length; i++) {
			voca = vocas[i].trim();
			if (voca.length===0) continue;
			voca = voca.replace(/\[.*\]/g, '').trim();
			var regex = new RegExp(`\\b${voca}\\b` , 'g')
			if (voca!='event')
			story.enShow = story.enShow.replace(regex, '<b>' + voca + '</b>');
		}
	}

	var words = story.en.match(/\b(\w+)('ll)*\b/g);
	var dones = []
	for (let i = 0; i < words.length; i++) {

	  	var word = words[i];
		if (!isInArr(word, dones)) {
			story.enShow = hLightWord(word, arrUNCOUNT_NOUNS, story.enShow , UNCOUNT_TAG_BEGIN, UNCOUNT_TAG_END );
			story.enShow = hLightWord(word, arrNOUN_SAME_VERBS, story.enShow , SAME_N_V_TAG_BEGIN, SAME_N_V_TAG_END );
			story.enShow = ngClickOnWord(word, story.enShow);
			dones.push(word);
		}
	}

	
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
	var result = true;
	word = word.trim().toLowerCase();
	if (word.length <= 1) return false;
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
	return input.replace(/(<([^>]+)>)/ig, '')
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
	 utter.rate  = Helper_AudioSpeed;
	 utter.lang='en-US';

	 utter.addEventListener('end', (evt) => {
			const { charIndex, utterance } = evt
				UtterEnd = true;
		})

	 speechSynthesis.speak(utter);
	 UtterEnd = false;
}

Helper_SliceHalfString = function (str) {
	var arr = str.split(" ");
	var partOne = ""
	var partTwo = ""

	if (arr.length===1) {
		partOne = str;
		partTwo = ' /unknown/'
	}
	else {
		var mm = Math.floor(arr.length/2)
		for (var i = 0; i < mm; i++) {
			partOne += arr[i] + " "
		}
		partTwo = str.substr(partOne.length)
	}

	return { p1:partOne, p2:partTwo, full:str }
}
