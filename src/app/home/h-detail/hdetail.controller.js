(function () {
  'use strict';
  angular
    .module('dfdApp')
    .controller('hdetailController', hdetailController);

  /** @ngInject */
  function hdetailController($stateParams, UserApi, toastr, localStorageService) {
    var vm = this, loc, markUrl;

    vm.flag = false;

    vm.isReport = false;

    vm.isRemark = false;

    vm.des = '';

    vm.remark = '';

    vm.sbminit = sbminit;

    vm.time = '';

    vm.mapDate = {
      'lat': '',
      'lng': '',
      'addr': '',
      'city': ''
    };

    vm.report = function () {
      vm.isReport = true;
    }

    vm.remarks = function () {
      vm.isRemark = true;
    }

    vm.map = function () {
      vm.flag = true;
    }

    vm.close = function () {
      vm.flag = false;
    }

    vm.userId = $stateParams.userId;

    vm.bpid = $stateParams.bpid;

    vm.user = JSON.parse(sessionStorage.getItem('user'));

    vm.data = localStorageService.get('data');

    init();

    function init() {
      UserApi.getDfdUploadDetails({
        userid: vm.userId,
        type: 4,
        bpid: vm.bpid
      }).success(function (res) {
        if (+res.flag == 1) {
          vm.flag = true;
          vm.datas = res.data;
          if (res.data.dlaRow) {
            vm.addr = res.data.dlaRow.visit_location;
            vm.des = res.data.dlaRow.visit_risk_report;
            vm.remark = res.data.dlaRow.visit_remark;
            if (vm.addr) {
              vm.addr = vm.addr.replace(/\-/g, '"');
              vm.addr = JSON.parse(vm.addr);
            }
            vm.time = res.data.dlaRow.visit_submit_time;
          }
        } else {
          toastr.info(res.msg);
        }
      })
    }

    window.addEventListener('message', function (event) {
      loc = event.data;
      if (vm.addr && vm.addr.lat && vm.addr.lng && vm.addr.city) {
        if (loc && loc.module == 'geolocation') {
          markUrl = 'https://apis.map.qq.com/tools/poimarker' +
            '?marker=coord:' + vm.addr.lat + ',' + vm.addr.lng +
            ';title:我的位置;addr:' + vm.addr.addr + '' + vm.addr.city +
            '&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp';
          document.getElementById('markPage').src = markUrl;
          vm.mapDate.lat = vm.addr.lat;
          vm.mapDate.lng = vm.addr.lng;
          vm.mapDate.addr = vm.addr.addr;
          vm.mapDate.city = vm.addr.city;
          document.querySelector(".addr").innerHTML = vm.addr.city + " " + vm.addr.addr;
        } else {
          console.log('定位失败');
        }
      } else {
        if (loc && loc.module == 'geolocation') {
          markUrl = 'https://apis.map.qq.com/tools/poimarker' +
            '?marker=coord:' + loc.lat + ',' + loc.lng +
            ';title:我的位置;addr:' + loc.addr + '' + loc.city +
            '&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp';
          document.getElementById('markPage').src = markUrl;
          vm.mapDate.lat = loc.lat;
          vm.mapDate.lng = loc.lng;
          vm.mapDate.addr = loc.addr;
          vm.mapDate.city = loc.city;
          document.querySelector(".addr").innerHTML = loc.city + " " + loc.addr;
        } else {
          console.log('定位失败');
        }
      }

    }, false);
    document.getElementById("geoPage").contentWindow.postMessage('getLocation', '*');
    setTimeout(function () {
      if (!loc) {
        document.getElementById("geoPage")
          .contentWindow.postMessage('getLocation.robust', '*');
      }
    }, 6000);

    function sbminit() {
      var map = JSON.stringify(vm.mapDate).replace(/\"/g, '-');
      UserApi.saveVisitOrSignResult({
        amId: vm.data.data.amId,
        bpId: vm.bpid,
        type: 4,
        visit_risk_report: vm.des,
        visit_location: map,
        visit_remark: vm.remark,
        visit_submit_time: new Date().getTime()
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
