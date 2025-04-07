
document.write('<script src="./ebooks/tocg/data/tocg_l.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/tocg/data/tocg_r.js" type="text/javascript"></script>');


var app = angular.module("tocgApp", []);
app.controller("tocgCtrl", function($scope, $rootScope, $timeout) {

var imgRootPath = './ebooks/tocg/data/images/' ; 						
$scope.img_root = imgRootPath + 'listening/'						
$scope.ielt_form = 0 ; 								
$scope.story = '';
$scope.acc = -1;

$scope.stories = TOCG_DATA_L;			

var keyU = "tocg_u_"	

ielt_formChange = function (num, isLoadData = false) {
	$scope.$broadcast("child_stopSound");
	$scope.ielt_form = num;

	keyU = removeStrDigit(keyU) + num
	Helper_saveDB("tocg_form", num);

	$scope.acc = -1;

	if (num===0) 
	{
		$scope.img_root = imgRootPath + 'listening/'	
		$scope.stories = TOCG_DATA_L
		$scope.fetchStory(Helper_loadInt(keyU, 0));
	}
	else if (num===1)
	{
		$scope.img_root = imgRootPath + 'reading/'	
		$scope.stories = TOCG_DATA_R
		$scope.fetchStory(Helper_loadInt(keyU, 0));
	}
	Helper_MakeVoca_Menu_Titles($rootScope, $scope, false)  // needn't menu

}

$scope.acc_isShow = function (id) {
	return $scope.acc === id;
}

$scope.acc_click = function (id) {
	if($scope.acc===id) $scope.acc=-1;
	else 
	{
		$scope.acc = id;
		Helper_FetchStory(id, $scope, $rootScope, keyU) 
	}
};


$scope.createAudioSrc = function() {
	if (!$scope.story || !$scope.story.track) return ''
	var mp3File = 'Cam' + $scope.story.track + '.mp3';
	var rootPath = "./ebooks/tocg/data/mp3/"
	return rootPath + mp3File
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	Helper_AudioLoop($scope, $rootScope);
});

$scope.fetchStory = function (idx) 
{
	Helper_FetchStory (idx, $scope, $rootScope, keyU) 
}

$scope.loadData = function () {
	var cd = Helper_loadInt('tocg_form', 0);
	ielt_formChange(cd, true);
	$scope.ielt_form = cd;
	document.tocg_ielt_bForm.ielt_form.value = cd;
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});


});
