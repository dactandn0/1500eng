
document.write('<script src="./ebooks/englab/preCourse/englab_pre_slides.js" type="text/javascript"></script>');

var app = angular.module("preCourseApp", []);
app.controller("preCourseCtrl", function($scope, $rootScope, $timeout) {

$scope.stories = ENGLAB_PRE_SLIDES;
$scope.acc = -1;

$scope.acc_isShow = function (id) {
	return $scope.acc === id;
};

$scope.acc_click = function (id) {
	if($scope.acc===id) $scope.acc=-1;
	else {
		$scope.acc = id;
		Helper_FetchStory(id, $scope, $rootScope, 'englabPre_unit', false) 
	}
};

$scope.storyTitles = function () {
	return showStoryTitles(ENGLAB_PRE_SLIDES)
}

$scope.loadData = function () {
	$scope.acc_click( Helper_loadInt('englabPre_unit', -1));
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});
});
