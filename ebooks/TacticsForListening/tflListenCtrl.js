var app = angular.module("tflListenApp", ['toastr', 'baseListenApp']);

// Dung lai template chung nhung KHONG tao scope con (scope: false):
// baseListenSubtitle.html co ng-model/ng-focus tren bien primitive cua scope,
// neu boc bang ng-include (tao scope con) thi cac binding do se bi shadow.
app.directive('tflListenPage', function() {
	return {
		restrict: 'A',
		templateUrl: './includes/baseListenSubtitle.html',
		scope: false
	};
});

app.controller("tflListenCtrl", function($scope, $rootScope, baseListenSubtitle) {
	baseListenSubtitle.create($scope, $rootScope, {
		data: (typeof LISTEN_DATA_TFL !== 'undefined') ? LISTEN_DATA_TFL : [],
		posKey: 'lstTflLesson',
		starKey: 'lstTflStar',
		groupLabel: 'TFL',
		dbgName: '__tflDbg',
		header: {
			eyebrow: 'LISTENING LAB',
			title: 'TFL Listen',
			desc: 'Tactics for Listening - Basic & Developing 1-24. Nghe + phụ đề chạy theo, chạm dòng để nhảy tới.',
			status: 'TFL • Basic & Developing'
		}
	});
});
