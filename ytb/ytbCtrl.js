// include data
document.write('<script src="./ytb/ytb_data.js" type="text/javascript"></script>');

var app = angular.module("ytbApp", ['ngSanitize']);
app.controller("ytbCtrl", function($scope, $rootScope, $sce) {

function ytbId(url) {
	var m = String(url || '').match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([A-Za-z0-9_-]{6,})/);
	return m ? m[1] : '';
}

$scope.videos = (typeof YTB_DATA !== 'undefined' ? YTB_DATA : []).map(function (v) {
	var id = ytbId(v.url);
	return {
		title: v.title || id,
		embed: id ? 'https://www.youtube.com/embed/' + id : ''
	};
});

$scope.trust = function (url) {
	try { return $sce.trustAsResourceUrl(url); } catch (e) { return url; }
};

});
