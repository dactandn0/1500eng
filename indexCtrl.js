// for list_noted_voca USE
var VocaToUI = WORDS_3K_DATA
  //  .concat(IELTS_5K_DATA)
    .concat(word_4000_data)
    .concat(word_4000_data_2)
    .concat(BEGINNER_READING_VOCA)
    .concat(VOCA_SPECIAL)

var VocaForSearch = VocaToUI
    .concat(PHRASAL_VERB)
    .concat(BAT_QUI_TAC)
    .concat(IELTS_SYN)
    // .concat(GRAMMER_DATA)
    // .concat(NATIONS)

// for notedEbookCtrl
var kAllStories = SPEAKING_SAME_VOL5
  .concat(ENGLAB_BEGIN_DATA_W)
  .concat(ENGLAB_BEGIN_DATA_R)
  .concat(collins_cd12)
  .concat(lptd_cd1_stories)
  .concat(lptd_cd2_stories)
  .concat(lptd_cd3_stories)
  .concat(lptd_cd4_stories)
//  .concat(BOOK4K_1)
 // .concat(bridge_cd1)
//  .concat(bridge_read_data)
//  .concat(complete_cd1)
//  .concat(complete_read_data)
//  .concat(listen_tracks)

var saveFromToastrVal = ''
var searchData = [];
preProcess = function () {
  for (var k = 0; k < VocaForSearch.length; k++) {
    story = VocaForSearch[k];
    if (story.en) { 
      var words = story.en.split('<br>');
      searchData = searchData.concat(words);
    } 
  }
}
preProcess();

var app = angular.module("myApp", [
  'vocaNotedApp', 
  // 'ebookNotedApp',
  'configUIApp',
  'f2fApp',
  'tflApp',
  'preCourseApp',
  'beginnerCourseApp',
  'spkBookApp',
  'writingvol5App',
  'completeApp',
  'tocgApp',
  /*
  'sampleSpeakingApp',
  'bridgeRApp','bridgeLApp',
  'barron600RApp','barron600LApp',
  */
  'grammerApp',
  'lptdApp',
  'wordCollectApp','words4000App', 
  'modalApp', 'audioApp', 'audioLoopRadioApp',
  'ngSanitize','ngRoute','toastr'
  ]);
app.config(function($routeProvider) {
    $routeProvider
	//	.when('/', { templateUrl: 'wordCollect/wordCollect.html', controller: 'wordCollectCtrl' }) 
		.when('/configUI', {templateUrl: 'vocaNoted/configUI.html', controller: 'configUICtrl'})
		.when('/vocaNoted', {templateUrl: 'vocaNoted/vocaNoted.html', controller: 'vocaNotedCtrl'})
		// .when('/ebookNoted', {templateUrl: 'vocaNoted/ebookNoted.html', controller: 'ebookNotedCtrl'})
    .when('/f2f', {templateUrl: 'ebooks/f2f/f2f.html', controller: 'f2fCtrl'})
    .when('/tfl', {templateUrl: 'ebooks/tfl/tfl.html', controller: 'tflCtrl'})
    .when('/book4k', {templateUrl: 'ebooks/words4000/words4000.html', controller: 'words4000Ctrl'})
		.when('/writingvol5', {templateUrl: 'ebooks/writingvol5/writingvol5.html', controller: 'writingvol5Ctrl'})
		//    .when('/lptd', {
		.when('/', {templateUrl: 'ebooks/lptd/lptd.html', controller: 'lptdCtrl'})
		.when('/grammer', {templateUrl: 'grammer/grammer.html', controller: 'grammerCtrl'})
		.when('/spkBook', {templateUrl: 'ebooks/spkBook/spkBook.html', controller: 'spkBookCtrl'})
		.when('/bridgeL', {templateUrl: 'ebooks/bridge/bridgeL.html', controller: 'bridgeLCtrl'})
		.when('/bridgeR', {templateUrl: 'ebooks/bridge/bridgeR.html', controller: 'bridgeRCtrl'})
		.when('/tocg', {templateUrl: 'ebooks/tocg/tocg.html', controller: 'tocgCtrl'})
		.when('/completeL', {templateUrl: 'ebooks/complete/complete.html', controller: 'completeCtrl'})
		// .when('/completeR', {templateUrl: 'ebooks/complete/completeR.html', controller: 'completeRCtrl'})
		.when('/barron600R', {templateUrl: 'ebooks/barron600/barron600R.html', controller: 'barron600RCtrl'})
		.when('/barron600L', {templateUrl: 'ebooks/barron600/barron600L.html', controller: 'barron600LCtrl'})
		.when('/sampleSpeaking', {templateUrl: 'ebooks/sampleSpeaking/sampleSpeaking.html', controller: 'sampleSpeakingCtrl'})
    .when('/preCourse', {templateUrl: 'ebooks/englab/preCourse/preCourse.html', controller: 'preCourseCtrl'})
		.when('/beginnerCourse', {templateUrl: 'ebooks/englab/beginnerCourse/beginnerCourse.html', controller: 'beginnerCourseCtrl'})
		.otherwise({redirectTo: '/'
      });
 }); // route

