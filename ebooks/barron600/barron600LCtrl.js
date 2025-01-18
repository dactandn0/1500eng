// include other *.js
document.write('<script src="./ebooks/barron600/listen_data/barron600_listen_data.js" type="text/javascript"></script>');

var app = angular.module("barron600LApp", []);
app.controller("barron600LCtrl", function($scope, $rootScope, $timeout) {

$scope.cd = 1;
$scope.stories = barron600_listen_data;
$scope.storyIdx = 0;

radioLoopChange = function (val) {
    localStorage.setItem(Helper_AudioLoopSaveKey, val);
}

$scope.createAudioSrc = function() {
    return "./ebooks/barron600/listen_data/audio/" + $scope.story.track + '.mp3';
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
   Helper_AudioLoop($scope, $rootScope);
});

$scope.fetchStory = function (idx, reset=true) 
{
    Helper_FetchStory (idx, $scope, $rootScope, "barron600L_idx", reset) 
}

$scope.loadData = function () {
    $scope.storyIdx = Helper_loadInt('barron600L_idx', 0);
    $scope.fetchStory($scope.storyIdx, false);
};

$scope.$on('$viewContentLoaded', function(){
    $scope.loadData();
});

});
