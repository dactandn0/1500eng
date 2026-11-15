var app = angular.module("aefWbListenApp", ['toastr', 'baseListenApp']);
app.controller("aefWbListenCtrl", function($scope, $rootScope, baseListenSubtitle) {
	baseListenSubtitle.create($scope, $rootScope, {
		data: (typeof LISTEN_DATA_AEF_5_WB !== 'undefined') ? LISTEN_DATA_AEF_5_WB : [],
		posKey: 'lstAefWbLesson',
		starKey: 'lstAefWbStar',
		groupLabel: 'AEF 5 WB',
		dbgName: '__aefWbDbg',
		header: {
			eyebrow: 'American English File v3',
			title: 'WorkBook 5',
			desc: '10 units.',
			status: '10 Units'
		}
	});
});
