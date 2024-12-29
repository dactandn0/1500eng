
document.write('<script src="./ebooks/writingvol5/writingvol5_data.js" type="text/javascript"></script>');

var app = angular.module("writingvol5App", []);
app.controller("writingvol5Ctrl", function($scope, $rootScope, $timeout) {

$scope.img_root = './ebooks/writingvol5/images'; 						
$scope.ielt_form = 0 ; 						//Reading
$scope.stories = WRITINGVOL5_DATA;			// def

$scope.story = '';
$scope.acc = -1;
$scope.titles = showStoryTitles($scope.stories);  // def

$scope.acc_isShow = function (id) {
	return $scope.acc === id;
}

$scope.acc_click = function (id) {
	if($scope.acc===id) $scope.acc=-1;
	else {
		$scope.acc = id;
		Helper_FetchStory(id, $scope, $rootScope, 'englabbegin_idx', false) 
	}
};

// for writing
$scope.examTypeCss = function (idx) {
	if ($scope.ielt_form !== 1) return;
	var story = WRITINGVOL5_DATA[idx]
	var type = story.examType;
	if (type===0) return {color: 'red'}
}

$scope.loadData = function () {

};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});




});
