
document.write('<script src="./ebooks/englab/beginnerCourse/englab_begin_data_R.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/englab/beginnerCourse/englab_begin_data_W.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/englab/beginnerCourse/englab_begin_data_S.js" type="text/javascript"></script>');

var app = angular.module("beginnerCourseApp", []);
app.controller("beginnerCourseCtrl", function($scope, $rootScope, $timeout) {

$scope.img_root = './ebooks/englab/beginnerCourse/images' ; 						
$scope.ielt_form = 0 ; 						//Reading
$scope.stories = ENGLAB_BEGIN_DATA_R;		// def

$scope.story = '';
$scope.acc = -1;
$scope.titles = showStoryTitles($scope.stories);  // def

ielt_formChange = function (num) {
	$scope.ielt_form = num;
	Helper_saveDB("englabbegin_form", num);
	if (num===0) $scope.stories = ENGLAB_BEGIN_DATA_R;
	if (num===1) $scope.stories = ENGLAB_BEGIN_DATA_W;
	if (num===2) $scope.stories = ENGLAB_BEGIN_DATA_S;
	$scope.acc = -1;
	$scope.titles = showStoryTitles($scope.stories);
	$scope.$digest();
}

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
	var story = ENGLAB_BEGIN_DATA_W[idx]
	var type = Number(story.examType);
	if (type===0) return {color: 'red'}  //vi 2 En
}

$scope.loadData = function () {
	makeVocaEbook($rootScope, 
		ENGLAB_BEGIN_DATA_R,
		ENGLAB_BEGIN_DATA_W,
		ENGLAB_BEGIN_DATA_S
		)
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});




});
