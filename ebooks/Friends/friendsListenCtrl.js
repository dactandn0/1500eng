var app = angular.module("friendsListenApp", ['toastr', 'baseListenApp']);
app.controller("friendsListenCtrl", function($scope, $rootScope, baseListenSubtitle) {
	baseListenSubtitle.create($scope, $rootScope, {
		data: (typeof LISTEN_DATA_FRIENDS !== 'undefined') ? LISTEN_DATA_FRIENDS : [],
		posKey: 'lstFriendsLesson',
		starKey: 'lstFriendsStar',
		groupLabel: 'Friends',
		dbgName: '__friendsDbg',
		header: {
			eyebrow: 'LISTENING LAB',
			title: 'Friends',
			desc: 'Friends TV series - listen with subtitles.',
			status: 'Friends - Season 1'
		}
	});
});
