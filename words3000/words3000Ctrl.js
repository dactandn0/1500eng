
document.write('<script src="./words3000/3k_words_data.js" type="text/javascript"></script>');
document.write('<script src="./words3000/5k_ielt_words.js" type="text/javascript"></script>');

function hightlightTypeOfWord(txt) {
	return txt;
}

var app = angular.module("words3000App", ['ngSanitize','ngRoute']);
app.controller("words3000Ctrl", function($scope, $timeout) {

var kSTORIES = WORDS_3K_DATA.concat(IELTS_5K_DATA).concat(GRAMMER_DATA);


$scope.cd = 1;
$scope.stories = kSTORIES; //1
$scope.storyId = -1;
$scope.acc = -1;

$scope.acc_isShow = function (id) {
	return $scope.acc===id;
};

$scope.acc_click = function (id) {
	if($scope.acc===id) {
		$scope.acc = -1; 
		return;
	}
	else {
		$scope.acc = id;
	}

	story = kSTORIES[$scope.acc];
	
	var words = story.en.split('<br>');
	for (var i = 0; i < words.length; i++) {
		var word = words[i];
		var textEn = word.split('|')[0];
		story.en = hightlightTypeOfWord(story.en);
		story.en = story.en.replace(textEn, hLightWords(textEn.trim()));
	}

	_scrollIntoView(id);
};



$scope.preProcess = function () {
	for (var k = 0; k < kSTORIES.length; k++) {
		var story = $scope.stories[k];
		if (story.en) {	
			var words = story.en.split('<br>');
			story.numOfWords = words.length;
		}	
	}
}

$scope.loadData = function () {
	$scope.preProcess();
};

$scope.loadData();

});