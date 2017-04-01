(function() {
  'use strict';

  angular
    .module('dfdApp')
    .config(config);

  /** @ngInject */
  function config($logProvider, $httpProvider, toastrConfig, $ionicConfigProvider, localStorageServiceProvider, $sceProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    $ionicConfigProvider.tabs.position('bottom').style('standard');
    $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-left').previousTitleText(false);

    // http interceptor
    $httpProvider.interceptors.push(function($rootScope, $log, $q) {
      var counter = 0;

      return {
        request: function(config) {
          if (config.method === 'POST' && !config.silence) {
            counter++;

            $rootScope.loading = true;
            $rootScope.$broadcast('loading:show');
          }

          return config;
        },
        response: function(response) {
          if (response.config.method === 'POST' && !response.config.silence) {
            counter--;

            if (!counter) {
              $rootScope.loading = false;
              $rootScope.$broadcast('loading:hide');
            }
          }

          return response;
        },
        responseError: function(rejection) {
          if (rejection.config.method === 'POST') {
            counter--;
            $rootScope.$broadcast('ajax:error', rejection);

            if (!counter) {
              $rootScope.loading = false;
              $rootScope.$broadcast('loading:hide');
            }
          }

          return $q.reject(rejection);
        }
      }
    });

    // set http defaults
    // $httpProvider.defaults.paramSerializer = '$httpParamSerializerJQLike';
    $httpProvider.defaults.headers.post = { 'Content-Type': 'application/x-www-form-urlencoded' };

    // local storage config
    localStorageServiceProvider
      .setPrefix('dfdApp')
      .setStorageType('localStorage')
      .setNotify(true, true);

    // disable sec
    $sceProvider.enabled(false);

  }

})();
