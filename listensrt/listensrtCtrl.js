var app = angular.module("listensrtApp", ['toastr', 'baseListenApp']);
app.controller("listensrtCtrl", function($scope, $rootScope, baseListenSubtitle) {
	baseListenSubtitle.create($scope, $rootScope, {
		data: (typeof LISTEN_DATA !== 'undefined') ? LISTEN_DATA : [],
		posKey: 'lstLesson',
		starKey: 'lstStar',
		groupLabel: (typeof LISTEN_GROUPS_LABEL !== 'undefined') ? LISTEN_GROUPS_LABEL : '',
		dbgName: '__watchDbg',
		header: {
			eyebrow: 'LISTENING LAB',
			title: 'Listen with Subtitle',
			desc: 'Xem video/Audio, phụ đề chạy theo, chạm dòng để nhảy tới.',
			status: 'TRY HARD'
		}
	});
});
