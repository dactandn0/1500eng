
document.write('<script src="./ebooks/unreal/data/unreal_r.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/unreal/data/unreal_material.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/unreal/data/unreal_light.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/unreal/data/unreal_bp.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/unreal/data/unreal_vfx.js" type="text/javascript"></script>');



var app = angular.module("unrealApp", []);
app.controller("unrealCtrl", function($scope, $rootScope, $timeout) {

var imgRootPath = './ebooks/unreal/data/images/' ; 						
$scope.img_root = imgRootPath						
$scope.unreal_form = 0 ; 								
$scope.story = '';
$scope.acc = -1;

$scope.stories = UNREAL_DATA_R;			

var keyU = "unreal_u_"	
var unreal_form = "unreal_form"

unreal_formChange = function (num, isLoadData = false) {
	$scope.unreal_form = num;

	keyU = removeStrDigit(keyU) + num
	Helper_saveDB(unreal_form, num);

	$scope.acc = -1;

	if (num==0)
	{
		$scope.img_root = imgRootPath
		$scope.stories = UNREAL_DATA_R
	} 
	else if (num==1)
	{
		$scope.img_root = imgRootPath + 'material'
		$scope.stories = UNREAL_DATA_MATERIAL
	}	
	else if (num==2)
	{
		$scope.img_root = imgRootPath + 'light'
		$scope.stories = UNREAL_DATA_LIGHT
	}
	else if (num==3)
	{
		$scope.img_root = imgRootPath + 'bp'
		$scope.stories = UNREAL_DATA_BP
	}
	else if (num==4)
	{
		$scope.img_root = imgRootPath + 'vfx'
		$scope.stories = UNREAL_DATA_VFX
	}
	
	Helper_MakeVoca_Menu_Titles($rootScope, $scope, false)  // needn't menu
	$scope.$evalAsync();
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
	var rootPath = "./ebooks/unreal/data/mp3/"
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
	var cd = Helper_loadInt(unreal_form, 0);
	unreal_formChange(cd, true);
	$scope.unreal_form = cd;
	document.unreal_bForm.unreal_form.value = cd;
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});


});
