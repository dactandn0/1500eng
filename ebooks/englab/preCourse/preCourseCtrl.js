
document.write('<script src="./ebooks/englab/preCourse/englab_pre_slides.js" type="text/javascript"></script>');

var app = angular.module("preCourseApp", []);
app.controller("preCourseCtrl", function($scope, $timeout) {


var kSTORIES = ENGLAB_PRE_SLIDES;

$scope.fullTitles = [];
$scope.story = '';
$scope.bShowVi = 0;
$scope.acc = -1;

$scope.acc_isShow = function (id) {
	return $scope.acc===id;
};


$scope.acc_click = function (id) {
	if($scope.acc===id) $scope.acc=-1;
	else {
		$scope.acc=id;
		$scope.story = processStory(kSTORIES[id]);
	}
};

$scope.fetchStory = function () {
	for (var k = 0; k < kSTORIES.length; k++) {
		var unit = kSTORIES[k].unit;
		var title = kSTORIES[k].title;
		var date = kSTORIES[k].date;
		var ele = title + ' (' + date + ')'
		$scope.fullTitles.push(ele);
	}

}

$scope.loadData = function () {
	$scope.fetchStory();
};

$scope.loadData();

});
