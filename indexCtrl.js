
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

			var words = story.en.split('<br>');
			story.numOfWords = words.length;
			for (var i = 0; i < words.length; i++) {
				var word = words[i];
				var textEn = word.split('|')[0];
				story.en = story.en.replace(textEn,hLightWords(textEn.trim()));
			}
			story.en = story.en.replaceAll('|n|', '<label class="text-info ml-2">n</label>');
			story.en = story.en.replaceAll('|a|', '<label class="text-success ml-2">a</label>');
			story.en = story.en.replaceAll('|adv|', '<label class="text-success font-weight-bold ml-2">adv</label>');
			story.en = story.en.replaceAll('|v|', '<label class="text-warning ml-2">v</label>');
			$scope.searchData = $scope.searchData.concat(words);

		}	
	}
}



$scope.loadData = function () {
	$scope.preProcess();
};

$scope.loadData();

});
