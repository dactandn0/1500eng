

var app = angular.module("modalApp", [
	'ui.bootstrap','ngAnimate'
	]);

app.controller('modal.alert', ['$scope', '$uibModalInstance', 'data', function($scope, $uibModalInstance, data) {
$scope.data = data;

    $scope.ok = function() {
        $uibModalInstance.close();
    };

    $scope.close = function() {
        $uibModalInstance.close();
    };

    $scope.shuffleFromModal = function(wordFull) {
        $scope.data.dataSent = IndexCtrlScope.fetchSentences(wordFull);
    };

}]);


app.controller('modal.confirm', ['$scope', '$uibModalInstance', 'data', function($scope, $uibModalInstance, data) {
$scope.data = data;

$scope.ok = function() {
    $uibModalInstance.close();
};

$scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
};
}])

app.service('appAlert', ['$uibModal', function($uibModal, $http) {
    this.alert = function(data, callback) {
        var modalInstance = $uibModal.open({
            animation: false,
            windowClass: 'show',
            templateUrl: 'modal/alert.html',
            controller: 'modal.alert',
            backdrop: 'static',
            resolve: {
                data: function() {
                    return data;
                }
            }
        });
    };

    this.confirm = function(data, callback) {
        var modalInstance = $uibModal.open({
            animation: false,
            windowClass: 'show',
            templateUrl: 'modal/confirm.html',
            controller: 'modal.confirm',
            backdrop: 'static',
            resolve: {
                data: function() {
                    return data;
                }
            }
        });

        modalInstance.result.then(function() {
            return callback(true);
        }, function() {
            return callback(false);
        });
        /*end modal*/
    };
}])
