(function() {
  'use strict';

  angular
    .module('dfdApp')
    .directive('upFiles', upFiles);

  /** @ngInject */
  function upFiles() {
    var directive = {
      restrict: 'E',
      scope: {
        title: '@',
        type: '@', //0照片 1文字编辑 2密码 3视频
        placeholder: '@',
        uptype: '@', //上传类型
        userid: '=',
        bpid: '=',
        hxtype: '=',
        datas: '='
      },
      templateUrl: "app/components/up-file/upfiles.html",
      /** @ngInject */
      controller: function($scope, UserApi, toastr, $ionicHistory, localStorageService) {

        $scope.time = '';

        $scope.upfiles = [];

        $scope.dfdUpFile = [];


        $scope.data = {
          file: null
        };

        function init() {
          UserApi.getDfdUploadDetails({
            userid: $scope.userid,
            type: $scope.hxtype,
            bpid: $scope.bpid
          }).success(function(res) {
            if (res.flag == 1) {
              if ($scope.uptype == 100) {
                $scope.datas = res.data.photoType100;
              } else if ($scope.uptype == 102) {
                $scope.datas = res.data.photoType102;
              } else if ($scope.uptype == 103) {
                $scope.datas = res.data.photoType103;
              } else if ($scope.uptype == 104) {
                $scope.datas = res.data.photoType104;
              } else if ($scope.uptype == 105) {
                $scope.datas = res.data.photoType105;
              } else if ($scope.uptype == 106) {
                $scope.datas = res.data.photoType106;
              } else if ($scope.uptype == 107) {
                $scope.datas = res.data.photoType107;
              } else if ($scope.uptype == 108) {
                $scope.datas = res.data.photoType108;
              } else if ($scope.uptype == 130) {
                $scope.datas = res.data.photoType130;
              } else if ($scope.uptype == 131) {
                $scope.datas = res.data.photoType131;
              } else if ($scope.uptype == 132) {
                $scope.datas = res.data.photoType132;
              } else if ($scope.uptype == 133) {
                $scope.datas = res.data.photoType133;
              } else if ($scope.uptype == 1) {
                $scope.datas = res.data.photoType1;
              } else if ($scope.uptype == 138) {
                $scope.datas = res.data.photoType138;
              } else if ($scope.uptype == 40) {
                $scope.datas = res.data.photoType40;
              } else if ($scope.uptype == 150) {
                $scope.datas = res.data.photoType150;
              } else if ($scope.uptype == 151) {
                $scope.datas = res.data.photoType151;
              } else if ($scope.uptype == 152) {
                $scope.datas = res.data.photoType152;
              } else if ($scope.uptype == 153) {
                $scope.datas = res.data.photoType153;
              } else if ($scope.uptype == 154) {
                $scope.datas = res.data.photoType154;
              }
            } else {
              toastr.info(res.msg);
            }
          })
        }

        // $scope.mp4 = function(t) {
        //   if (t.value) {
        //     document.querySelector("#m").style.display = "block";
        //     document.querySelector(".p").style.display = "none";
        //   } else {
        //     document.querySelector("#m").style.display = "none";
        //     document.querySelector(".p").style.display = "block";
        //   }
        // };

        $scope.$watch("data.file", function(novel, old) {
          if (!novel) return;
          $scope.dfdUpFile = $scope.dfdUpFile.concat(novel);
          // var sum = 0;
          // for(var i in $scope.dfdUpFile){
          //   sum = sum + $scope.dfdUpFile[i]['filesize']
          // }
          //
          // sum = sum/1024;

          // if(sum>10240){
          //   $scope.dfdUpFile=[];
          //   toastr.info('上传图片请小于10兆');
          // }

          $scope.data.file = null;
        }, true);

        $scope.sbminit = function(uptype, userid, hxtype) {
          var data = localStorageService.get('data');
          UserApi.getUpload({
            fileName: "",
            userId: userid,
            type: uptype,
            file: $scope.dfdUpFile,
            bpId: $scope.bpid,
            signType: hxtype,
            amId: data.data.amId
          }).success(function(res) {
            if (+res.flag == 1) {
              toastr.info(res.msg);
              init();
              $scope.dfdUpFile = [];
            } else {
              toastr.info(res.msg);
              $scope.dfdUpFile = [];
            }
          })

        }
      }
    }
    return directive;
  };
})();
