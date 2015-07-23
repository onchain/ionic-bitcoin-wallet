'use strict';

angular.module('copayApp.services')
  .factory('addressParser', function() {
    var factory = {};

    factory.parseURI = function(href) {
      var reURLInformation = new RegExp([
        '^(bitid)://', // protocol
        '(([^:/?#]*)(?::([0-9]+))?)', // host (hostname and port)
        '(/[^?#]*)', // pathname
        '.x=([^\\&u=]*|)', // NONCE
        '.u=([^#]*|)' // IS UNSECURE
      ].join(''));
      var match = href.match(reURLInformation);
      return match && {
        href: href,
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        nonce: match[6],
        unsecure: match[7]
      }
    };

    factory.isBitID = function(address) {
      return /^(bitid:).*$/.test(address);
    };

    return factory;
  });
