(function() {
  'use strict';
  angular
    .module('dfdApp')
    .controller('mainController', mainController);

  /** @ngInject */
  function mainController($state,localStorageService) {
    var vm = this;

    vm.id = localStorageService.get('data').flag;

  }
})();
