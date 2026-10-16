var app = angular.module("lptdListenApp", ['toastr', 'baseListenApp']);
app.controller("lptdListenCtrl", function($scope, $rootScope, baseListenSubtitle) {
	baseListenSubtitle.create($scope, $rootScope, {
		data: (typeof LISTEN_DATA_LPTD !== 'undefined') ? LISTEN_DATA_LPTD : [],
		posKey: 'lstLptdLesson',
		starKey: 'lstLptdStar',
		groupLabel: 'LPTD',
		dbgName: '__lptdDbg',
		header: {
			eyebrow: 'LISTENING LAB',
			title: 'LPTD Listen',
			desc: 'Nghe + phụ đề chạy theo, chạm dòng để nhảy tới.',
			status: 'LPTD • 4 CDs'
		}
	});
});
