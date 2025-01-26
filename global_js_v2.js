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

function ValidateWord(word, minL = 2) {	
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
	var r = /(?:[\u0000-\u007F]+|[\u0370-\u03FF]+)/g.test(text) && !isInArr(text, tiengViet);
	return r;
} 

function Helper_GetVocaFromWordFull(wordFull) {
	wordFull = Helper_RemoveHTMLtag(wordFull);

	//get verb-ed, Vpp
	if( wordFull.indexOf(kVERB_3_COL) !== -1 ) 
	{
		return wordFull.split(kVERB_3_COL)[0];
	}

	var splitW = wordFull.trim().split(" ");

	var result = "";
	for (var i = 0; i < splitW.length; i++) {
		var part = splitW[i].trim();
		if (ValidateWord(part)) 
			result +=  " " + part;
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
	// var selectedVoice = Helper_loadInt(Helper_SelectedVoiceIdx, -1)
	// if (selectedVoice !== -1)
	// utter.voice= Helper_Voices[selectedVoice];

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

function makeVocaEbook(rtScrope, ...args)
{
	rtScrope.vocaEbook = []
	for (var i = 0; i < args.length; i++)
	{
		var book = args[i];
		for (var k = 0; k < book.length; k++) 
		{
			var lesson = book[k]
			if (lesson.voca && lesson.voca.trim().length > 0)
			{
				var vocas = lesson.voca.split(',');
				var color = "blue";
				if (k % 2=== 0) color = 'green'
				var jsonEle = {
					unit: lesson.unit ? lesson.unit : '#',
					title:lesson.title ? lesson.title : '#',
					color: color,
					vocas: vocas
				}
				rtScrope.vocaEbook.push(jsonEle)
			}
		}
	}
//	console.log('makeVocaEbook::: ' + rtScrope.vocaEbook)
	
}