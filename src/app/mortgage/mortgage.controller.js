(function () {
  'use strict';
  angular
    .module('dfdApp')
    .controller('mortgageController', mortgageController);

  /** @ngInject */
  function mortgageController($state, UserApi, $stateParams, $rootScope, localStorageService) {
    var vm = this,
      pgNo, pgSize;

    vm.isClass = 0;

    vm.tab = tab;

    vm.goBack = goBack;

    vm.doRefresh = init;

    vm.loadMore = load;

    vm.userId = $stateParams.userId;

    vm.bpid = $stateParams.bpid;

    vm.data = localStorageService.get('data');

    if (localStorageService.get('index')) {
      vm.idDone = vm.isClass = localStorageService.get('index');
    } else {
      vm.isClass = 0;
    }

    function init() {
      pgNo = 1;
      pgSize = 10;
      vm.hasMoreData = false;

      vm.items = [];
      load();
    }

    function load() {
      UserApi.getAssignSignTask({
        amId: vm.data.data.amId,
        pgSize: pgSize,
        pgNo: pgNo,
        idDone: vm.idDone || 0,
        type: 3
      }).success(function (res) {
        if (res.flag === 1) {
          if (vm.isClass == 0) {
            vm.defaultSignCount = res.data.defaultSignCount;
            vm.bakSignCount = res.data.bakSignCount;
          } else {
            var temp = res.data.defaultSignCount;
            vm.defaultSignCount = res.data.bakSignCount;
            res.data.bakSignCount = temp;
          }

          res.data.bpArr.forEach(function (_item) {
            vm.items.push(_item);
          });
          vm.hasMoreData = res.data.bpArr.length === pgSize;
        }
      }).finally(function () {
        $rootScope.$broadcast('scroll.refreshComplete');
        $rootScope.$broadcast('scroll.infiniteScrollComplete');
      });
      pgNo++;

    }

    function goBack(userid, bpid, item) {
      localStorageService.set('index', vm.isClass);
      var items = JSON.stringify(item);
      sessionStorage.setItem('user', items);
      $state.go('mortgage:detail', {'userId': userid, 'bpid': bpid});
    }

    function tab(index) {
      vm.idDone = vm.isClass = index;
      init();
    }

    init();

  }
})();
