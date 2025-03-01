
document.write('<script src="./ebooks/englab/beginnerCourse/englab_begin_data_R.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/englab/beginnerCourse/englab_begin_data_W.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/englab/beginnerCourse/englab_begin_data_S.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/englab/beginnerCourse/englab_begin_data_L.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/englab/beginnerCourse/sheep_or_ship.js" type="text/javascript"></script>');

var app = angular.module("beginnerCourseApp", []);
app.controller("beginnerCourseCtrl", function($scope, $rootScope, $timeout) {

var imgRootPath = './ebooks/englab/beginnerCourse/images/' ; 						
$scope.img_root = imgRootPath + 'lessons/'						
$scope.ielt_form = 0 ; 								
$scope.story = '';
$scope.acc = -1;

$scope.stories = ENGLAB_BEGIN_DATA_R;			

var keyU = "beg_u_"	

ielt_formChange = function (num, isLoadData = false) {
	$scope.$broadcast("child_stopSound");
	$scope.ielt_form = num;

	keyU = removeStrDigit(keyU) + num
	Helper_saveDB("beg_form", num);

	if (num===0) 
	{
		$scope.stories = ENGLAB_BEGIN_DATA_R;
	}
	if (num===1)
	{
		$scope.stories = ENGLAB_BEGIN_DATA_W;
	}
	if (num===2) $scope.stories = ENGLAB_BEGIN_DATA_S;
	if (num===3)
	{
		$scope.img_root = imgRootPath + 'lessons/'	
		$scope.stories = ENGLAB_BEGIN_DATA_L
		$scope.fetchStory(Helper_loadInt(keyU, 0));
	}
	if (num===4) 
	{
		$scope.img_root = imgRootPath + 'sos/'	
		$scope.stories = ENGLAB_BEGIN_DATA_Sheep_or_ship
		$scope.fetchStory(Helper_loadInt(keyU, 0));
	}
	Helper_MakeVoca_Menu_Titles($rootScope, $scope)
	$scope.acc = -1;

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

// for writing
$scope.examTypeCss = function (idx) {
	if ($scope.ielt_form !== 1) return;
	var story = ENGLAB_BEGIN_DATA_W[idx]
	var type = Number(story.examType);
	if (type===0) return {color: 'purple'}  //vi 2 En
}

$scope.createAudioSrc = function() {
	var mp3File = $scope.story.track + '.mp3';
	var rootPath = "./ebooks/englab/beginnerCourse/"
	if ($scope.ielt_form === 3) return rootPath + "L_mp3/" + mp3File
	else if ($scope.ielt_form === 4) return rootPath + "s_o_s_mp3/" + mp3File
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	Helper_AudioLoop($scope, $rootScope);
});

$scope.fetchStory = function (idx) 
{
	Helper_FetchStory (idx, $scope, $rootScope, keyU) 
}

$scope.loadData = function () {
	var cd = Helper_loadInt('beg_form', 0);
	ielt_formChange(cd, true);
	$scope.ielt_form = cd;
	document.beg_ielt_bForm.ielt_form.value = cd;
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});


});