app.controller("indexCtrl",  ['$scope', 'appAlert','$location', 'toastr', '$rootScope' , '$http', function($scope, appAlert, $location, toastr, $rootScope, $http ) {

$rootScope.$on('$routeChangeStart', function () {
  $rootScope.bVocaOfEbook = false;
  $rootScope.vocaEbook = [];
});


IndexCtrlScope = $scope;

// for word3000Ctrl
$rootScope.VocaToUI = VocaToUI
$rootScope.VocaForSearch = VocaForSearch

$scope.searchDataResult = [];
$scope.search = "";
$scope.sentenceSearches = [];

// clear Search data when routed
$scope.$on('$routeChangeSuccess', function($event, next, current) { 
    $scope.clearSearch();
 });

$scope.clearSearch = function () {
  $scope.search = '';
  $scope.searchDataResult = [];
  $scope.sentenceSearches = [];
 // document.getElementById("searchTyping").focus();
};

$scope.saveNoted = function(word, isFromToastr) {
  word = word.trim();
  var kDatabase = Helper_NoteFetchDB();

  if (word.length >= 2 && !Helper_IsWordSavedBefore(word)) {

    kDatabase = kDatabase + "@" + word;
    Helper_NoteSaveDB(kDatabase);

    if ($location.path().indexOf('vocaNoted') >=0 ) {
      VocaNotedCtrl.appendDataToUI(word);
    }
    toastr.success("Saved: " + word);
    if (!isFromToastr) $scope.clearSearch()
  } else {
    toastr.error("Existed. Save failed")
  }
}

$scope.IsWordSavedBefore = function(word) {
  return Helper_IsWordSavedBefore(word);
} 

$scope.searchTyping = function() {
  $scope.sentenceSearches = [];
  if (searchData.length==0) return true;       
	$scope.searchDataResult = [];
	if ($scope.search.length <= 2) return;
    var search = removeVietnameseTones($scope.search.toLowerCase());
    for (var i = 0; i < searchData.length; i++) {
    	var dataVN = searchData[i];
    	data = removeVietnameseTones(dataVN.toLowerCase());
    	if (data.includes(search)) {
        dataVN = Helper_IsUncountNoun(dataVN)
    		$scope.searchDataResult.push(Helper_SliceHalfString(dataVN));
    	}
    }
}

$scope.findSameWord = function() {
  for (var i = 0; i < searchData.length-1; i++) {
    var word1=  Helper_GetVocaFromWordFull(searchData[i]);
    if (word1.length==0) continue;
    for (var k = i+1; k < searchData.length; k++) {
      var word2=  Helper_GetVocaFromWordFull(searchData[k]);
      if (word1 === word2) {
        console.log("findSameWord: " + word1);
        break;
      }
    }
  }
}

saveFromToastr = function () {
  if (saveFromToastrVal.trim().length > 0)
    $scope.saveNoted(saveFromToastrVal, true)
}

// search
$scope.Index_Speak = function (event, word) {
  Helper_Speak(event, word);
}

$scope.Index_NoteVoca_Speak = function (word) {
  word = word.replace(/\/.*\//gi, '').replace(/\:.+\:/gi, '.')
  var parts = word.split(' ')
  var concatWord = ''
  parts.forEach(ele => {
    if (TIENGVIET_ARR.includes(ele)) return; // ~ continue
    if (/^[A-Za-z\.,!\?'\-\:]+$/gi.test(ele))  // keep we'd, he's, Mr.Vas
    {
      concatWord += ' ' + ele
    }
  })
  Text2Speech(concatWord.trim());
}

// vocaEbook Touch
$scope.vocaEbookSpeech = function (event, txt, lesson, idx, idxParent) {
  event.stopPropagation()
  var sentences = doFetchSentences(txt, [lesson])
  if (sentences) {
    $scope.sentenceForVoca = ' - ' + sentences[0]
    $scope.vocaIdx = idx
    $scope.lessonIdx = idxParent
  }
  ngClickSpeechShowToast(txt)
}

// ng-click word to speech
$scope.Idx_n_L_WSp_ = function (event) {
  event.stopPropagation()
  var touchedWord = Helper_getTouchTextEvent(event)
  ngClickSpeechShowToast(touchedWord)
}

getToastMsg = function(txt)
{
  var result = IELTS_SYN_IsIn(txt)
  if (result !== '') {
     return result;
  }
  for (var i = 0; i < searchData.length; i++) 
    {
      var wordFull = searchData[i]
      var word = Helper_GetVocaFromWordFull(wordFull).toLowerCase();

      if (word === txt || Helper_IsFormOfWord(word, txt)) {
          return wordFull;
      }
  }
  return txt
}

ngClickSpeechShowToast = function (touchedWord) 
{
  var ignores = ['the','those', 'this','that']
  var tWords = touchedWord.split(' ')
  tWords = tWords.filter(function(ele) { 
    return ele.length > 2  && !ignores.includes(ele)
  });

  var msg = getToastMsg(touchedWord)
  if (msg == touchedWord && tWords.length > 1)
  {
    msg = ''
    for (var i = 0; i < tWords.length; i++) {
      msg += getToastMsg(tWords[i]) + '<br>'
    }
  }

  // not in database, so using GOOGLE TRANS API
  if (msg == touchedWord)
  {
    let input = touchedWord
    let url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=" + input
    $http({
      method: 'GET',
      url: url
    }).then( res => {
        var out = res.data[0][0][0]
        doShowToast(touchedWord + ' /(trans)/ ' + out)
        Text2Speech(touchedWord);
      }, err => {
        doShowToast(touchedWord + ' /trans error!')
        Text2Speech(touchedWord);
      });
  }
  else
  {
    doShowToast(msg)
    Text2Speech(touchedWord);
  }

 

}

function doShowToast(content) 
{
  if (Helper_IsWordSavedBefore(content)) {
       toastr.info(content);
       return;
  } 
  saveFromToastrVal = content;
  toastr.info('<button class="btn btn-sm btn-success" onclick="saveFromToastr()">Save</button>', content, {
    allowHtml: true
  });
}


$scope.showExampleModal = function(wordFull, event) {
      var sentences = $scope.fetchSentences(wordFull);
      if (!sentences) {
        event.target.style.color = 'red';
        return;
      }
      event.target.style.color = 'green';

      appAlert.alert({
          title: 'Title',
          message: 'This is alert message!',
          type: 'danger',
          dataSent: sentences,
          wordFull: Helper_RemoveHTMLtag(wordFull)
      });
    
  };

$scope.showConfirmModal = function(wordFull, event) {    
    appAlert.confirm({
        title: 'Confirm delete!',
        message: 'Do you want to delete this record ?',
        dataSent: wordFull,
    }, function(isOk) {
        if (isOk) {
          if (wordFull.indexOf("all") >=0) 
            VocaNotedCtrl.removeAllNoted();
          else
            VocaNotedCtrl.removeNote(wordFull, event)
        }
    });
};

doFetchSentences = function(word, StoriesData) {
  if (word==='') return 0;

  var word_s_es = Helper_N_V_Add_S_ES(word);
  var word_ing = Helper_N_V_Add_ING(word);

  var ptrn = new RegExp(String.raw`[^\.\?!<>:"-]*\b(${word}|${word_s_es}|${word_ing})\b.*?[\?|\.|!"]+?`, 'gi');
  
  var shuffleStories = shuffle(StoriesData);
  
  for (var i = 0; i < shuffleStories.length; i++) {
    if (!shuffleStories[i].en) continue;
    var para = shuffleStories[i].en.replaceAll("<br>", '.');
    var results = para.match(ptrn);  // array

    if (results) {
      var regex = new RegExp(`\\b(${word}|${word_s_es})` , 'gi')
      for (var i = 0; i < results.length; i++) {
        var nn = results[i];
        if (!nn.match(regex)) continue
        var match = nn.match(regex)[0];
        results[i] = nn.replaceAll(match , "<b>" + match +"</b>");
      }
      return (results);
    }
  }
  return 0;
}

// wordFull like:  Sea n /siː/ Biển
$scope.fetchSentences = function(wordFull) {
  var word = Helper_GetVocaFromWordFull(wordFull);
  return doFetchSentences(word, kAllStories)
}

$scope.fetchSentenceSearch = function() {
    $scope.sentenceSearches = $scope.fetchSentences($scope.search);
}

$scope.loadData = function () {
  if (HELPER_FOR_TEST) $scope.findSameWord();
};



$scope.$on('$viewContentLoaded', function () {
  $scope.loadData();

}) // viewContentLoaded
}]);  //end of ctrl

app.directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                return scope.$eval(attrs.compile);
            },
            function(value) {
                element.html(value);
                $compile(element.contents())(scope);
            }
        );
    };
}])


// https://github.com/Foxandxss/angular-toastr
app.config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    autoDismiss: true,
    containerId: 'toast-container',
    maxOpened: 0,    
    newestOnTop: true,
    positionClass: 'toast-bottom-center',
    preventDuplicates: false,
    preventOpenDuplicates: false,
    target: 'body',
    timeOut: 5000,
    tapToDismiss: true,
  });
});
