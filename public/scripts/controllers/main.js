'use strict';

/**
 * @ngdoc function
 * @name slackchatApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the slackchatApp
 */
angular.module('slackchatApp')
  .controller('MainCtrl', function ($sessionStorage) {
    $sessionStorage.islogged=0;
  });
