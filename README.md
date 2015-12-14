# Building BitcoinJS Lib
To build BitcoinJS library you should first install browserify and bitcoinjs-lib:

`npm -g install bitcoinjs-lib browserify`

And then prepare bitcoinjs-lib to be imported by the browser:

`browserify -r bitcoinjs-lib -s Bitcoin > www/lib/bitcoinjs.min.js`

Now bitcoinjs-lib is available trough the constant Bitcoin.
