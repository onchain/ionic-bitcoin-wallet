'use strict';

angular.module('copayApp.services').value('isDevice',  (document.location.protocol == "file:"));
