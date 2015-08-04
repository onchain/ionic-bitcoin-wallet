'use strict';

angular.module('copayApp.controllers').controller('bitidNoticeController',
  function($scope, $rootScope, addressParser, go, bitIDService) {
    if(!addressParser.isReady()) {
      go.walletHome();
    }
    $scope.title = "Request for Identification";
    $scope.site_address = addressParser.getSiteAddress();

    $scope.cancel = function() {
      go.walletHome();
    };

    $scope.ok = function() {
      var postData = bitIDService.generateSignatureMessage();
      bitIDService.postMessage(postData);
    }
  });
