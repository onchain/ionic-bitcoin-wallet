'use strict';

angular.module('copayApp.controllers').controller('bitidNoticeController',
  function($scope, $rootScope, addressParser, go) {
    if(!addressParser.isReady()) {
      go.walletHome();
    }
    $scope.title = "Request for Identification";
    $scope.site_address = addressParser.getSiteAddress();

    $scope.cancel = function() {
      go.walletHome();
    };
  });
