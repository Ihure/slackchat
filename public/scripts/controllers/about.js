'use strict';

/**
 * @ngdoc function
 * @name slackchatApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the slackchatApp
 */
angular.module('slackchatApp')
  .controller('AboutCtrl',['authenticationservice','$scope','$routeParams','users','$sessionStorage', function (authenticationservice,$scope, $routeParams, users,$sessionStorage) {
      /*$sessionStorage.userid = 'userid';
      $sessionStorage.real_name = 'real name';
      $sessionStorage.avator = 'images/yeoman.png';
        $scope.fname = $sessionStorage.real_name;
        $scope.avator = $sessionStorage.avator;*/
    var code = $routeParams.code;
    var promise = authenticationservice.authorize(code);
      promise.then(function(response) {
        //users.token = response.data.access_token;
        $sessionStorage.token = response.data.access_token;
        //$scope.token = response.data.access_token;
        $scope.token = $sessionStorage.token;
        //var user_id = response.data.user_id;
        //users.userid = response.data.user_id;
         $sessionStorage.userid = response.data.user_id;
            var user = authenticationservice.getProfile($sessionStorage.token,$sessionStorage.userid);
              user.then(function (user_response) {
                //users.real_name = user_response.data.profile.real_name;
                $sessionStorage.real_name = user_response.data.profile.real_name;
                $scope.fname = $sessionStorage.real_name;
                //users.avator = user_response.data.profile.image_24;
                $sessionStorage.avator = user_response.data.profile.image_24;
                $scope.avator = $sessionStorage.avator;
              }, function (user_error) {

              })
      }, function(errorPayload) {
        $scope.token = errorPayload;
      });
    $scope.code = code;
  }]);
