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
      for (var i = 4; i < params.length; i+=2) {
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

    service.getTransaction = function () {
      var reqOptions = service.buildGetTransactionOptions();
      return $http(reqOptions);
    };

    service.buildGetTransactionOptions = function() {
      var reqParams = _getExtraParams(_address.split("|"));
      return {
        params: reqParams,
        method: 'GET',
        url: service.getParsed().post_back
      };
    };

    service.postSignedRequest = function(txHex) {
      var reqParams = _getExtraParams(_address.split("|"));
      reqParams['tx'] = txHex;
      return $http({
        method: 'POST',
        url: service.getParsed().post_back,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: reqParams
      });
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

    service.signTransaction = function(transactionHex) {
        // var transactionHex = '0100000001ec1b4d4e416b0c19c768c27f44eb9b3d3cd99d5308b43ffa804bcf1895225931000000009300483045022100b3b8341baedf77192f95337ce1b6ed501493c7df90a29ef99fefc7c0039e4115022039422bd4687979fefd768bb4ae4cf5723dc82c39eb9c14b94d062dd81fdb4b79014c47522102d10e3c9440e2437fd84325d06dd27caf0408e003b778cc52245d642452e46b142103048d9636ce8dcea0df3fbad4acc62bfe98cdf62444259fb5af505c591259527352aeffffffff02c8000000000000001976a91453411509636407ebe2e5543d69ac8732b92274ce88ac88ef05000000000017a914dc21741cc36c24842201df24034f44ba1d8785688700000000';
        var tx = Bitcoin.Transaction.fromHex(transactionHex);
        var txb = Bitcoin.TransactionBuilder.fromTransaction(tx);
        if(tx.outs.length == 0) {
          alert('Error, invalid Transaction');
          return;
        }
        var pk = _getHDWalletDeterministicKey(service.crc16(_parsed.service));
        var pkWIF = pk.privateKey.toWIF();
        var keyPair = Bitcoin.ECKey.fromWIF(pkWIF);
        // console.log(keyPair);
        txb.sign(0, keyPair);
        return txb.build().toHex();
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
      return xpubB58;
    };

    service.processMPK = function() {
      var xpubB58 = _getDerivedXpub58();
      var reqObj = service.buildRequestMPKObject(xpubB58);
      var callbackURL = service.getParsed().post_back;
      var req = {
          method: 'POST',
          url: callbackURL,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          transformRequest: function(obj) {
              var str = [];
              for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              return str.join("&");
          },
          data: reqObj
      };

      return $http(req);
    };

    return service;
});
