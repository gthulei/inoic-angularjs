(function () {
  'use strict';
  angular
    .module('dfdApp')
    .controller('sdetailController', sdetailController);

  /** @ngInject */
  function sdetailController($stateParams, UserApi, toastr, localStorageService) {

    var vm = this;

    vm.isRemark = false;

    vm.des = '';

    vm.userId = $stateParams.userId;

    vm.bpid = $stateParams.bpid;

    vm.sbminit = sbminit;

    vm.data = localStorageService.get('data');

    vm.user = JSON.parse(sessionStorage.getItem('user'));

    init();

    vm.remark = function () {
      vm.isRemark = true;
    }

    function init() {
      UserApi.getDfdUploadDetails({
        userid: vm.userId,
        type: 1,
        bpid: vm.bpid
      }).success(function (res) {
        if (+res.flag == 1) {
          vm.datas = res.data;
          if (res.data.dlaRow) {
            vm.des = res.data.dlaRow.sign_remark;
            vm.time = res.data.dlaRow.sign_submit_time;
          }
        } else {
          toastr.info(res.msg);
        }
      })
    }

    function sbminit() {
      UserApi.saveVisitOrSignResult({
        amId: vm.data.data.amId,
        bpId: vm.bpid,
        type: 1,
        sign_remark: vm.des,
        sign_submit_time: new Date().getTime(),
      }).success(function (res) {
        if (+res.flag == 1) {
          init();
          vm.isRemark = false;
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
