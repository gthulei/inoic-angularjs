/* global moment:false */
(function() {
  'use strict';

  angular
    .module('dfdApp')
    .constant('HOST', 'https://openapi.sit.nonobank.com')
    .value('user', {
      sessionId: ''
    })
    .factory('APISERVER', function($location, HOST) {
      var host = /dfdbank.com/.test($location.host()) ? $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '') : HOST;
      return {
        DFDWEB: host + '/nono-web/dfd'
      };
    })
    .factory('CLIENT_VERSION', function($location, utils) {
      var search = $location.search() || utils.getLocationSearch();

      return search.version || '';
    })
    .constant('$ionicLoadingConfig', {
      template: '<ion-spinner icon="bubbles" class="spinner-positive"></ion-spinner>'
    })

})();
