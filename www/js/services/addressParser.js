'use strict';

angular.module('copayApp.services')
  .service('addressParser', function() {

    var _parsed = {};
    var _address = '';

    this.setAddress = function(href) {
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

    this.getParsed = function() {
      if(_parsed == '') {
        _parseURI();
      }
      return _parsed;
    };

    this.getSiteAddress = function() {
      var protocol = (_parsed.unsecure != '') ? 'http://' : 'https://';
      return protocol + _parsed.host;
    };

    this.isBitID = function(address) {
      return /^(bitid:).*$/.test(address);
    };

  });
