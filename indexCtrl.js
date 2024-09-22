
function MYLOG(msg) {
//	console.log(msg);
}
function hightlightTypeOfWord(txt) {
	return txt;
}

var app = angular.module("myApp", ['grammerApp','lptdApp','words3000App','words4000App','ngSanitize','ngRoute']);
app.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'words3000/words3000.html',
        controller: 'words3000Ctrl'
      })      
      .when('/book4k', {
        templateUrl: 'words4000/words4000.html',
        controller: 'words4000Ctrl'
      })
      .when('/lptd', {
        templateUrl: 'lptd/lptd.html',
        controller: 'lptdCtrl'
      }) 
      .when('/grammer', {
        templateUrl: 'grammer/grammer.html',
        controller: 'grammerCtrl'
      })
      .otherwise({
         redirectTo: '/'
      });
 }); // route

app.controller("indexCtrl", function($scope, $timeout) {

var kSTORIES = WORDS_3K_DATA.concat(IELTS_5K_DATA);

$scope.searchData = [];
$scope.searchDataResult = [];
$scope.search = "";
$scope.story = '';

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

$scope.loadData = function () {
	$scope.preProcess();
};

$scope.loadData();

});