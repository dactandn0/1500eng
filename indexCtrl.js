
function MYLOG(msg) {
//	console.log(msg);
}
function hightlightTypeOfWord(txt) {
	return txt;
}

var app = angular.module("myApp", [
  'preCourseApp',
  'sampleSpeakingApp',
  'completeLApp','completeRApp',
  'bridgeRApp','bridgeLApp',
  'grammerApp','lptdApp',
  'words3000App','words4000App',
  'ngSanitize','ngRoute', 'ui.bootstrap','ngAnimate'
  ]);
app.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'words3000/words3000.html', controller: 'words3000Ctrl',controllerAs:"words3000As"
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

app.controller("indexCtrl", function($scope, $timeout) {

var kSTORIES = WORDS_3K_DATA.concat(IELTS_5K_DATA).concat(GRAMMER_DATA)

$scope.searchData = [];
$scope.searchDataResult = [];
$scope.search = "";

$scope.searchTyping = function() {
    if ($scope.searchData.length==0) return true;       
	$scope.searchDataResult = [];
	if ($scope.search.length <= 2) return;
    var search = removeVietnameseTones($scope.search.toLowerCase());
    for (var i = 0; i < $scope.searchData.length; i++) {
    	var dataVN = $scope.searchData[i];
    	data = removeVietnameseTones(dataVN.toLowerCase());
    	if (data.includes(search)) {
			dataVN = hightlightTypeOfWord(dataVN)
    		$scope.searchDataResult.push(dataVN);
    	}
    }
};

$scope.clearSearch = function () {
	$scope.search = '';
	$scope.searchDataResult = [];
};

$scope.preProcess = function () {
	for (var k = 0; k < kSTORIES.length; k++) {
		story = kSTORIES[k];
		if (story.en) {	
			var words = story.en.split('<br>');
			$scope.searchData = $scope.searchData.concat(words);
		}	
	}
}

$scope.findSameWord = function() {
  for (var i = 0; i < $scope.searchData.length-1; i++) {
    var word1 = $scope.searchData[i].split(" ")[0].trim();
    for (var k = i+1; k < $scope.searchData.length; k++) {
      var word2 = $scope.searchData[k].split(" ")[0].trim()
      if (word1 === word2) {
        console.log(word1);
        break;
      }
    }
  }
}

$scope.topFunction = function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


$scope.loadData = function () {
  $scope.preProcess();
//	$scope.findSameWord();
};

$scope.loadData();

});

