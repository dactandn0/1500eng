
document.write('<script src="global_js.js" type="text/javascript"></script>');

function MYLOG(msg) {
//	console.log(msg);
}

var app = angular.module("myApp", ['ngSanitize']);
app.controller("ctrl", function($scope, $timeout) {

var kSTORIES = INDEX_DATA;


$scope.cd = 1;
$scope.stories = kSTORIES; //1

$scope.acc = -1;

$scope.acc_isShow = function (id) {
	return $scope.acc===id;
};

$scope.acc_click = function (id) {
	if($scope.acc===id) $scope.acc=-1;
	else
		$scope.acc=id;
};


$scope.searchData = [];
$scope.searchDataResult = [];
$scope.search = "";


$scope.units = [
	{'title':"", 'num': 1},
];

$scope.searchTyping = function() {
	$scope.searchDataResult = [];
	if ($scope.search.length < 2)return;
    var search = removeVietnameseTones($scope.search.toLowerCase());
    if ($scope.searchData.length==0) return true;       
    for (var i = 0; i < $scope.searchData.length; i++) {
    	var dataVN = $scope.searchData[i];
    	data = removeVietnameseTones(dataVN.toLowerCase());
    	if (data.includes(search)) {
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
		story = $scope.stories[k];
		if (story.en) {	
			story.en = story.en.replaceAll('|n|', '<small class="text-info mx-2">n</small>');
			story.en = story.en.replaceAll('|a|', '<small class="text-success">a</small>');
			story.en = story.en.replaceAll('|adv|', '<small class="text-success font-weight-bold">adv</small>');
			story.en = story.en.replaceAll('|v|', '<small class="text-warning">v</small>');
			var word = story.en.split('<br>');
			story.numOfWord = word.length;
			$scope.searchData = $scope.searchData.concat(word);
		}	
	}
}



$scope.loadData = function () {
	$scope.preProcess();
};

$scope.loadData();

});
