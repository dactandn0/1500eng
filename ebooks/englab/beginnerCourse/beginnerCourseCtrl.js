
document.write('<script src="./ebooks/englab/beginnerCourse/englab_begin_data_R.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/englab/beginnerCourse/englab_begin_data_W.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/englab/beginnerCourse/englab_begin_data_S.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/englab/beginnerCourse/englab_begin_data_L.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/englab/beginnerCourse/speaking_sample_vol5.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/englab/beginnerCourse/sheep_or_ship.js" type="text/javascript"></script>');

var app = angular.module("beginnerCourseApp", []);
app.controller("beginnerCourseCtrl", function($scope, $rootScope, $timeout) {

var imgRootPath = './ebooks/englab/beginnerCourse/images/' ; 						
$scope.img_root = imgRootPath + 'lessons/'						
$scope.ielt_form = 0 ; 								//Reading

$scope.story = '';
$scope.acc = -1;

$scope.stories = ENGLAB_BEGIN_DATA_R;				// def
$scope.titles = showStoryTitles($scope.stories);  	// def
makeVocaEbook($rootScope, ENGLAB_BEGIN_DATA_R) 		// def

ielt_formChange = function (num, isLoadData = false) {
	$scope.$broadcast("child_stopSound");
	$rootScope.vocaEbook = null;
	$scope.ielt_form = num;
	if (num===0) 
	{
		$scope.stories = ENGLAB_BEGIN_DATA_R;
		makeVocaEbook($rootScope, ENGLAB_BEGIN_DATA_R)
	}
	if (num===1) $scope.stories = ENGLAB_BEGIN_DATA_W;
	if (num===2) $scope.stories = ENGLAB_BEGIN_DATA_S;
	if (num===3)
	{
		$scope.img_root = imgRootPath + 'lessons/'	
		$scope.stories = doMenu_book(ENGLAB_BEGIN_DATA_L);
		var idx = Helper_loadInt('lessonFor_unit', 0);
		$scope.fetchStory(idx, false);
		makeVocaEbook($rootScope, ENGLAB_BEGIN_DATA_L)
	}
	if (num===4) 
	{
		$scope.stories = doMenu_S_VOL5();
		makeVocaEbook($rootScope, ENGLAB_BEGIN_DATA_S_Vol5)
		var idx = Helper_loadInt('speakSameVol5_unit', 0);
		$scope.fetchStory(idx, false);
	}

	if (num===5) 
	{
		$scope.img_root = imgRootPath + 'sos/'	
		$scope.stories = doMenu_book(ENGLAB_BEGIN_DATA_Sheep_or_ship);
		makeVocaEbook($rootScope, ENGLAB_BEGIN_DATA_Sheep_or_ship)
		var idx = Helper_loadInt('sheep_or_ship_unit', 0);
		$scope.fetchStory(idx, false);
	}

	$scope.acc = -1;
	$scope.titles = showStoryTitles($scope.stories);

	if (!isLoadData) $scope.$apply();

	Helper_saveDB("ENGLAB_BEGIN_type", num);
}

$scope.acc_isShow = function (id) {
	return $scope.acc === id;
}

$scope.acc_click = function (id) {
	if($scope.acc===id) $scope.acc=-1;
	else 
	{
		$scope.acc = id;
		Helper_FetchStory(id, $scope, $rootScope, 'englabbegin_idx', false) 
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
	if ($scope.ielt_form === 3)
		return rootPath + "L_mp3/" + mp3File
	else if ($scope.ielt_form === 4)
		return rootPath + "S_Vol5_mp3/" + mp3File
	else if ($scope.ielt_form === 5)
		return rootPath + "s_o_s_mp3/" + mp3File
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	Helper_AudioLoop($scope, $rootScope);
});

$scope.fetchStory = function (idx, reset=true) 
{
	var key = 'speakSameVol5_unit'
	if ($scope.ielt_form === 3) key = 'lessonFor_unit'
	if ($scope.ielt_form === 5) key = 'sheep_or_ship_unit'
	Helper_FetchStory (idx, $scope, $rootScope, key, reset) 
}

function doMenu_S_VOL5()
{
	var en = ""
	var rgSen = /\d+\).*?((\.*\s*(<br>|<hr>))|(\!*\s*(<br>|<hr>))|(\?*\s*(<br>|<hr>))|('*\s*(<br>|<hr>))|("*\s*(<br>|<hr>))|[\.]+|\!|\?'")/gi
	for (var i = 0; i < ENGLAB_BEGIN_DATA_S_Vol5.length; i++) {
		var lesson = ENGLAB_BEGIN_DATA_S_Vol5[i]
		var questions = lesson.en.match(rgSen);
		en += '<b>' + (i+1) + ') ' + lesson.title + '</b><br>'
		for (var j = 0; j < questions.length; j++) {
			en += questions[j]
		}
	}
	var menu = {
		track: 'Menu',
		title: 'Lessons',
		en: en
	}
	var r = []
	r.push(menu)
	return r.concat(ENGLAB_BEGIN_DATA_S_Vol5)
}

function doMenu_book(bookData)
{
	var en = ""
	for (var i = 0; i < bookData.length; i++) {
		var lesson = bookData[i]
		var lTitle = lesson.title
		if (lTitle && lTitle.trim().length > 0)
		{
			if (en.indexOf(lTitle) >= 0) continue;
			// 01.01 -> 01
			var order = lesson.unit || ( (lesson.track + '').replace(/\..*/gi, '') )
			en += order + ') ' + lTitle + '<br>'
		}
	}
	var menu = {
		track: 'Menu',
		title: 'Lessons',
		en: en
	}
	var r = []
	r.push(menu)
	return r.concat(bookData)
}


$scope.loadData = function () {
	var cd = Helper_loadInt('ENGLAB_BEGIN_type', 0);
	ielt_formChange(cd, true);
	$scope.ielt_form = cd;
	document.beg_ielt_bForm.ielt_form.value = cd;
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});


});
