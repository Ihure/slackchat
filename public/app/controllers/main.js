'use strict';

/**
 * @ngdoc function
 * @name slackchatApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the slackchatApp
 */
angular.module('angularMaterialAdmin')
  .controller('MainCtrl', function ($scope,$location) {
      var url = $location.protocol()+'://'+location.host+'/home';
      $scope.url = encodeURI(url);
    //$sessionStorage.islogged=0;
  });
