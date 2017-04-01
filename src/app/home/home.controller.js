(function () {
  'use strict';
  angular
    .module('dfdApp')
    .controller('homeController', homeController);

  /** @ngInject */
  function homeController($state, UserApi, $rootScope, localStorageService) {
    var vm = this,
      pgNo, pgSize;

    vm.tab = tab;

    vm.goBack = goBack;

    vm.doRefresh = init;

    vm.loadMore = load;

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
      UserApi.getAssignVisitTask({
        amId: vm.data.data.amId,
        pgSize: pgSize,
        pgNo: pgNo,
        idDone: vm.idDone || 0
      }).success(function (res) {
        if (res.flag === 1) {
          if (vm.isClass == 0) {
            vm.defaultVisitCount = res.data.defaultVisitCount;
            vm.bakVisitCount = res.data.bakVisitCount;
          } else {
            var temp = res.data.defaultVisitCount;
            vm.defaultVisitCount = res.data.bakVisitCount;
            res.data.bakVisitCount = temp;
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

    function tab(index) {
      vm.idDone = vm.isClass = index;
      init();
    }

    function goBack(userid, bpid, item) {
      localStorageService.set('index', vm.isClass);
      var items = JSON.stringify(item);
      sessionStorage.setItem('user', items);
      $state.go('home:detail', {'userId': userid, 'bpid': bpid});
    }

    init();
  }
})();
