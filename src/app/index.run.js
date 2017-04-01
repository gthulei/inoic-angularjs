(function() {
  'use strict';

  angular
    .module('dfdApp')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $ionicLoading, $http, $httpParamSerializerJQLike, $ionicHistory, $state, $location, user, toastr, localStorageService) {
    $rootScope.$on('loading:show', function() {
      $ionicLoading.show({
        noBackdrop: true,
        hideOnStateChange: true
      });
    });

    $rootScope.$on('loading:hide', function() {
      $ionicLoading.hide();
    });

    $rootScope.$on('ajax:error', function(evt, rejection) {
      if (rejection.config.method === 'POST') {
        toastr.info(rejection.status + ' : ' + rejection.statusText);
      }
    });

    // serialize http request data
    $http.defaults.transformRequest.unshift($httpParamSerializerJQLike);

    // routing interceptor
    $rootScope.$on('$stateChangeStart', function(evt, toState) {
      var time = localStorageService.get('t');
      var current = time-new Date().getTime();
      console.log(current)
      if (toState.name != 'login') {
          var data = localStorageService.get('data');
          if (current<0) {
            evt.preventDefault();
            $state.go('login')
        }
      }
    });

    $log.debug('runBlock end');
  }

})();
