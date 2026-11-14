var app = angular.module("tiktokListenApp", ['toastr', 'baseListenApp']);
app.controller("tiktokListenCtrl", function($scope, $rootScope, baseListenSubtitle) {
	baseListenSubtitle.create($scope, $rootScope, {
		data: (typeof LISTEN_DATA_TIKTOK !== 'undefined') ? LISTEN_DATA_TIKTOK : [],
		posKey: 'lstTiktokLesson',
		starKey: 'lstTiktokStar',
		groupLabel: 'TikTok',
		dbgName: '__tiktokListenDbg',
		header: {
			eyebrow: 'LISTENING LAB',
			title: 'TikTok',
			desc: 'TikTok clips - listen with subtitles.',
			status: 'TikTok'
		}
	});
});
