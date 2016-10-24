'use strict';

/**
 * @ngdoc overview
 * @name slackchatApp
 * @description
 * # slackchatApp
 *
 * Main module of the application.
 */
angular
  .module('slackchatApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.bootstrap',
    'updateMeta',
    'ui-notification',
    'ngclipboard',
      //'ngMeta'
  ])
  .config(function ($routeProvider,NotificationProvider,$locationProvider) {
    $routeProvider
      .when('/', {
        title:'Authorize',
        templateUrl: 'views/authorize.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/home', {
        title:'Topics',
        templateUrl: 'views/home.html',
        controller: 'DiscussCtrl',
        controllerAs: 'ctrl'
      })
      .when('/topics', {
        title:'Topics',
        templateUrl: 'views/home.html',
        controller: 'DiscussCtrl',
        controllerAs: 'ctrl'
      })
      .when('/:teamname/:topic', {
        title:'Comments',
        templateUrl: 'views/comment.html',
        controller: 'CommentCtrl',
        controllerAs: 'ctrl'
      })
      .when('/comment', {
        title:'Comments',
        templateUrl: 'views/comment.html',
        controller: 'CommentCtrl',
        controllerAs: 'ctrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      //$locationProvider.html5Mode(true);
      $locationProvider
          .html5Mode(true);
      NotificationProvider
        .setOptions({
          delay: 10000,
          startTop: 20,
          startRight: 10,
          verticalSpacing: 20,
          horizontalSpacing: 20,
          positionX: 'left',
          positionY: 'bottom'
      });
      //ngMetaProvider.useTitleSuffix(true);
      //ngMetaProvider.setDefaultTitle('FLowtalk');
      //ngMetaProvider.setDefaultTitleSuffix(' | Flowtalk');
      //ngMetaProvider.setDefaultTag('author', 'John Smith');
      //$locationProvider.hashPrefix('!');
  })
.run(['$rootScope', '$route',  function ($rootScope,$route) {
    //ngMeta.init();
    $rootScope.$on('$routeChangeSuccess', function() {
        document.title = $route.current.title;
    })
}])
.filter('trusturls',['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsResourceUrl(val);
    };
}])
.filter('totrusted',['$sce', function ($sce) {
    return function (value) {
        return $sce.trustAsHtml(value);
    };

}])
.directive('showFocus', function($timeout) {
    return function(scope, element, attrs) {
        scope.$watch(attrs.showFocus,
            function (newValue) {
                $timeout(function() {
                    newValue && element.focus();
                });
            },true);
    };
})

 .value('users', {

});
