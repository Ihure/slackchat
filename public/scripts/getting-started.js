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
    .config(function ($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('authorize',{
                title:'Authorize',
                url:'/authorize',
                templateUrl: 'views/authorize.html',
                controller: 'MainCtrl',
                controllerAs: 'main',
                authenticate:false
            })
            .state('home',{
                url:'/home',
                title:'Topics',
                templateUrl: 'views/home.html',
                controller: 'DiscussCtrl',
                controllerAs: 'ctrl',
                authenticate:true
            })
            .state('topics',{
                url:'/topics',
                title:'Topics',
                templateUrl: 'views/topics.html',
                controller: 'DiscussCtrl',
                controllerAs: 'ctrl',
                authenticate:true
            })
            .state('comments',{
                url:'/comments',
                title:'Comments',
                templateUrl: 'views/comment.html',
                controller: 'CommentCtrl',
                controllerAs: 'ctrl',
                authenticate:true
            });

        $urlRouterProvider.otherwise('/authorize');

    })
    .run(function ($rootScope, $location, $cookieStore, $http,$route,Authservice) {
        /*// keep user logged in after page refresh
         $rootScope.globals = $cookieStore.get('globals') || {};
         if ($rootScope.globals.currentUser) {
         $http.defaults.headers.common['Authorization'] = 'Token ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
         }
         $rootScope.$on('$locationChangeStart', function (event, next, current) {
         // redirect to login page if not logged in and trying to access a restricted page
         var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
         var loggedIn = $rootScope.globals.currentUser;
         if (restrictedPage && !loggedIn) {
         $location.path('/');
         }
         });*/
        $rootScope.$on('$routeChangeSuccess', function() {
            document.title = $route.current.title;
        });
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, FromParams) {
            if(toState.authenticate && !AuthService.isAuthenticated()){
                $state.transitionTo("authorize");
                event.preventDefault();
            }
        });

    })
    .filter('totrusted', function ($sce) {
        return function (value) {
            return $sce.trustAsHtml(value);
        };

    })

    .value('users', {

    });
