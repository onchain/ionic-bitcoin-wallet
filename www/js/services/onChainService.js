'use strict';

angular.module('copayApp.services')
  .factory('onChainService', function(bwcService, profileService, lodash, $http) {
    var service = {};
    var _parsed = {};
    var _address = '';

    service.setAddress = function(href) {
      _address = href;
      _parsed = _parseCommand(_address);
    };

    var _getExtraParams = function (params) {
      var result = {};
      for (var i = 4; i < params.length; i++) {
        result[params[i-1]] = params[i];
      }
      return result;
    }

    var _parseCommand = function _parseCommand(href) {
      var params = href.split("|");
      var result = {};
      if(params.length >= 3) {
        result = {
          cmd: params[0],
          service: params[1],
          post_back: params[2]
        };
        var extras = _getExtraParams(params);
        lodash.extend(result, result, extras);
      }
      return result;
    };

    service.getParsed = function() {
      if(_parsed == '') {
        _parseCommand();
      }
      return _parsed;
    };

    //@TODO Extract to SignUtils service
    service.crc16 = function(addr, idx) {
      if(idx == undefined) {
        var idx = 0;
      }
      var sha256URL = Bitcoin.crypto.sha256(addr);
      var sha32uri = sha256URL.readInt32LE(1);
      return "m/0'/0xb11e'/"+sha32uri+"/"+idx;
    };

    var _getHDWalletDeterministicKey = function(idx) {
      var fc = profileService.focusedClient;
      var utils = bwcService.getUtils();
      var HDPrivateKey = utils.Bitcore.HDPrivateKey;
      var retrieved = new HDPrivateKey(fc.credentials.xPrivKey);
      var derivedByArgument = retrieved.derive(idx);
      return derivedByArgument;
    };

    service.buildRequestMPKObject = function(mpk) {
      var result = lodash.omit(service.getParsed(), ['cmd', 'service', 'post_back']);
      result['mpk'] = mpk;
      return result;
    };

    var _getDerivedXpub58 = function () {
      var derivedKey = _getHDWalletDeterministicKey(service.crc16(_parsed.service));
      var xpubB58 = derivedKey.hdPublicKey.xpubkey;
    };

    service.processMPK = function() {
      var xpubB58 = _getDerivedXpub58();
      var reqObj = service.buildRequestMPKObject(xpubB58);
      var callbackURL = service.getParsed().post_back;
      var req = {
          method: 'POST',
          url: callbackURL,
          headers: {
            'Content-Type': 'application/json'
          },
          data: reqObj
      };

      return $http(req);
    };

    return service;
});
