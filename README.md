# Building the ionic bitcoin wallet

Run the wallet locally

`ionic serve`

If you want to specify a port and stop the live reload.

`ionic serve -p $PORT --nolivereload`

# Deploy to Ionic view.

Ionic view is the app provided by ionic to quickly deploy apps to a device for testing.

`ionic upload`

# Build an android APK.

You can follow these instructions http://docs.ionic.io/v2.0.0-beta/docs/package-android#production-builds

`ionic package build android --release --profile PROFILE_TAG`
