'use strict';

angular.module('copayApp.controllers').controller('bitidNoticeController',
  function($scope, $modal, $rootScope, go, bitIDService, configService) {
    if(!bitIDService.isReady()) {
      go.walletHome();
    }
    $scope.loading = false;
    var config = configService.getSync();
    $scope.backgroundColor = config.colorFor[self.walletId] || '#4A90E2';

    $scope.title = "Request for Identification";
    $scope.site_address = bitIDService.getSiteAddress();

    $scope.cancel = function() {
      go.walletHome();
    };

    var responcePopup = function(message) {
      $scope.loading = false;
      var ModalInstanceCtrl = function($scope, $modalInstance, gettext) {
        $scope.title = 'BitID';
        $scope.loading = false;
        $scope.message = message;

        $scope.ok = function() {
          $scope.loading = true;
          $modalInstance.close('ok');
        };
      };

      var modalInstance = $modal.open({
        templateUrl: 'views/modals/bitid-response.html',
        windowClass: 'full animated slideInUp',
        controller: ModalInstanceCtrl
      });

      modalInstance.result.then(function(ok) {
        if (ok) {
          go.walletHome();
        }
      });
    };

    $scope.ok = function() {
      $scope.loading = true;
      var postData = bitIDService.generateSignatureMessage();
      bitIDService.postMessage(postData).then(function(data, status, headers, config) {
        responcePopup('Authentication successful');
      }, function(data, status, headers, config) {
        responcePopup('Authentication failed, try again.');
      });
    }
  });
