// include data
document.write('<script src="./media/media_data.js" type="text/javascript"></script>');

var app = angular.module("mediaApp", ['ngSanitize']);
app.controller("mediaCtrl", function($scope, $rootScope, $sce) {

$scope.tab = 'video'; // 'video' | 'image'
$scope.setTab = function (t) {
	$scope.tab = t;
};

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

$scope.images = (typeof IMG_DATA !== 'undefined' ? IMG_DATA : []).map(function (v) {
	var src = v.src || '';
	// ten file tran (pic1.png, photo.jpeg) -> tu hieu media/images/
	if (src && src.indexOf('/') < 0 && src.indexOf('http') !== 0 && src.indexOf('data:') !== 0) {
		src = 'media/images/' + src;
	}
	return {
		title: v.title || '',
		src: src
	};
});

$scope.trust = function (url) {
	try { return $sce.trustAsResourceUrl(url); } catch (e) { return url; }
};

});
