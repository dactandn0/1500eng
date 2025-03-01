
document.write('<script src="./ebooks/writingvol5/writingvol5_data.js" type="text/javascript"></script>');

var app = angular.module("writingvol5App", []);
app.controller("writingvol5Ctrl", function($scope, $rootScope, $timeout) {

$scope.img_root = './ebooks/writingvol5/images'; 						
$scope.stories = WRITINGVOL5_DATA;	
$scope.acc = -1;

Helper_MakeVoca_Menu_Titles($rootScope, $scope)

$scope.acc_isShow = function (id) {
	return $scope.acc === id;
}

$scope.acc_click = function (id) {
	if($scope.acc===id) $scope.acc = -1;
	else {
		$scope.acc = id;
		Helper_FetchStory(id, $scope, $rootScope, 'writing_vol5', false) // alertViEn = false 
	}
}

$scope.loadData = function () {

}

$scope.$on('$viewContentLoaded', function()
{

})




});
