(function() {
  'use strict';

  angular
    .module('dfdApp')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {

    $stateProvider
      //登陆
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'loginController',
        controllerAs: 'login'
      })
      //main
      .state('main', {
        url: '/main',
        templateUrl: 'app/main/main.html',
        controller: 'mainController',
        controllerAs: 'main'
      })
      //看房
      .state('home', {
        url: '/home',
        templateUrl: 'app/home/home.html',
        controller: 'homeController',
        controllerAs: 'home'
      })
      //看房详情
      .state('home:detail', {
        url: '/home/detail/:userId/:bpid',
        templateUrl: 'app/home/h-detail/hdetail.html',
        controller: 'hdetailController',
        controllerAs: 'hdetail'
      })
      //签约
      .state('sign', {
        url: '/sign',
        templateUrl: 'app/sign/sign.html',
        controller: 'signController',
        controllerAs: 'sign'
      })
      //签约详情
      .state('sign:detail', {
        url: '/sign/detail/:userId/:bpid',
        templateUrl: 'app/sign/s-detail/sdetail.html',
        controller: 'sdetailController',
        controllerAs: 'sdetail'
      })
      //公证
      .state('notary', {
        url: '/notary',
        templateUrl: 'app/notary/notary.html',
        controller: 'notaryController',
        controllerAs: 'notary'
      })
      //公证详情
      .state('notary:detail', {
        url: '/notary/detail/:userId/:bpid',
        templateUrl: 'app/notary/n-detail/ndetail.html',
        controller: 'ndetailController',
        controllerAs: 'ndetail'
      })
      //抵押
      .state('mortgage', {
        url: '/mortgage',
        templateUrl: 'app/mortgage/mortgage.html',
        controller: 'mortgageController',
        controllerAs: 'mortgage'
      })
      //抵押详情
      .state('mortgage:detail', {
        url: '/mortgage/detail/:userId/:bpid',
        templateUrl: 'app/mortgage/m-detail/mdetail.html',
        controller: 'mdetailController',
        controllerAs: 'mdetail'
      })
    $urlRouterProvider.otherwise('/main');
  }

})();
