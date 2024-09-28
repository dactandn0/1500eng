
document.write('<script src="./words3000/3k_words_data.js" type="text/javascript"></script>');
document.write('<script src="./words3000/5k_ielt_words.js" type="text/javascript"></script>');
document.write('<script src="./words3000/4k_words_data.js" type="text/javascript"></script>');
document.write('<script src="./words3000/4k_words_data_make.js" type="text/javascript"></script>');


var app = angular.module("words3000App", [
	'ngSanitize','ngRoute', 'ui.bootstrap','ngAnimate'
	]);
app.controller("words3000Ctrl", function($scope, $timeout, $uibModal) {

var words3000As = this;
words3000As.open = function (dataSent) {
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'modal.html',
      controller: 'ModalInstanceCtrl',
      controllerAs:"words3000As",
      // size: 'sm',
      windowClass: 'show',
      resolve: {
        data: function () {
          return dataSent;
        }
      }
    });

    modalInstance.result.then(function () {
    });
};

var kSTORIES = WORDS_3K_DATA
	.concat(IELTS_5K_DATA)
	.concat(word_4000_data);

var kDocuments = lptd_cd1_stories
	.concat(lptd_cd2_stories)
//	.concat(lptd_cd3_stories);

$scope.stories = kSTORIES;
$scope.storyTitles = []; 
$scope.storyId = -1;
$scope.story = {};
$scope.acc = -1;
$scope.words = [];

$scope.acc_isShow = function (id) {
	return $scope.acc===id;
};

$scope.acc_click = function (id) {
	if($scope.acc===id) {
		$scope.acc = -1; 
		return;
	}
	else {
		$scope.acc = id;
	}

	$scope.story = kSTORIES[$scope.acc];
	$scope.words = $scope.story.en.split("<br>");
	_scrollIntoView(id);
	localStorage.setItem("w3000_idx", id);
};

$scope.getExample = function(idx) {
	var word = $scope.words[idx].split(" ")[0];
	var ptrn = new RegExp(String.raw`[^\.\?!<>:]*\b${word}[s|es]*\b.*?[\?|\.|!]+?`, 'gi');
	console.log(ptrn)
	for (var i = 0; i < kDocuments.length; i++) {
		var para = kDocuments[i].en.replaceAll(":", '.');
		var results = para.match(ptrn);
		if (results) {
			words3000As.open(results);
			break;
		}
	}
}

$scope.preProcess = function () {
	for (var k = 0; k < kSTORIES.length; k++) {
		var story = $scope.stories[k];
		var words = story.en.split('<br>');
		$scope.storyTitles.push({'title':story.title,'num':words.length});
	}
}

$scope.loadData = function () {
	if (localStorage.hasOwnProperty("w3000_idx")) {
		$scope.acc_click( Number(localStorage.w3000_idx)  );
	}
	$scope.preProcess();
};

 $scope.$on('$viewContentLoaded', function(){
  });

$scope.loadData();

});



app.controller('ModalInstanceCtrl', function ($uibModalInstance, data) {
  var words3000As = this;
  words3000As.data = data;
  
  words3000As.ok = function () {
    $uibModalInstance.close();
  };

  words3000As.cancel = function () {
    //{...}
 //   alert("You clicked the cancel button."); 
    $uibModalInstance.dismiss('cancel');
  };
});
