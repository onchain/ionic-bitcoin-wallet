# angular-bitcore-wallet-client
AngularJS module for [bitcore-wallet-client](https://github.com/bitpay/bitcore-wallet-client)

## Get started

```
bower install angular-bitcore-wallet-client
```

Add javascript to `index.html` after *angular.js*:

```html
<script src="bower_components/angular-bitcore-wallet-client/angular-bitcore-wallet-client.min.js"></script>
```

Add to your array of AngularJS modules:

```
var modules = [
  'bwcModule'
];

var myApp = angular.module('myApp', modules);
```

## Use

See the [API referece](https://github.com/bitpay/bitcore-wallet-client) for more details.

```javascript
angular.module('myApp').factory('myService', 
  function(bwcService) {
    var walletClient = bwcService.getClient();
    walletClient.createWallet('Personal Wallet', 'me', 1, 1, 'livenet', function(err) {
    
      // Store in
      save(walletClient.export());

      // Read other wallet
      var wallet2 = read(...);
      var walletClient2 = bwcService(getClient(wallet2));
      
      walletClient2.getStatus(function(err, status) {
         console.log(status);
      });
    });
  }
);
```
See Complete API at [Bitcore Wallet Client Readme](https://github.com/bitpay/bitcore-wallet-client)
