'use strict';

angular.module('copayApp.services')
  .factory('bitIDService', function(profileService, bwcService, $http) {
    var service = {};
    var _parsed = {};
    var _address = '';

    var _parseURI = function() {
      var reURLInformation = new RegExp([
        '^(bitid)://', // protocol
        '(([^:/?#]*)(?::([0-9]+))?)', // host (hostname and port)
        '(/[^?#]*)', // pathname
        '.x=([^\\&u=]*|)', // NONCE
        '.(u=[^#]*|)' // IS UNSECURE
      ].join(''));
      var match = _address.match(reURLInformation);
      _parsed = match && {
        href: _address,
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        nonce: match[6],
        unsecure: match[7]
      };
    };

    service.setAddress = function(href) {
      _address = href;
      _parseURI();
    };

    var _getBitIDSiteURI = function() {
      return _parsed.protocol + ":" + _parsed.host + _parsed.pathname;
    };

    var _getFullCallbackURI = function() {
      return _getParsed().href;
    };

    var _getMessageToSign = function() {
      return _getFullCallbackURI();
    };

    var _getCallBackURL = function() {
      return service.getSiteAddress() + _getParsed().pathname;
    };

    service.getSiteAddress = function() {
      var protocol = (_parsed.unsecure != '') ? 'http://' : 'https://';
      return protocol + _parsed.host;
    };

    var _getParsed = function() {
      if(_parsed == '') {
        _parseURI();
      }
      return _parsed;
    };

    service.isReady = function() {
      return _address != '' && _parsed != null;
    };

    service.generateSignatureMessage = function() {
      var fc = profileService.focusedClient;
      if (fc.isPrivKeyEncrypted()) {
        profileService.unlockFC(function(err) {
          if (err) {
            parseError(err);
            $scope.error = err;
            return;
          }
          return service.generateSignatureMessage();
        });
        return;
      };

      var utils = bwcService.getUtils();
      var HDPrivateKey = utils.Bitcore.HDPrivateKey;
      var retrieved = new HDPrivateKey(fc.credentials.xPrivKey);
      var sha256URL = Bitcoin.crypto.sha256(_getBitIDSiteURI());
      var sha32uri = sha256URL.readInt32LE(1);
      var derivedByArgument = retrieved.derive("m/0'/0xb11e'/"+sha32uri+"/0");
      var derPriv = derivedByArgument.privateKey;
      var derivedWIF = derPriv.toWIF();
      var keyPair = Bitcoin.ECKey.fromWIF(derivedWIF);
      var message = _getMessageToSign();
      var signedMessage = Bitcoin.Message.sign(keyPair, message);
      var signed = signedMessage.toString('base64');
      var pubKeyAddress = keyPair.pub.getAddress().toBase58Check();
      var fullMessage = _createMessage(signed, pubKeyAddress);
      return fullMessage;
    };

    var _createMessage = function(signature, pubKey) {
      var fc = profileService.focusedClient;
      var message = {
        uri: _getFullCallbackURI(),
        address: pubKey,
        signature: signature
      }
      return message;
    };

    service.postMessage = function(message) {
      var callbackURL = _getCallBackURL();
      var req = {
          method: 'POST',
          url: callbackURL,
          headers: {
            'Content-Type': 'application/json'
          },
          data: message
      };

      return $http(req);
    };

    return service;
  });
