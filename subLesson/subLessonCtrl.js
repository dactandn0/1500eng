
document.write('<script src="./subLesson/subLesson_data.js" type="text/javascript"></script>');
document.write('<script src="./subLesson/subLesson_data2.js" type="text/javascript"></script>');

var app = angular.module("subLessonApp", ['ngSanitize']);
app.controller("subLessonCtrl", function($scope, $rootScope, $timeout) {

var kDATA = SUBLESSON_DATA.concat(SUBLESSON_DATA2);

$scope.img_root = './subLesson/images' ; 

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
		Helper_FetchStory(id, $scope, $rootScope, 'subLe_DATA_idx', false) 
	}
};

$scope.loadData = function () {
};

$scope.loadData();

});
