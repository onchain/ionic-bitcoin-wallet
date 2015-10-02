describe('OnChain service Unit Test', function() {
  var onChainService;

  var txCmd = 'sign|mywallet.com|hxxp://mywallet.com/sign_tx|user|980190962';
  var mpkCmd = 'mpk|mywallet.com|hxxp://mywallet.com/external_mpk|user|980190962';
  var noExtraParamsCmd = 'sign|mywallet.com|hxxp://mywallet.com/sign_tx';

  beforeEach(function() {
    module('copayApp.services');
    module('ngLodash');
    //Mock dependencies
    module(function($provide) {
      $provide.service('bwcService', function() {

      });

      $provide.service('profileService', function() {

      });

      $provide.service('$http', function() {

      });
      // $provide.service('lodash', inject('lodash'));
    });
    inject(function(_onChainService_) {
      onChainService = _onChainService_;
    })
  });

  it('can get an instance of my factory', inject(function(onChainService) {
      expect(onChainService).toBeDefined();
  }));

  it('parses to an empty object when an invalid command is provided', inject(function(onChainService) {
    onChainService.setAddress('xuxu|beleza');
    var parsed = onChainService.getParsed();
    expect(parsed).toEqual({});
  }));

  it('parses a command with no extra parameter', inject(function(onChainService) {
    onChainService.setAddress(noExtraParamsCmd);
    var parsed = onChainService.getParsed();
    expect(parsed).not.toEqual({});
    expect(Object.keys(parsed).length).toEqual(3);
    expect(parsed.cmd).toEqual('sign');
    expect(parsed.service).toEqual('mywallet.com');
    expect(parsed.post_back).toEqual('hxxp://mywallet.com/sign_tx');
  }));

  it('parses a command with extra parameters', inject(function(onChainService) {
    onChainService.setAddress(txCmd);
    var parsed = onChainService.getParsed();
    expect(parsed).not.toEqual({});
    expect(Object.keys(parsed).length).toEqual(4);
    expect(parsed.cmd).toEqual('sign');
    expect(parsed.service).toEqual('mywallet.com');
    expect(parsed.post_back).toEqual('hxxp://mywallet.com/sign_tx');
    expect(parsed.user).toEqual('980190962');
  }));

  it('process crc16 with no index specified as idx 0', inject(function(onChainService) {
    onChainService.setAddress(txCmd);
    var parsed = onChainService.getParsed();
    var crc16 = onChainService.crc16(parsed.service);
    expect(crc16).toEqual("m/0'/0xb11e'/418123425/0");
  }));

  it('process crc16 with index specified', inject(function(onChainService) {
    onChainService.setAddress(txCmd);
    var parsed = onChainService.getParsed();
    var crc16 = onChainService.crc16(parsed.service, 1);
    expect(crc16).toEqual("m/0'/0xb11e'/418123425/1");
  }));

  it('builds the request MPK object based on the command with the right parameters', inject(function(onChainService) {
    onChainService.setAddress(mpkCmd);
    var mpk = 'xpub661MyMwAqRbcF7mq7Aejj5xZNzFfgi3ABamE9FedDHVmViSzSxYTgAQGcATDo2J821q7Y9EAagjg5EP3L7uBZk11PxZU3hikL59dexfLkz3';
    var reqObj = onChainService.buildRequestMPKObject(mpk);
    var reqKeys = Object.keys(reqObj);
    expect(reqKeys).not.toContain('cmd');
    expect(reqKeys).not.toContain('service');
    expect(reqKeys).not.toContain('post_back');
    expect(reqKeys).toContain('user');
    expect(reqKeys).toContain('mpk');
    expect(reqObj.user).toEqual('980190962');
    expect(reqObj.mpk).toEqual('xpub661MyMwAqRbcF7mq7Aejj5xZNzFfgi3ABamE9FedDHVmViSzSxYTgAQGcATDo2J821q7Y9EAagjg5EP3L7uBZk11PxZU3hikL59dexfLkz3');
  }));
});
