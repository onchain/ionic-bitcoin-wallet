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
      var callbackURL = service.getParsed().post_back;
      return {
        transformResponse: undefined,
        params: reqParams,
        method: 'GET',
        url: callbackURL
      };
    };

    service.postSignedRequest = function(signature) {
      var reqParams = _getExtraParams(_address.split("|"));
      reqParams['tx'] = signature[0];
      reqParams['meta_data'] = signature[1];
      var callbackURL = service.getParsed().post_back;
      return $http({
        method: 'POST',
        url: callbackURL,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        transformResponse: undefined,
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
      
      var txHex = transactionHex;
      var sigList = null;
      if(transactionHex.indexOf(':') != -1) {
        txHex = transactionHex.substring(0, transactionHex.indexOf(':'));
        sigList = transactionHex.substring(transactionHex.indexOf(':') + 1, transactionHex.length);
      }
      var tx = Bitcoin.Transaction.fromHex(txHex);
      var txb = Bitcoin.TransactionBuilder.fromTransaction(tx);
      if(tx.outs.length == 0) {
        alert('Error, invalid Transaction');
        return;
      }
      var pk = _getHDWalletDeterministicKey(service.crc16(_parsed.service));
      var pkWIF = pk.privateKey.toWIF();
      var keyPair = Bitcoin.ECPair.fromWIF(pkWIF);
      //txb.sign(0, keyPair);
      //var signedHex = txb.build().toHex();
      var signedHex = txHex;
      if(sigList != null) {
        sigList = _signSignatureList(keyPair, sigList);
      }
      
      return [signedHex, sigList];
    };
     
    var _signSignatureList = function(key, sigList) {
      
      // Get a buffer
      var Bitcore = bwcService.getBitcore();
      
      var sigs = JSON.parse(sigList);
      
      var pk = key.getPublicKeyBuffer().toString('hex');
      
      for(var x = 0; x < sigs.length; x++) {
        
          var public_key = Object.keys(sigs[x])[0];
          if(public_key == pk) {
            var hash_to_sign = sigs[x][public_key]['hash']
            var signed_hash = key.sign_hex_hash(hash_to_sign).toDER().toString("hex");
            sigs[x][public_key]['sig'] = signed_hash;
          } 
      }
      
      return JSON.stringify(sigs);
    }; 

    var _getHDWalletDeterministicKey = function(idx) {
      var fc = profileService.focusedClient;
      var Bitcore = bwcService.getBitcore();
      var HDPrivateKey = Bitcore.HDPrivateKey;
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
          transformResponse: undefined,
          data: reqObj
      };

      return $http(req);
    };

    return service;
});
