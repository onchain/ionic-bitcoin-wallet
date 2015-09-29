'use strict';

angular.module('copayApp.services')
  .factory('addressParser', function() {

    var _address = '';
    var service = {};

    service.setAddress = function(href) {
      _address = href;
    };

    service.isBitID = function(address) {
      return /^(bitid:).*$/.test(address);
    };

    service.isOnChain = function(address) {
      var params = address.split("|");
      return params.length > 3;
    };

    return service;

  });
