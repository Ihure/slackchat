'use strict';

/**
 * @ngdoc function
 * @name slackchatApp.controller:CreatetopicCtrl
 * @description
 * # CreatetopicCtrl
 * Controller of the slackchatApp
 */
angular.module('slackchatApp')
  .controller('createtopicCtrl',['authenticationservice','users','$scope','$location','$sessionStorage','$uibModalInstance','$route', function (authenticationservice,users,$scope,$location,$sessionStorage,$uibModalInstance,$route) {
      var ctrl = this;

      ctrl.ok = function () {
          var create = authenticationservice.createtopic(ctrl.topic, $sessionStorage.userid, $sessionStorage.avator, $sessionStorage.real_name,ctrl.desc);
          create.then(function(response) {
              $uibModalInstance.dismiss('cancel');
              //$location.path('/home');
              $route.reload();
          }, function(errorPayload) {

              $location.path('/newtopics');
              $scope.error = errorPayload.data;
          });

      };

      ctrl.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };

  }]);
