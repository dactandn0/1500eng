
var app = angular.module("myApp", ['ngSanitize']);
app.controller("ctrl", function($scope, $timeout) {

$scope.songs = SONGS;

$scope.songIdx = 0;

$scope.bPlaying = false;
$scope.bPlayingFull = false;
$scope.bPause = false;

$scope.audio;
$scope.acc=-1;

$scope.acc_isShow = function (id) {
	return $scope.acc===id;
};

$scope.acc_click = function (id) {
	if($scope.acc===id) $scope.acc=-1;
	else
		$scope.acc=id;
};

$scope.stopSound = function () {
	if (!$scope.audio) return;
	 $scope.audio.pause();
	 $scope.audio.currentTime = 0;
	 $scope.currentTime = 0;
	 $scope.bPlaying = false;
};

$scope.playAtTime = function (time, songIdx) {
	console.log('playAtTime', songIdx, time)
	$scope.stopSound();
	$scope.audio = undefined;

	var song = $scope.songs[songIdx];
	$scope.audio = new Audio( song.title + '.mp3' );
    $scope.audio.loop = true;

	$scope.audio.currentTime = time;
	$scope.audio.play();
	$scope.bPlaying = true;

	$scope.audio.addEventListener("ended", function(){
		$scope.bPlaying = false;
	});

}

$scope.fetchSong = function (idx) {

}

$scope.loadDB = function (idx) {
if (localStorage.hasOwnProperty("sing_song_loop")) {
		document.getElementById('audioLoopEle').checked = localStorage.sing_song_loop === 'true';
	}
}

$scope.preProcessSongs = function () {
	for (var i = 0; i < $scope.songs.length; i++) {
		var song  = $scope.songs[i]
		var lyrics  = song.lyrics;
		for (var j = 0; j < lyrics.length; j++) {
			var txt = lyrics[j].txt;
			lyrics[j].txt = txt.replace(/\s*\.\s*/g, "<br>");
		}
	}
}

$scope.loadDB();
$scope.preProcessSongs();


});

