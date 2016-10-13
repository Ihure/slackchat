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
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
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
      .when('/comment', {
        title:'Comments',
        templateUrl: 'views/comment.html',
        controller: 'CommentCtrl',
        controllerAs: 'ctrl'
      })
      .otherwise({
        redirectTo: '/'
      });


       })
.run(function ($rootScope, $location, $cookieStore, $http,$route,$sessionStorage) {
    /*// keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Token ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }*/
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/register','/home']) === -1;
        var loggedIn = $sessionStorage.real_name;
        if (restrictedPage && !loggedIn) {
            $location.path('/');
        }
    });
    $rootScope.$on('$routeChangeSuccess', function() {
        document.title = $route.current.title;
    });

})
.filter('totrusted', function ($sce) {
    return function (value) {
        return $sce.trustAsHtml(value);
    };

})
.filter('trusturl', function ($sce) {
    return function (value) {
        return $sce.trustAsResourceUrl(value);
    };
})

 .value('users', {

});
