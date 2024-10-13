// include other *.js
document.write('<script src="./ebooks/barron600/listen_data/barron600_listen_data.js" type="text/javascript"></script>');

var app = angular.module("barron600LApp", []);
app.controller("barron600LCtrl", function($scope, $rootScope, $timeout) {

var kSTORIES = barron600_listen_data;
$scope.cd = 1;
$scope.stories = kSTORIES;
$scope.storyIdx = 0;

radioLoopChange = function (val) {
    localStorage.setItem(Helper_AudioLoopSaveKey, val);
}

$scope.createAudioSrc = function() {
    return "./ebooks/barron600/listen_data/audio/" + $scope.story.track + '.mp3';
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
    $scope.whenAudioEnded();
});

$scope.whenAudioEnded = function()
{
    var nextStoryIdx = $scope.storyIdx;
    var loopRadio = $rootScope[kAudioLoopSaveKey];
    if (loopRadio === 2) // play next
    {
        nextStoryIdx = $scope.storyIdx + 1;
        if (nextStoryIdx > kSTORIES.length-1) { nextStoryIdx = 0 }; 
        $scope.storyIdx = nextStoryIdx;
        $scope.fetchStory($scope.storyIdx, true);
    }
    if (loopRadio !== 0) // loop
    {
        $scope.$broadcast('child_playFullSound')  
    }
}

$scope.fetchStory = function (idx, reset=true) {
	if (reset==true) 
    {
        $scope.$broadcast("child_stopSound");
    }

    $scope.stories = kSTORIES;
    $scope.storyIdx = idx;
    $scope.story = $scope.stories[idx];

    $rootScope.audioSrc = $scope.createAudioSrc();

    // save DB
    localStorage.setItem("barron600_unit", idx);
    if (!$scope.story) {MYLOG('Dont have Unit'); return;}
    
    $scope.story = processStory($scope.story);
}

$scope.loadData = function () {
    if (localStorage.hasOwnProperty("barron600_idx")) {
        idx = localStorage.barron600_idx;
        $scope.storyIdx = parseInt(idx);
    }

    $scope.fetchStory($scope.storyIdx, false);
};

$scope.$on('$viewContentLoaded', function(){
    $scope.loadData();
});

});
