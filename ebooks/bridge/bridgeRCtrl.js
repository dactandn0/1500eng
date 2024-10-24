
document.write('<script src="./ebooks/bridge/read_data/bridge_read_data.js" type="text/javascript"></script>');

var app = angular.module("bridgeRApp", ['ngSanitize']);
app.controller("bridgeRCtrl", function($scope, $timeout) {

var kSTORIES = bridge_read_data;

$scope.story = '';
$scope.fullTitles = [];
$scope.acc=-1;
$scope.bShowVi = 0;

$scope.acc_isShow = function (id) {
	return $scope.acc===id;
};

$scope.acc_click = function (id) {
	if($scope.acc===id) $scope.acc=-1;
	else {
		$scope.acc = id;
		$scope.story = processStory(kSTORIES[id]);
	}
	localStorage.setItem("bridgeR_unit", id)
};

$scope.fetchStory = function () {
	for (var k = 0; k < kSTORIES.length; k++) {
		var unit = kSTORIES[k].unit;
		var title = kSTORIES[k].title;
		$scope.fullTitles.push('Unit ' + unit + ": " + title);
	}
}

$scope.loadData = function () {
	if (localStorage.hasOwnProperty("bridgeR_unit")) {
		$scope.acc_click( parseInt(localStorage.bridgeR_unit) );
	}
	$scope.fetchStory();
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});

});
