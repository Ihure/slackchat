/**
 * Created by Chris on 10/8/2016.
 */
'use strict';

/**
 * @ngdoc function
 * @name slackchatApp.controller:CreatetopicCtrl
 * @description
 * # DiscussCtrl
 * Controller of the slackchatApp
 */
angular.module('slackchatApp')
    .controller('DiscussCtrl',['authenticationservice','users','$scope','$sessionStorage', function (authenticationservice,users,$scope,$sessionStorage) {
        var topics = authenticationservice.listtopic();
        topics.then( function (tresponse) {
            //$scope.error = 'this';
            $scope.topics = tresponse.data;
        }, function (error) {
            $location.path('/')
            $scope.error = error.data;
        });
        var ctrl = this;

        ctrl.ok = function () {
            var promise = authenticationservice.createtopic(ctrl.topic, $sessionStorage.userid, $sessionStorage.avator);
            promise.then(function(response) {
                // take user to list of topics
                var topics = authenticationservice.listtopic();
                topics.then( function (response) {
                    $scope.topics = response.data;
                    $location.path('/topics');
                }), function () {
                    $location.path('/error')
                }
            }, function(errorPayload) {
                $location.path('/newtopic');
            });
        };

    }]);
