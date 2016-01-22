# First you need to run sudo npm install and then run grunt in the copay folder
# Run the following commands to copy the source over

#`cp -r ../copay/src/js www/`
#`cp -r ../copay/src/css www/`
#`cp -r ../copay/public/font www/`
#`cp -r ../copay/public/img www/`
#`cp -r ../copay/public/views www/`
#`cp -r ../copay/public/js www/`
#`cp -r ../copay/public/lib www/`
#`cp -r ../copay/public/css www/`
#`cp -r ../copay/public/index.html www/`
#`cp -r ../copay/Gruntfile.js .`

# This generates a list of the JS and should be placed in index.html
# instaed of <script src="js/copay.js"></script>

# The grunt file in copay concatinates all these files
# 'src/js/app.js',
#'src/js/routes.js',
#'src/js/directives/*.js',
#'src/js/filters/*.js',
#'src/js/models/*.js',
#'src/js/services/*.js',
#'src/js/controllers/*.js',
#'src/js/translations.js',
#'src/js/version.js',
#'src/js/init.js',
#'src/js/trezor-url.js',
#'bower_components/trezor-connect/login.js'


puts '<script src="js/app.js"></script>'
puts '<script src="js/routes.js"></script>'
Dir.glob("www/js/directives/*.js").each do |file|
  puts '<script src="' + file.gsub("www/", "") + '"></script>'
end
Dir.glob("www/js/filters/*.js").each do |file|
  puts '<script src="' + file.gsub("www/", "") + '"></script>'
end
Dir.glob("www/js/models/*.js").each do |file|
  puts '<script src="' + file.gsub("www/", "") + '"></script>'
end
Dir.glob("www/js/services/*.js").each do |file|
  puts '<script src="' + file.gsub("www/", "") + '"></script>'
end
Dir.glob("www/js/controllers/*.js").each do |file|
  puts '<script src="' + file.gsub("www/", "") + '"></script>'
end
puts '<script src="js/translations.js"></script>'
puts '<script src="js/version.js"></script>'
puts '<script src="js/init.js"></script>'
puts '<script src="js/trezor-url.js"></script>'
puts '<script src="lib/trezor-connect/login.js"></script>'

# To get QR codes working in ionic viewer
# Open directives/qrScanner.js replace isCordova with isDevice
# Replace cloudSky.zBar.scan({}, onSuccess, onError); with the cordova one.
# remove anything checking windows mobile