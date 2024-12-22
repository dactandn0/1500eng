// include other *.js

document.write('<script src="./ebooks/bridge/listen_data/bridge_cd1.js" type="text/javascript"></script>');
document.write('<script src="./ebooks/bridge/listen_data/bridge_cd2.js" type="text/javascript"></script>');

var app = angular.module("bridgeLApp", ['ngSanitize']);
app.controller("bridgeLCtrl", function($scope, $rootScope, $timeout) {

$scope.cd = 1;
$scope.stories = bridge_cd1; //1
$scope.storyIdx = 0;

radioCDChange = function (cd) {
	$scope.cd = cd;
	if (cd===1) {
		$scope.stories = bridge_cd1;
	}
}

$scope.createAudioSrc = function() {
	return "./ebooks/bridge/listen_data/cd" + $scope.cd + "/" + $scope.story.idx + '.mp3';
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	Helper_AudioLoop($scope);
});

$scope.fetchStory = function (idx, reset=true) 
{
	Helper_FetchStory (idx, $scope, $rootScope, "bridgeL_unit", reset) 
}

$scope.loadData = function () {
	$scope.storyIdx = Helper_loadInt( 'bridgeL_unit', 0 );
	$scope.fetchStory($scope.storyIdx, false);
};

$scope.$on('$viewContentLoaded', function(){
	$scope.loadData();
});

});
