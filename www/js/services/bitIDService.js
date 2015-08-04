'use strict';

angular.module('copayApp.services')
  .factory('bitIDService', function(profileService, bwcService, addressParser, $http) {
    var service = {};

    service.generateSignature = function() {
      var fc = profileService.focusedClient;
      if (fc.isPrivKeyEncrypted()) {
        profileService.unlockFC(function(err) {
          if (err) {
            parseError(err);
            $scope.error = err;
            return;
          }
          return service.signMessage();
        });
        return;
      };
      var utils = bwcService.getUtils();
      var HDPrivateKey = utils.Bitcore.HDPrivateKey;
      var HDPublicKey = utils.Bitcore.HDPublicKey;
      var PrivateKey = utils.Bitcore.PrivateKey;
      var retrieved = new HDPrivateKey(fc.credentials.xPrivKey);
      var derivedByArgument = retrieved.derive("m/0'/0xb11e'/489237833/0");
      var derPriv = derivedByArgument.privateKey;
      console.log("Chave privada", derPriv);
      // console.log(utils.Bitcore.crypto.Hash.sha256(addressParser.getBitIDURI()));
      var message = addressParser.getMessageToSign();
      var signed = utils.signMessage(message, derPriv);
      var pubKey = derivedByArgument.publicKey.toString();
      console.log("Chave pública", derivedByArgument.publicKey.toObject());
      console.log("Signed Message", signed);
      var verif = utils.verifyMessage(message, signed, derivedByArgument.publicKey);
      console.log("Verified: ", verif);
      var fullMessage = service.createMessage(signed, pubKey);
      console.log(fullMessage);
      return signed;
    };

    service.createMessage = function(signature, pubKey) {
      var fc = profileService.focusedClient;
      var message = {
        uri: addressParser.getFullCallbackURI(),
        address: pubKey,
        signature: signature
      }
      return message;
    };

    service.postMessage = function(message) {
      console.log(message);
      // var callbackURL = addressParser.getCallBackURL();
      // $http.post(callbackURL, message).success(function(data, status, headers, config) {
      //   console.log("SUCCESS");
      //   console.log(data);
      //   console.log(status);
      //   console.log(headers);
      //   console.log(config);
      // }).
      // error(function(data, status, headers, config) {
      //   console.log("ERROR");
      //   console.log(data);
      //   console.log(status);
      //   console.log(headers);
      //   console.log(config);
      // });
    };

    return service;
  });
