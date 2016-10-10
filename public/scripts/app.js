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
    'ngStorage'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'ctrl'
      })
      .when('/newtopic', {
        templateUrl: 'views/createtopic.html',
        controller: 'createtopicCtrl',
        controllerAs: 'ctrl'
      })
      .when('/topics', {
        templateUrl: 'views/topics.html',
        controller: 'DiscussCtrl',
        controllerAs: 'ctrl'
      })
      .when('/comment', {
        templateUrl: 'views/newcomment.html',
        controller: 'CommentCtrl',
        controllerAs: 'ctrl'
      })
      .otherwise({
        redirectTo: '/'
      });

  })
 .filter('custom',[function () {
   return function (comment,parentid,level,slugabv) {
        var out=[];
       angular.forEach(input, function(language) {
            if(comment.parentid==parentid && comment.level==level && comment.slugabove==slugabv){
                out.push(comment)
            }
       })
        return out;
   }  
 }])
 .value('users', {

});
