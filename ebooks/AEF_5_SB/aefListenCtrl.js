var app = angular.module("aefListenApp", ['toastr', 'baseListenApp']);
app.controller("aefListenCtrl", function($scope, $rootScope, baseListenSubtitle) {
	baseListenSubtitle.create($scope, $rootScope, {
		data: (typeof LISTEN_DATA_AEF_5_SB !== 'undefined') ? LISTEN_DATA_AEF_5_SB : [],
		posKey: 'lstAefLesson',
		starKey: 'lstAefStar',
		groupLabel: 'AEF 5 SB',
		dbgName: '__aefDbg',
		header: {
			eyebrow: 'American English File v3',
			title: 'Student Book 5',
			desc: '10 units.',
			status: '10 Units'
		}
	});
});
