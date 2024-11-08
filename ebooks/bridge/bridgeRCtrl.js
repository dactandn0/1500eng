
document.write('<script src="./ebooks/bridge/read_data/bridge_read_data.js" type="text/javascript"></script>');

var app = angular.module("bridgeRApp", ['ngSanitize']);
app.controller("bridgeRCtrl", function($scope, $timeout) {

var kSTORIES = bridge_read_data;

$scope.story = '';
$scope.acc= -1;
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

$scope.storyTitles = function () {
	return showStoryTitles(kSTORIES)
}

$scope.loadData = function () {
	$scope.acc_click( Helper_loadInt('bridgeR_unit', -1));
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});

});
