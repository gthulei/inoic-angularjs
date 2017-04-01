(function () {
  'use strict';
  angular
    .module('dfdApp')
    .controller('ndetailController', ndetailController);

  /** @ngInject */
  function ndetailController(UserApi, $stateParams, toastr, localStorageService) {
    var vm = this;

    vm.teacher = '';

    vm.remark = '';

    vm.sbminitTime = '';

    vm.t = t;

    vm.data = localStorageService.get('data');

    vm.user = JSON.parse(sessionStorage.getItem('user'));


    vm.bpid = $stateParams.bpid;

    vm.userId = $stateParams.userId;

    init();

    function init() {
      UserApi.getDfdUploadDetails({
        userid: vm.userId,
        type: 2,
        bpid: vm.bpid
      }).success(function (res) {
        if (res.flag == 1) {
          vm.teacher = res.data.dlaRow.notary_teacher;
          vm.remark = res.data.dlaRow.notary_remark;
          vm.sbminitTime = res.data.dlaRow.notary_submit_time;
          vm.time = res.data.dlaRow.notary_time;
          vm.time = vm.time.split('-').join('/');
        } else {
          toastr.info(res.msg);
        }
      })
    }

    function t() {
      var d = document.getElementById("data").value;
      UserApi.saveVisitOrSignResult({
        amId: vm.data.data.amId,
        bpId: vm.bpid,
        type: 2,
        notary_teacher: vm.teacher,
        notary_time: d,
        notary_remark: vm.remark,
        notary_submit_time: new Date().getTime()
      }).success(function (res) {
        if (+res.flag == 1) {
          localStorageService.set('index', 1);
          toastr.info(res.msg);
          init();
          // $ionicHistory.goBack();
        } else {
          toastr.info(res.msg);
        }
      })
    }
  }
})();
