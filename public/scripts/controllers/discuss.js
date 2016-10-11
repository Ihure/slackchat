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
    .controller('DiscussCtrl',['authenticationservice','users','$scope','$sessionStorage','$uibModal','$routeParams','$location', function (authenticationservice,users,$scope,$sessionStorage,$uibModal,$routeParams,$location) {
        var code = $routeParams.code;
        if($sessionStorage.token=''){
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
        }
        else{
            $scope.fname = $sessionStorage.real_name;
            $scope.avator = $sessionStorage.avator;
        }
        $scope.code = code;

        var topics = authenticationservice.listtopic();
        topics.then( function (tresponse) {
            //$scope.error = 'this';
            $scope.topics = tresponse.data;
        }, function (error) {
            $location.path('/')
            $scope.error = error.data;
        });
        var limtopics = authenticationservice.getlimit();
        limtopics.then( function (tresponse) {
            //$scope.error = 'this';
            $scope.limtopics = tresponse.data;
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

        ctrl.animationsEnabled = true;

        ctrl.open = function (size) {
            var modalInstance = $uibModal.open({
                animation: ctrl.animationsEnabled,
                arialabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'addtopictemplate.html',
                controller:'createtopicCtrl',
                controllerAs: 'ctrl',
                size: size,
            });
        };
        
        ctrl.comment =function (id) {
            //var id = ctrl.id;
            $scope.topic = 'd';
            var promise = authenticationservice.gettopic(id);
            promise.then(function(response) {
                //$scope.topic = response.data;
                $scope.topic = 'd';
                var comments = authenticationservice.getdiscussion(id);
                comments.then(function (response) {
                        //$scope.comments= response.data;
                        $scope.comments= 'e';
                    $location.path('/comment');
                    }, function (error) {
                        //$scope.tokens = error.data;
                        $scope.tokens = 'f';
                    }
                );
            }, function(errorPayload) {
                //$scope.token = errorPayload.data;
                $scope.token = 'g';
            });

        }

    }]);
