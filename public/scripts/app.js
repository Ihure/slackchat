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
    'ngClipboard',
    'ngMaterial',
    'summernote'
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
      .when('/createtopic', {
        title:'Create Topic',
        templateUrl: 'views/ngdialog.html',
        controller:'createtopicCtrl',
        controllerAs:'ctrl'
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
.run(['$rootScope', '$route','$cookieStore', '$location', function ($rootScope,$route,$cookieStore,$location) {
    //ngMeta.init();
    $rootScope.$on('$routeChangeSuccess', function() {
        document.title = $route.current.title;
    });
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      // redirect to home page if user is loged in and tryin to access authorize page
      var authPage = $.inArray($location.path(), ['/', '/register']) === -1;
      var loggedIn = $cookieStore.get('flowtalklog');
      if (!authPage && loggedIn == 'logged') {
        $location.path('/home');
      }
    });
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
