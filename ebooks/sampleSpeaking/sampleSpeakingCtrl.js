
document.write('<script src="./ebooks/sampleSpeaking/listen_data/data.js" type="text/javascript"></script>');


var app = angular.module("sampleSpeakingApp", []);
app.controller("sampleSpeakingCtrl", function($scope, $rootScope, $timeout) {

var kSTORIES = listen_tracks;

$scope.cd = 1;
$scope.stories = kSTORIES; //1
$scope.story;
$scope.titles = []; 

$scope.acc = -1;
$scope.storyIdx = 0;

$scope.acc_isShow = function (id) {
	return $scope.acc===id;
};

$scope.acc_click = function (id) {
	if($scope.acc===id) $scope.acc=-1;
	else
		$scope.acc=id;

	$scope.storyIdx = id;
	$scope.process();
	$rootScope.audioSrc = $scope.createAudioSrc();
};

$scope.createAudioSrc = function() {
	return "./ebooks/sampleSpeaking/listen_data/audio/" + kSTORIES[$scope.storyIdx].track + '.mp3';
}

$scope.$on('parent_whenAudioEnded', function(event, message) {
	$scope.whenAudioEnded();
});

$scope.whenAudioEnded = function()
{
	var nextStoryIdx = $scope.storyIdx;
    var loopRadio = Helper_loadAudioLoop();
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

$scope.storyTitles = function () {
	return showStoryTitles(kSTORIES)
}

$scope.init = function () {
	for (var i = 0; i < $scope.stories.length; i++) {
		var title = $scope.stories[i].title;
		$scope.titles.push(title)
	}
}

$scope.process = function () {
	var story = kSTORIES[$scope.storyIdx];
	story = processStory(story);
	story.enShow = story.enShow.replaceAll('Candidate', '<b>Candidate</b>');
	story.viShow = story.viShow.replaceAll('Candidate', '<b>Candidate</b>');
	story.enShow = story.enShow.replaceAll('Examiner', '<b>Examiner</b>');
	story.viShow = story.viShow.replaceAll('Examiner', '<b>Examiner</b>');

	$scope.story = story;
}

$scope.loadData = function () {
};

$scope.loadData();

});