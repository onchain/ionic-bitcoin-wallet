'use strict';

angular.module('copayApp.services')
  .factory('addressParser', function() {

    var _address = '';
    var service = {};
    service.TYPES = {bitid: 'bitid', onchain: 'onchain', other: 'other', none: 'none'};
    var _type = service.TYPES.none;

    service.setAddress = function(href) {
      _address = href;
      _detectType(href);
    };

    service.getType = function getType() {
      return _type;
    }

    var _detectType = function(address) {
      if(service.isBitID(address)) {
        _type = service.TYPES.bitid;
      } else if(service.isOnChain(address)) {
        _type = service.TYPES.onchain;
      } else {
        _type = service.TYPES.none;
      }
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
