var app = angular.module("aefWbListenApp", ['toastr', 'baseListenApp']);
app.controller("aefWbListenCtrl", function($scope, $rootScope, baseListenSubtitle) {
	baseListenSubtitle.create($scope, $rootScope, {
		data: (typeof LISTEN_DATA_AEF_5_WB !== 'undefined') ? LISTEN_DATA_AEF_5_WB : [],
		posKey: 'lstAefWbLesson',
		starKey: 'lstAefWbStar',
		groupLabel: 'AEF 5 WB',
		dbgName: '__aefWbDbg',
		header: {
			eyebrow: 'LISTENING LAB',
			title: 'American English File v3 WB 5',
			desc: 'American English File 5 WB - 10 units.',
			status: 'AEF 5 WB - 10 Units'
		}
	});
});
