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

    service.getMessageToSign = function() {
      return service.getFullCallbackURI();
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

    service.getBitIDSiteURI = function() {
      return _parsed.protocol + ":" + _parsed.host + _parsed.pathname;
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

    service.isOnChain = function(address) {
      var params = address.split("|");
      return params.length > 3;
    };

    service.isReady = function() {
      return _address != '' && _parsed != null;
    };

    return service;

  });
