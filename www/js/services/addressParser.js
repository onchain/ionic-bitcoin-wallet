'use strict';

angular.module('copayApp.services')
  .factory('addressParser', function() {

    var _parsed = {};
    var _address = '';
    var service = {};

    service.setAddress = function(href) {
      _address = href;
      _parseURI();
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

    service.getSiteAddress = function() {
      var protocol = (_parsed.unsecure != '') ? 'http://' : 'https://';
      return protocol + _parsed.host;
    };

    service.isBitID = function(address) {
      return /^(bitid:).*$/.test(address);
    };

    service.isReady = function() {
      return _address != '' && _parsed != null;
    };

    return service;

  });
