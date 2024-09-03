
function MYLOG(msg) {
//	console.log(msg);
}

var app = angular.module("myApp", ['ngSanitize']);
app.controller("ctrl", function($scope, $timeout) {

var kSTORIES = bridge_cd1;
radioCDChange = function (cd) {
	switch (cd) {
		case 1: kSTORIES = bridge_cd1; break;
		case 2: kSTORIES = bridge_cd2; break;
		case 3: kSTORIES = []; break;
		case 4: kSTORIES = []; break;
	}
	localStorage.setItem("bri_complete_cd", cd);
	$scope.cd = cd;
	MYLOG("localStorage saved CD= " + cd);
}

$scope.cd = 1;
$scope.stories = kSTORIES; //1

$scope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
        input.push(i);
    }
    return input;
};


 $scope.storyIdx = 0;
 $scope.bPlayingFull = false;
 $scope.bPause = false;
 $scope.bShowVi = 0;
 $scope.bHiddenWords = 0;
 $scope.audio;
 $scope.currentTime = 0;

$scope.units = [
	{'title':"", 'num': 1},
];

$scope.resetFlag = function () {
	$scope.bPlayingFull = false;
	$scope.bPause = false;
	$scope.bShowVi = 0;
	$scope.bHiddenWords = 0;
}	

$scope.backSound = function (sec) {
	$scope.audio.currentTime = $scope.audio.currentTime + sec;
}

$scope.resetAudioBtnUI = function()
{
	$scope.bPause=false;
    $scope.bPlayingFull=false;

    var isChkLoopChecked = false;
    if (localStorage.hasOwnProperty("bri_complete_isAudioLoop")) {
		isChkLoopChecked = localStorage.bri_complete_isAudioLoop;
	}
    if (isChkLoopChecked=='true')
    {
    	$scope.playFullSound($scope.storyIdx);
    }

    $scope.$apply();
}

$scope.playFullSound = function (index) {
	if ($scope.bPlayingFull)
	{
		$scope.stopSound();
		$scope.bPause=false;
	}
  	else
  	{
  		$scope.audio = new Audio("cd" + $scope.cd + "/" + $scope.storyIdx + '.mp3');
	    $scope.audio.loop = false;
	    $scope.audio.play();

		$scope.audio.addEventListener("ended", function(){
		   $scope.resetAudioBtnUI();
		});

	    $scope.bPlayingFull = true;
  	}
}

$scope.pauseSound = function () {
	if (!$scope.audio) return;
	$scope.bPause = !$scope.bPause;
	if ($scope.bPause)
    {
    	$scope.audio.pause();
    	$scope.currentTime = $scope.audio.currentTime;
    }
    else
    {
    	$scope.audio.currentTime = $scope.currentTime;
    	$scope.audio.play();
    }
}

$scope.stopSound = function () {
	if (!$scope.audio) return;
	 $scope.audio.pause();
	 $scope.audio.currentTime = 0;
	 $scope.currentTime = 0;
	 $scope.bPlayingFull = false;
};

