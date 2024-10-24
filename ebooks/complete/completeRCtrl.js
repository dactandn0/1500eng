
document.write('<script src="./ebooks/complete/read_data/complete_read_data.js" type="text/javascript"></script>');

var app = angular.module("completeRApp", []);
app.controller("completeRCtrl", function($scope, $timeout) {

var kSTORIES = complete_read_data;

$scope.fullTitles = [];
$scope.story = '';
$scope.bShowVi = 0;
$scope.acc=-1;

$scope.acc_isShow = function (id) {
	return $scope.acc===id;
};

$scope.acc_click = function (id) {
	if($scope.acc===id) $scope.acc=-1;
	else {
		$scope.acc=id;
		$scope.story = processStory(kSTORIES[id]);
	}
	Helper_saveDB("completeR_unit", id)
};

$scope.fetchStory = function () {
	for (var k = 0; k < kSTORIES.length; k++) {
		var unit = kSTORIES[k].unit;
		var title = kSTORIES[k].title;
		$scope.fullTitles.push('U' + unit + ": " + title);
	}
}

$scope.loadData = function () {
	$scope.acc_click( Helper_loadInt('completeR_unit', -1));
	$scope.fetchStory();
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});
});
