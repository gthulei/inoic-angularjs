(function () {
  'use strict';
  angular
    .module('dfdApp')
    .controller('mdetailController', mdetailController);

  /** @ngInject */
  function mdetailController($stateParams, UserApi, toastr, localStorageService) {
    var vm = this;

    vm.userId = $stateParams.userId;

    vm.bpid = $stateParams.bpid;

    vm.data = localStorageService.get('data');

    vm.user = JSON.parse(sessionStorage.getItem('user'));

    vm.p = '';

    vm.des = '';

    vm.pass = pass;

    vm.remark = remark;

    vm.sbminit = sbminit;

    vm.isRemark = false;

    vm.isPass = false;

    init();

    function pass() {
      vm.isPass = true;
    }

    function remark() {
      vm.isRemark = true;
    }

    function init() {
      UserApi.getDfdUploadDetails({
        userid: vm.userId,
        type: 3,
        bpid: vm.bpid
      }).success(function (res) {
        if (res.flag == 1) {
          vm.datas = res.data;
          if (res.data.dlaRow) {
            vm.p = res.data.dlaRow.mortgage_passwd;
            vm.des = res.data.dlaRow.mortgage_remark;
            vm.time = res.data.dlaRow.mortgage_submit_time;
          }
        }
      })
    }

    function sbminit() {
      UserApi.saveVisitOrSignResult({
        amId: vm.data.data.amId,
        bpId: vm.bpid,
        type: 3,
        mortgage_passwd: vm.p,
        mortgage_remark: vm.des,
        mortgage_submit_time: new Date().getTime()
      }).success(function (res) {
        if (+res.flag == 1) {
          init();
          vm.isRemark = false
          localStorageService.set('index', 1);
          toastr.info(res.msg);
          // $ionicHistory.goBack();
        } else {
          toastr.info(res.msg);
        }
      })

    }
  }
})();
