(function() {
  'use strict';

  angular
    .module('dfdApp')
    .factory('utils', utils);

  /** @ngInject */
  function utils($ionicHistory, $timeout, $ionicPopup, $log, $rootScope, md5, $filter) {
    return {
      getLocationSearch: function() {
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split("=");
          // If first entry with this name
          if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
          } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
          } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
          }
        }

        return query_string;
      },
      getAjaxHeaders: function() {
        return function() {
          var now = new Date(),
            s1 = $filter('date')(now, 'yyyy-MM-dd HH'),
            s2 = Math.floor(now.getMinutes() / 5),
            v = 'm.nonobank.com/msapi/' + s1 + s2;

          return {
            'Authorization': md5.createHash(v),
            'ComeFrom': 'MaiZI'
          };
        }
      },
      disableBack: function() {
        $ionicHistory.nextViewOptions({
          disableAnimate: false,
          disableBack: true
        });
      },
      goBack: function(depth) {
        $ionicHistory.goBack(depth);
      },
      resendCountdown: function($scope) {
        $scope.resendCountdown = 0;

        return function() {
          $scope.resendCountdown = 60;
          var countdown = function() {
            if ($scope.resendCountdown > 0) {
              $scope.resendCountdown += -1;
              $timeout(countdown, 1000);
            }
          };
          countdown();
        };
      },
      dhms: function(t) {
        var days, hours, minutes, seconds;
        days = Math.floor(t / 86400);
        t -= days * 86400;
        hours = Math.floor(t / 3600) % 24;
        t -= hours * 3600;
        minutes = Math.floor(t / 60) % 60;
        t -= minutes * 60;
        seconds = t % 60;
        if (days) {
          return [
            days + '天',
            hours + '时',
            minutes + '分',
            seconds + '秒'
          ].join('');

        } else {
          return [
            hours + '时',
            minutes + '分',
            seconds + '秒'
          ].join('');
        }
      },
      formatPhone: function(num) {
        var reg = /(\d{3})\d{4}(\d{4})/;
        var _num = num.replace(reg, '$1****$2');
        return _num;
      },
      alert: function(obj) {
        var alertPopup = $ionicPopup.alert({
          title: obj.title || '温馨提示',
          cssClass: obj.cssClass || 'text-center popup-alert',
          subTitle: obj.subTitle || '',
          template: obj.content || '',
          templateUrl: obj.contentUrl || '',
          okText: obj.okText || '确认',
          okType: obj.okType || 'button button-clear button-positive'
        });
        alertPopup.then(function() {
          obj.onOk && obj.onOk();
        });
      },
      confirm: function(obj) {
        var confirmPopup = $ionicPopup.confirm({
          title: obj.title || '温馨提示',
          template: obj.content || '',
          cssClass: obj.cssClass || 'text-center',
          okText: obj.okText || '确认',
          okType: obj.okType || 'button-positive',
          cancelText: obj.cancelText || '取消',
          cancelType: obj.cancelType || 'button-default'
        });
        confirmPopup.then(function(res) {
          if (res) {
            obj.onOk && obj.onOk();
          } else {
            obj.onCancel && obj.onCancel();
          }
        });
      }
    }
  }

})();
