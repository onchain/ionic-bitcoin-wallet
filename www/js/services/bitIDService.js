'use strict';

angular.module('copayApp.services')
  .factory('bitIDService', function(profileService, bwcService, addressParser, $http) {
    var service = {};

    service.generateSignatureMessage = function() {
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
      var retrieved = new HDPrivateKey(fc.credentials.xPrivKey);
      var sha256URL = Bitcoin.crypto.sha256(addressParser.getBitIDSiteURI());
      var sha32uri = sha256URL.readInt32LE(1);
      var derivedByArgument = retrieved.derive("m/0'/0xb11e'/"+sha32uri+"/0");
      var derPriv = derivedByArgument.privateKey;
      var derivedWIF = derPriv.toWIF();
      var keyPair = Bitcoin.ECKey.fromWIF(derivedWIF);
      var message = addressParser.getMessageToSign();
      var signedMessage = Bitcoin.Message.sign(keyPair, message);
      var signed = signedMessage.toString('base64');
      var pubKeyAddress = keyPair.pub.getAddress().toBase58Check();
      var fullMessage = service.createMessage(signed, pubKeyAddress);
      return fullMessage;
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
      var callbackURL = addressParser.getCallBackURL();
      var req = {
          method: 'POST',
          url: callbackURL,
          headers: {
            'Content-Type': 'application/json'
          },
          data: message
      };

      $http(req).then(function(data, status, headers, config) {
        console.log("SUCCESS");
        console.log(data);
        console.log(status);
        console.log(headers);
        console.log(config);
      }, function(data, status, headers, config) {
        console.log("ERROR");
        console.log(data);
        console.log(status);
        console.log(headers);
        console.log(config);
      });
    };

    return service;
  });
