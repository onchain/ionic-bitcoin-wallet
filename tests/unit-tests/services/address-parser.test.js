describe('Address Parser Unit Test', function() {
  var addressParser;
  var validBitIDAddress = 'bitid://bitid.bitcoin.blue/callback?x=0fb98d4b6b9c7538&u=1';
  var validOnChainCommand = 'mpk|mywallet.com|hxxp://mywallet.com/external_mpk|user|980190962';
  var btcAddress = '1AaDWZKYGvWHmWyeuz6w1K6EsVVZGev3dk';

  beforeEach(module('copayApp.services'));
  beforeEach(inject(function(_addressParser_) {
    addressParser = _addressParser_;
  }));
  it('can get an instance of my factory', inject(function(addressParser) {
        expect(addressParser).toBeDefined();
    }));

    it('detects valid bitID address correctly', inject(function(addressParser) {
      expect(addressParser.isBitID(validBitIDAddress)).toBe(true);
    }));

    it('detects invalid bitID address correctly', inject(function(addressParser) {
      var invalidBitIDAddress = 'http://bitid.bitcoin.blue/callback?x=0fb98d4b6b9c7538&u=1';
      expect(addressParser.isBitID(invalidBitIDAddress)).toBe(false);
    }));

    it('detects valid MultiSig command correctly', inject(function(addressParser) {
      expect(addressParser.isOnChain(validOnChainCommand)).toBe(true);
    }));

    it('detects invalid MultiSig command correctly', inject(function(addressParser) {
      var invalidOnChainCommand = 'mpk|mywallet.com';
      expect(addressParser.isOnChain(invalidOnChainCommand)).toBe(false);
    }));

    it('parses a bitcoin address as neither bitid nor onchain', inject(function(addressParser) {
      expect(addressParser.isOnChain(btcAddress)).toBe(false);
      expect(addressParser.isBitID(btcAddress)).toBe(false);
    }));

    it('has type as none when no address is suplied', inject(function(addressParser) {
        expect(addressParser.getType()).toBe(addressParser.TYPES.none);
    }));

    it('has type bitid when bitid address is provided', inject(function(addressParser) {
        addressParser.setAddress(validBitIDAddress);
        expect(addressParser.getType()).toBe(addressParser.TYPES.bitid);
    }));

    it('has type onchain when onchain address is provided', inject(function(addressParser) {
        addressParser.setAddress(validOnChainCommand);
        expect(addressParser.getType()).toBe(addressParser.TYPES.onchain);
    }));

    it('has type none when btc address is provided', inject(function(addressParser) {
        addressParser.setAddress(btcAddress);
        expect(addressParser.getType()).toBe(addressParser.TYPES.none);
    }));
});
