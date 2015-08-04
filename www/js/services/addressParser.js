'use strict';

angular.module('copayApp.services')
  .factory('addressParser', function() {

    var _parsed = {};
    var _address = '';
    var service = {};
    var magicPrefix = "\x18Bitcoin Signed Message:\n";

    service.setAddress = function(href) {
      _address = href;
      _parseURI();
    };

    function stringToBytes(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
              bytes.push(str.charCodeAt(i));
      return bytes;
    };

    function msg_numToVarInt(i) {
      if (i < 0xfd) {
        return [i];
      } else if (i <= 0xffff) {
        // can't use numToVarInt from bitcoinjs, BitcoinQT wants big endian here (!)
        return [0xfd, i & 255, i >>> 8];
      } else if (i <= 0xffffffff) {
        return [0xfe, i & 255, (i >>> 8) & 255, (i >>> 16) & 255, i >>> 24];
      } else {
          throw ("message too large");
      }
    };

    function msg_digest(message) {
        var b = msg_bytes("Bitcoin Signed Message:\n").concat(msg_bytes(message));
        return b;
    };

    function msg_bytes(message) {
        var b = stringToBytes(message);
        return msg_numToVarInt(b.length).concat(b);
    };

    service.getMessageToSign = function() {
      return msg_digest(service.getFullCallbackURI());
    };

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

    service.getParsed = function() {
      if(_parsed == '') {
        _parseURI();
      }
      return _parsed;
    };

    service.getBitIDURI = function() {
      return _parsed.protocol + _parsed.host;
    };

    service.getSiteAddress = function() {
      var protocol = (_parsed.unsecure != '') ? 'http://' : 'https://';
      return protocol + _parsed.host;
    };

    service.getFullCallbackURI = function() {
      return service.getParsed().href;
    };

    service.getCallBackURL = function() {
      return service.getSiteAddress() + service.getParsed().pathname;
    };

    service.isBitID = function(address) {
      return /^(bitid:).*$/.test(address);
    };

    service.isReady = function() {
      return _address != '' && _parsed != null;
    };

    return service;

  });
