(function () {
  'use strict';
  angular
    .module('dfdApp')
    .controller('loginController', loginController);

  /** @ngInject */
  function loginController(toastr, $state, UserApi, localStorageService, $scope) {
    var vm = this,
      re, res;

    vm.mobile = '13916721645';

    vm.msgCode = '0615';

    vm.timeCount = 60;

    vm.getMsg = getMsg;

    vm.submit = submit;

    re = /^1[1-9][0-9]\d{8}$/;

    function getMsg() {
      if (!re.test(vm.mobile)) {
        toastr.info('请输入正确的手机号码');
        return;
      }
      UserApi.sendSmsCode({mobile: vm.mobile}).success(function (res) {
        if (+res.flag == 1) {
          times();
        } else {
          toastr.info(res.msg);
        }
      })

    }

    function submit() {
      res = /^\d{4}$/
      if (!re.test(vm.mobile)) {
        toastr.info('请输入正确的手机号码');
        return;
      }
      if (!res.test(vm.msgCode)) {
        toastr.info('请输入正确验证码');
        return;
      }
      UserApi.login({
        mobile: vm.mobile,
        smsCode: vm.msgCode
      }).success(function (res) {
        var data = res;
        switch (res.flag) {
          case '-1':
          case '1':
          case '2':
            toastr.info(res.msg);
            break;
          case '3':
          case '4':
          case '5':
          case '6':
            var t = new Date().getTime() + 24 * 3600 * 1000;
            localStorageService.set('t', t);
            localStorageService.set('data', data);
            $state.go('main');
            break;
        }
      })
    }

    function times() {
      var btn = document.getElementById("btn");
      if (vm.timeCount == vm.timeCount) {
        if (vm.timeCount == 1) {
          vm.timeCount = 60;
          btn.innerHTML = '获取验证码';
          btn.removeAttribute('disabled');
          return;
        }
        vm.timeCount--;
        btn.innerHTML = vm.timeCount + 's';
        btn.setAttribute('disabled', 'disabled');
        setTimeout(times, 1000)
      }
    }
  }
})();
