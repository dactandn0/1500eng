var app = angular.module("aefListenApp", ['toastr', 'baseListenApp']);
app.controller("aefListenCtrl", function($scope, $rootScope, baseListenSubtitle) {
	baseListenSubtitle.create($scope, $rootScope, {
		data: (typeof LISTEN_DATA_AEF_5_SB !== 'undefined') ? LISTEN_DATA_AEF_5_SB : [],
		posKey: 'lstAefLesson',
		starKey: 'lstAefStar',
		groupLabel: 'AEF 5 SB',
		dbgName: '__aefDbg',
		header: {
			eyebrow: 'LISTENING LAB',
			title: 'AEF 5 SB Listen',
			desc: 'American English File 5 Student Book audio - 10 units.',
			status: 'AEF 5 SB - 10 Units'
		}
	});
});
