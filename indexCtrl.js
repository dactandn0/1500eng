

var app = angular.module("myApp", [
  'vocaNotedApp',
  'preCourseApp',
  'sampleSpeakingApp',
  'completeLApp','completeRApp',
  'bridgeRApp','bridgeLApp',
  'barron600RApp','barron600LApp',
  'grammerApp','lptdApp',
  'words3000App','words4000App', 
  'modalApp', 'audioApp', 'audioLoopRadioApp',
  'ngSanitize','ngRoute','toastr'
  ]);
app.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'words3000/words3000.html', controller: 'words3000Ctrl'
      }) 
      .when('/vocaNoted', {
        templateUrl: 'vocaNoted/vocaNoted.html', controller: 'vocaNotedCtrl'
      })        
      .when('/book4k', {
        templateUrl: 'words4000/words4000.html', controller: 'words4000Ctrl'
      })
      .when('/lptd', {
        templateUrl: 'lptd/lptd.html', controller: 'lptdCtrl'
      }) 
      .when('/grammer', {
        templateUrl: 'grammer/grammer.html', controller: 'grammerCtrl'
      }) 
      .when('/ebooks', {
        templateUrl: 'ebooks/ebooks.html',
      })         
      .when('/englab', {
        templateUrl: 'ebooks/englab/englab.html',
      })    
      .when('/bridgeL', {
        templateUrl: 'ebooks/bridge/bridgeL.html', controller: 'bridgeLCtrl'
      })
       .when('/bridgeR', {
       templateUrl: 'ebooks/bridge/bridgeR.html', controller: 'bridgeRCtrl'
      }) 
       .when('/completeL', {
       templateUrl: 'ebooks/complete/completeL.html', controller: 'completeLCtrl'
      })    
       .when('/completeR', {
       templateUrl: 'ebooks/complete/completeR.html', controller: 'completeRCtrl'
      })    
       .when('/barron600R', {
       templateUrl: 'ebooks/barron600/barron600R.html', controller: 'barron600RCtrl'
      })        
       .when('/barron600L', {
       templateUrl: 'ebooks/barron600/barron600L.html', controller: 'barron600LCtrl'
      })    
      .when('/sampleSpeaking', {
       templateUrl: 'ebooks/sampleSpeaking/sampleSpeaking.html', controller: 'sampleSpeakingCtrl'
      })      
      .when('/preCourse', {
       templateUrl: 'ebooks/englab/preCourse/preCourse.html', controller: 'preCourseCtrl'
      })
      .otherwise({
         redirectTo: '/'
      });
 }); // route

app.controller("indexCtrl",  ['$scope', 'appAlert','$location', 'toastr',  function($scope, appAlert, $location, toastr, $rootScope ) {
IndexCtrlScope = $scope;

$scope.kAllVocaWords = WORDS_3K_DATA
    .concat(IELTS_5K_DATA)
    .concat(word_4000_data)
    .concat(VOCA_SPECIAL)
    .concat(IELTS_SYN)

kAllStories = lptd_cd1_stories
  .concat(lptd_cd2_stories)
  .concat(lptd_cd3_stories)
  .concat(BOOK4K_1)
  .concat(bridge_cd1)
  .concat(bridge_read_data)
  .concat(complete_cd1)
  .concat(complete_read_data)
  .concat(listen_tracks)


$scope.searchData = [];
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
  $scope.sentenceSearches = []
};

$scope.saveNoted = function(event, word) {
  event.target.style.borderColor = 'black';
  word = word.trim();
  var kDatabase = Helper_FetchDB();

  if (word.length >= 2 && !Helper_IsWordSavedBefore(word)) {

    kDatabase = kDatabase + "@" + word;
    Helper_SaveDB(kDatabase);

    if ($location.path().indexOf('vocaNoted') >=0 ) {
      VocaNotedCtrl.appendDataToUI(word);
    }
  } else {
    event.target.style.borderColor = 'red';
  }
}

$scope.IsWordSavedBefore = function(word) {
  return Helper_IsWordSavedBefore(word);
} 

$scope.searchTyping = function() {
  $scope.sentenceSearches = [];
  if ($scope.searchData.length==0) return true;       
	$scope.searchDataResult = [];
	if ($scope.search.length <= 2) return;
    var search = removeVietnameseTones($scope.search.toLowerCase());
    for (var i = 0; i < $scope.searchData.length; i++) {
    	var dataVN = $scope.searchData[i];
    	data = removeVietnameseTones(dataVN.toLowerCase());
    	if (data.includes(search)) {
    		$scope.searchDataResult.push(Helper_SliceHalfString(dataVN));
    	}
    }
}


$scope.preProcess = function () {
	for (var k = 0; k < $scope.kAllVocaWords.length; k++) {
		story = $scope.kAllVocaWords[k];
		if (story.en) {	
			var words = story.en.split('<br>');
			$scope.searchData = $scope.searchData.concat(words);
		}	
	}
}

$scope.findSameWord = function() {
  for (var i = 0; i < $scope.searchData.length-1; i++) {
    var word1=  Helper_GetVocaFromWordFull($scope.searchData[i]);
    if (word1.length==0) continue;
    for (var k = i+1; k < $scope.searchData.length; k++) {
      var word2=  Helper_GetVocaFromWordFull($scope.searchData[k]);
      if (word1 === word2) {
        console.log(word1);
        break;
      }
    }
  }
}

$scope.Index_Speak = function (event, word, fullSentence = false) {
  Helper_Speak(event, word, fullSentence);
}

// click word to speech
$scope.Idx_n_L_WSp_ = function (event) {
  Helper_ngClickWordSpeak(event);

  var src = event.target.innerText;
  
  for (var i = 0; i < $scope.searchData.length; i++) {
    var wordFull = $scope.searchData[i]

    var word = Helper_GetVocaFromWordFull(wordFull);
    var word_s_es = Helper_N_V_Add_S_ES(word)

    if (word.toLowerCase()===src.toLowerCase() || word_s_es.toLowerCase()===src.toLowerCase()) {
        toastr.info(wordFull);
        break;
    }
  }
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
          wordFull: wordFull
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


// wordFull like:  Sea n /siː/ Biển
$scope.fetchSentences = function(wordFull) {
  
  var word = Helper_GetVocaFromWordFull(wordFull);

  if (word==='') return 0;

  var word_s_es = Helper_N_V_Add_S_ES(word);

  var ptrn = new RegExp(String.raw`[^\.\?!<>:"-]*\b(${word}|${word_s_es})\b.*?[\?|\.|!"]+?`, 'gi');
  
  var shuffleStories = shuffle(kAllStories);
  
  for (var i = 0; i < shuffleStories.length; i++) {
    var para = shuffleStories[i].en.replaceAll("<br>", '.');
    var results = para.match(ptrn);  // array

    if (results) {
      var regex = new RegExp(`\\b(${word}|${word_s_es})` , 'gi')
      for (var i = 0; i < results.length; i++) {
        var nn = results[i];
        var match = nn.match(regex)[0];
        results[i] = nn.replaceAll(match , "<b>" + match +"</b>");
      }
      return (results);
    }
  }
  return 0;
}

$scope.fetchSentenceSearch = function() {
    $scope.sentenceSearches = $scope.fetchSentences($scope.search);
}


$scope.loadData = function () {
  $scope.preProcess();
 $scope.findSameWord();
};

$scope.loadData();

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
    autoDismiss: false,
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

