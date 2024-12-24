
document.write('<script src="./ebooks/englab/beginnerCourse/englab_begin_data.js" type="text/javascript"></script>');

var app = angular.module("beginnerCourseApp", []);
app.controller("beginnerCourseCtrl", function($scope, $rootScope, $timeout) {


$scope.stories = ENGLAB_BEGIN_DATA;

$scope.story = '';
$scope.acc = -1;


$scope.acc_isShow = function (id) {
	return $scope.acc === id;
};

$scope.acc_click = function (id) {
	if($scope.acc===id) $scope.acc=-1;
	else {
		$scope.acc = id;
		Helper_FetchStory(id, $scope, $rootScope, 'englabbegin_unit', false) 
	}
};

$scope.storyTitles = function () {
	return showStoryTitles($scope.stories)
}

$scope.loadData = function () {
	$scope.acc_click( Helper_loadInt('englabbegin_unit', -1));
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});
});
