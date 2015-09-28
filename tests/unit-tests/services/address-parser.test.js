describe('Address Parser Unit Test', function() {
  var addressParser;
  beforeEach(module('copayApp.services'));
  beforeEach(inject(function(_addressParser_) {
    addressParser = _addressParser_;
  }));
  it('can get an instance of my factory', inject(function(addressParser) {
        expect(addressParser).toBeDefined();
    }));

    it('detects valid bitID address correctly', inject(function(addressParser) {
      var validBitIDAddress = 'bitid://bitid.bitcoin.blue/callback?x=0fb98d4b6b9c7538&u=1';
      expect(addressParser.isBitID(validBitIDAddress)).toBe(true);
    }));

    it('detects invalid bitID address correctly', inject(function(addressParser) {
      var invalidBitIDAddress = 'http://bitid.bitcoin.blue/callback?x=0fb98d4b6b9c7538&u=1';
      expect(addressParser.isBitID(invalidBitIDAddress)).toBe(false);
    }));

    it('detects valid MultiSig command correctly', inject(function(addressParser) {
      var validOnChainCommand = 'mpk|mywallet.com|hxxp://mywallet.com/external_mpk|user|980190962';
      expect(addressParser.isOnChain(validOnChainCommand)).toBe(true);
    }));

    it('detects invalid MultiSig command correctly', inject(function(addressParser) {
      var invalidOnChainCommand = 'mpk|mywallet.com';
      expect(addressParser.isOnChain(invalidOnChainCommand)).toBe(false);
    }));
});
