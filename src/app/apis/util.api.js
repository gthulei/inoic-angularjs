(function() {
  'use strict';

  angular
    .module('dfdApp')
    .service('UserApi', UserApi);

  /** @ngInject */
  function UserApi($http, md5, user, APISERVER) {

    //短信验证码
    this.sendSmsCode = function(obj) {
        return $http.post(APISERVER.DFDWEB + '/sendSmsCodeDfd', {
          mobile: obj.mobile,
          isAdmin: 1
        })
      }

      //登录
    this.login = function(obj) {
        return $http.post(APISERVER.DFDWEB + '/dfdAdminWorkLogin', {
          mobile: obj.mobile,
          smsCode: obj.smsCode
        })
      }

      //看房列表
    this.getAssignVisitTask = function(obj) {
        return $http.post(APISERVER.DFDWEB + '/getAssignVisitTask', {
          amId: obj.amId,
          pgSize: obj.pgSize,
          pgNo: obj.pgNo,
          idDone: obj.idDone
        });
      }

      //看房提交
    this.saveVisitOrSignResult = function(obj) {
        return $http.post(APISERVER.DFDWEB + '/saveVisitOrSignResult', {
          amId: obj.amId,
          bpId: obj.bpId,
          type: obj.type,
          visit_location: obj.visit_location,
          visit_remark: obj.visit_remark,
          visit_risk_report: obj.visit_risk_report,
          visit_submit_time: obj.visit_submit_time,
          sign_remark: obj.sign_remark,
          sign_submit_time: obj.sign_submit_time,
          notary_teacher: obj.notary_teacher,
          notary_time: obj.notary_time,
          notary_remark: obj.notary_remark,
          notary_submit_time: obj.notary_submit_time,
          mortgage_passwd: obj.mortgage_passwd,
          mortgage_remark: obj.mortgage_remark,
          mortgage_submit_time: obj.mortgage_submit_time
        })
      }

      //签约公证抵押列表
    this.getAssignSignTask = function(obj) {
        return $http.post(APISERVER.DFDWEB + '/getAssignSignTask', {
          amId: obj.amId,
          pgSize: obj.pgSize,
          pgNo: obj.pgNo,
          idDone: obj.idDone,
          type: obj.type
        });
      }

      //回显
    this.getDfdUploadDetails = function(obj) {
        return $http.post(APISERVER.DFDWEB + '/getDfdUploadDetails', {
          userId: obj.userid,
          type: obj.type,
          bpId: obj.bpid
        })
      }

      //图片上传
    this.getUpload = function(obj) {
        var data = {
          fileName: obj.fileName,
          userId: obj.userId,
          type: obj.type,
          file: obj.file
        };
        data = {
          request: JSON.stringify(data),
          bpId: obj.bpId,
          signType: obj.signType,
          amId: obj.amId
        };
        return $http.post(APISERVER.DFDWEB + '/uploadDfdHousePhoto', data)
      }
      
      //删除图片
    this.deleteDfdUploadPhoto = function(obj) {
      return $http.post(APISERVER.DFDWEB + '/deleteDfdUploadPhoto ', {
        id: obj.id
      })
    }
  }
})();
