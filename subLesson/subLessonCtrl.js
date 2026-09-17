document.write('<script src="./subLesson/subLesson_data.js" type="text/javascript"></script>');
document.write('<script src="./subLesson/subLesson_data2.js" type="text/javascript"></script>');
document.write('<script src="./subLesson/subLesson_data3.js" type="text/javascript"></script>');
document.write('<script src="./subLesson/subLesson_nail_data.js" type="text/javascript"></script>');

var app = angular.module("subLessonApp", ['ngSanitize']);
app.controller("subLessonCtrl", function($scope, $rootScope, $timeout) {

	// Tat ca data file deu 2D: [{ category, content: [...] }].
	var GROUPS2D = SUBLESSON_NAIL_DATA.concat(SUBLESSON_DATA3).concat(SUBLESSON_DATA2).concat(SUBLESSON_DATA);
	var kDATA = [];
	GROUPS2D.forEach(function (gd) { kDATA = kDATA.concat((gd && gd.content) || []); });

	$scope.img_root = './subLesson/images';

	$scope.stories = kDATA;

	// Nhom hien thi 2D cho storyR2.html (giua flat index de fetchStory/accordion dung chung).
	$scope.groups = [];
	(function () {
		var idx = 0, k, g, c;
		for (k = 0; k < GROUPS2D.length; k++) {
			g = GROUPS2D[k] || {};
			c = g.content || [];
			$scope.groups.push({
				category: g.category || ('Group ' + (k + 1)),
				startIdx: idx,
				titles: titlesFor(c)
			});
			idx += c.length;
		}
		function titlesFor(stories) {
			var o = { stories: stories };
			showStoryTitles(o);
			return o.titles;
		}
	})();
	$scope.storyId = -1;
	$scope.acc = -1;
	$scope.gacc = 0; // nhom dang mo (startIdx), -1 = dong het

	$scope.gacc_isShow = function (id) {
		return $scope.gacc === id;
	}

	$scope.gacc_click = function (id) {
		if ($scope.gacc === id) $scope.gacc = -1;
		else $scope.gacc = id;
	}

	$scope.acc_isShow = function(id) {
		return $scope.acc === id;
	}

	$scope.acc_click = function(id) {
		if ($scope.acc === id) $scope.acc = -1;
		else {
			$scope.acc = id;
			Helper_FetchStory(id, $scope, $rootScope, 'subLe_DATA_idx', false)
			// doi accordion render xong roi scroll toi bai
			$timeout(function () {
				try {
					var el = document.getElementById('slstory-' + id);
					if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
				} catch (e) {}
			}, 80);
		}
	};

	$scope.loadData = function() {};

	$scope.loadData();

});