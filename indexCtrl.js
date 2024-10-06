

var app = angular.module("myApp", [
  'vocaNotedApp',
  'preCourseApp',
  'sampleSpeakingApp',
  'completeLApp','completeRApp',
  'bridgeRApp','bridgeLApp',
  'grammerApp','lptdApp',
  'words3000App','words4000App',
  'modalApp',
  'ngSanitize','ngRoute',
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

app.controller("indexCtrl",  ['$scope', 'appAlert','$location', function($scope, appAlert, $location, $rootScope) {
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
$scope.sentenceSearches = "";

// clear Search data when routed
$scope.$on('$routeChangeSuccess', function($event, next, current) { 
    $scope.search = "";
    $scope.searchDataResult = [];
 });

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

$scope.clearSearch = function () {
	$scope.search = '';
	$scope.searchDataResult = [];
};

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

  var ptrn = new RegExp(String.raw`[^\.\?!<>:"-]*\b${word}(s|es)*\b.*?[\?|\.|!"]+?`, 'gi');
  
  var shuffleStories = shuffle(kAllStories);
  
  for (var i = 0; i < shuffleStories.length; i++) {
    var para = shuffleStories[i].en.replaceAll("<br>", '.');
    var results = para.match(ptrn);  // array

    if (results) {
      var regex = new RegExp(`\\b${word}` , 'gi')
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
 // $scope.findSameWord();
};

$scope.loadData();

}]);  //end of ctrl