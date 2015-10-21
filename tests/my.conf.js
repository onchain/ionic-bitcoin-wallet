// Karma configuration
// Generated on Sun Sep 27 2015 16:02:29 GMT+0800 (MYT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      '../www/lib/ionic/js/ionic.bundle.js',
      '../www/lib/angular-mocks/angular-mocks.js',
      '../www/lib/angular-moment/angular-moment.js',
      '../www/lib/fastclick/lib/fastclick.js',
      '../www/lib/qrcode-generator/js/qrcode.js',
      '../www/lib/qrcode-decoder-js/lib/qrcode-decoder.js',
      '../www/lib/angular-foundation/mm-foundation-tpls.js',
      '../www/lib/ng-lodash/build/ng-lodash.js',
      '../www/lib/angular-qrcode/qrcode.js',
      '../www/lib/angular-gettext/dist/angular-gettext.js',
      '../www/lib/angular-bitcore-wallet-client/angular-bitcore-wallet-client.js',
      '../www/lib/angular-ui-switch/angular-ui-switch.js',
      '../www/lib/bitcoinjs.min.js',
      '../www/lib/angular-ui-router/release/angular-ui-router.js',
      '../www/lib/angular-ui-switch/angular-ui-switch.js',
      '../www/js/**/*.js',
      'unit-tests/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
