'use strict';

/**
 * @ngdoc function
 * @name slackchatApp.controller:CreatetopicCtrl
 * @description
 * # CreatetopicCtrl
 * Controller of the slackchatApp
 */
angular.module('slackchatApp')
  .controller('createtopicCtrl',['authenticationservice','users','$scope','$location','$sessionStorage', function (authenticationservice,users,$scope,$location,$sessionStorage) {
      var ctrl = this;

      ctrl.ok = function () {
          var create = authenticationservice.createtopic(ctrl.topic, $sessionStorage.userid, $sessionStorage.avator, $sessionStorage.real_name);
          create.then(function(response) {
              $location.path('/topics');
          }, function(errorPayload) {

              $location.path('/newtopics');
              $scope.error = errorPayload.data;
          });

      };

  }]);
