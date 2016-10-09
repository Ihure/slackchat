'use strict';

/**
 * @ngdoc function
 * @name slackchatApp.controller:SlackloginCtrl
 * @description
 * # SlackloginCtrl
 * Controller of the slackchatApp
 */
angular.module('slackchatApp')
  .controller('SlackloginCtrl',['$location','authenticationservice','$rootScope','$scope','users','$sessionStorage', function ($location,authenticationservice,$rootScope,$scope,users,$sessionStorage) {
    var ctrl = this;

    ctrl.ok = function () {
      var promise = authenticationservice.testapi();
      promise.then(function(response) {
        $scope.myWelcome = response.data;
        $scope.name =$sessionStorage.real_name;
      }, function(errorPayload) {
          $scope.myWelcome = 'error';
      });
    };
  }]);