$scope.fetchStory = function (idx, reset=true) {
	MYLOG('fetchStory');
	// when click 1.2.3..40
	if (reset==true) 
	{
		$scope.resetFlag();
		$scope.stopSound();
	}

	$scope.stories = kSTORIES;
	$scope.storyIdx = idx;
	$scope.story = $scope.stories[idx];

	// save DB
	localStorage.setItem("bri_complete_unit", idx);
	MYLOG("localStorage save unit=" + idx);
	if (!$scope.story || !$scope.story.en) {MYLOG('Dont have Unit'); return;}
	// show to website
	// $scope.story.en|vi ~ origin [not edit]
	$scope.story.enShow = '';
	$scope.story.viShow = '';
	$scope.story.en_hidden_words = '';

	// bold title
	var titleEn = $scope.story.en.split('<br>')[0];
	$scope.story.enShow = $scope.story.en.replace(titleEn, '<b>' + titleEn + '</b>');

	var titleVi = $scope.story.vi.split('<br>')[0];
	$scope.story.viShow = $scope.story.vi.replace(titleVi, '<b>' + titleVi + '</b>');

	//
	$scope.story.en_hidden_words = $scope.story.en;

	var words = $scope.story.en.match(/\b(\w+)\b/g);
	var _wPosArr = [];   // index in Arr
	var kDot = "";
	var kSpace = "";
	for (let i = 0; i < words.length; i++) {
	  	var word = words[i];
	  	if (validateWord(word)) 
	  	{
				var rd = Math.floor(Math.random() * 11);   // integer from 0 to 12
				if (rd % 5 == 0) {
					var _w = kSpace + word + kSpace;
					var idxOf = $scope.story.en.indexOf(_w);
					var obj = {'w': _w, "idx": idxOf}

					_wPosArr.push(obj);
				//	MYLOG(_w);
					
					kDot = kSpace + word.replace(/./g, ".") + kSpace;
				//	MYLOG(kDot);
					var s = $scope.story.en_hidden_words;

					let firstPart = s.substr(0, idxOf);
			    let lastPart = s.substr(idxOf + kDot.length);
			    let newString = firstPart + kDot + lastPart;

					$scope.story.en_hidden_words = newString;
				}
	  	}
	} // for
	titleEn = $scope.story.en_hidden_words.split('<br>')[0];
	$scope.story.en_hidden_words = $scope.story.en_hidden_words.replace(titleEn, '<b>' + titleEn + '</b>');

	if ($scope.story.voca) {
		var vocas = $scope.story.voca.split(',');
		$scope.story.vocaNotes = [];
		for (var i = 0; i < vocas.length; i++) {
			voca = vocas[i].trim();
			var temp = voca;
			if (temp.indexOf("[") >= 0) {
				temp = temp.replace(/\s*\|\s*/g, ", ");
				temp = temp.replace(/\s*\[\s*/g, " : ");
				temp = temp.replace(/\s*\]\s*/g, "");
				$scope.story.vocaNotes.push(temp);
			}
			voca = voca.replace(/\[.*\]/g, '').trim();
			var regex = new RegExp(`\\b${voca}` , 'g')
			$scope.story.enShow = $scope.story.enShow.replace(regex, '<b>' + voca + '</b>');
		}
	}
}

function validateWord(word) 
{	
	word = word.trim();
	if (word.length < 4) return false;
	let arr = ['<br>','<b>','</b>', '!','.',',',"'",'’','unit','there','this','that','those'];
	for (var i = 0; i < arr.length; i++) {
		bList = arr[i];
		if (word.toLowerCase().indexOf(bList) >= 0) return false;
	}
	return true;
}


$scope.isLongTrack = function(idx) {
	var track = $scope.stories[idx];
	if (!track || !track.en) return 'text-muted';
	var lengthCount = track.en.length;
	if (lengthCount > 800 )
	{
			return 'text-danger';
	}
	return 'text-warning';
}

$scope.loadData = function () {
	MYLOG('loadData');
	if (localStorage.hasOwnProperty("bri_complete_isAudioLoop")) {
		document.getElementById('audioLoopEle').checked = localStorage.bri_complete_isAudioLoop === 'true';
	}

	if (localStorage.hasOwnProperty("bri_complete_cd")) {
		var cd = localStorage.bri_complete_cd;
		MYLOG("localStorage load CD=" + cd);
		radioCDChange(parseInt(cd));
		document.cdForm.radioCD.value=cd;
		$scope.cd=cd;
	}

	if (localStorage.hasOwnProperty("bri_complete_unit")) {
		idx = localStorage.bri_complete_unit;
		MYLOG("localStorage load unit=" + idx);
		$scope.storyIdx = parseInt(idx);
	}

	$scope.fetchStory($scope.storyIdx, false);
};

$scope.loadData();

});
