
document.write('<script src="./grammer/grammer_data.js" type="text/javascript"></script>');
document.write('<script src="./grammer/grammer_data2.js" type="text/javascript"></script>');

var app = angular.module("grammerApp", ['ngSanitize']);
app.controller("grammerCtrl", function($scope, $rootScope, $timeout) {

var kDATA = GRAMMER_DATA.concat(GRAMMER_DATA2);

$scope.img_root = './grammer/images' ; 

$scope.stories = kDATA; 
$scope.storyId = -1;
$scope.acc = -1;

Helper_MakeVoca_Menu_Titles($rootScope, $scope)

$scope.acc_isShow = function (id) {
	return $scope.acc === id;
}

$scope.acc_click = function (id) {
	if($scope.acc===id) $scope.acc=-1;
	else 
	{
		$scope.acc = id;
		Helper_FetchStory(id, $scope, $rootScope, 'GRAMMER_DATA_idx', false) 
	}
};

$scope.loadData = function () {
};

$scope.loadData();

});
