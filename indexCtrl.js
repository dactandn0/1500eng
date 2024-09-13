
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

 $scope.audio;
 $scope.currentTime = 0;

$scope.searchData = [];
$scope.searchDataResult = [];
$scope.search = "";


$scope.units = [
	{'title':"", 'num': 1},
];

$scope.resetFlag = function () {
	$scope.bPlayingFull = false;
	$scope.bPause = false;
	$scope.bShowVi = 0;
	$scope.bHiddenWords = 0;
}	


$scope.preProcess = function () {
	for (var k = 0; k < kSTORIES.length; k++) {
		story = $scope.stories[k];
		if (story.en) 
		{	
			var arr = story.en.split('<br>');
			story.numOfWord = arr.length;
			$scope.searchData = $scope.searchData.concat(arr);
		}
	} // for
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

$scope.loadData = function () {
	$scope.preProcess();
};

$scope.loadData();

});
