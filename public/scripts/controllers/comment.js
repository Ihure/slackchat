/**
 * Created by Chris on 10/8/2016.
 */
'use strict';

/**
 * @ngdoc function
 * @name slackchatApp.controller:CreatetopicCtrl
 * @description
 * # commentCtrl
 * Controller of the slackchatApp
 */
angular.module('slackchatApp')
    .controller('CommentCtrl',['authenticationservice','users','$routeParams','$scope','$location','$sessionStorage','$uibModal', function (authenticationservice,users,$routeParams,$scope,$location,$sessionStorage,$uibModal) {
        var ctrl = this;

       //var id = $routeParams.id;
       var tname = $routeParams.teamname;
       var ctopic = $routeParams.topic;
        var promise = authenticationservice.gettopic(tname,ctopic);
            promise.then(function(response) {
                $scope.topic = response.data;
                var id = response.data._id;
                    var comments = authenticationservice.getdiscussion(id);
                        comments.then(function (response) {
                           $scope.comments= response.data;
                        }, function (error) {
                            $scope.token = error.data;
                            }
                        )
            }, function(errorPayload) {
                $scope.token = errorPayload.data;
            });
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
        ctrl.rep = function (parentid,level,slugabove,fullslug,slug) {
            if($sessionStorage.userid == null || $sessionStorage== undefined){
                var modalInstance = $uibModal.open({
                    animation: ctrl.animationsEnabled,
                    arialabelledBy: 'modal-title2',
                    ariaDescribedBy: 'modal-body2',
                    templateUrl: 'signin.html',
                    size: size,
                });
            }else {


                if (level == 0) {
                    var text = ctrl.reply0;
                } else if (level == 1) {
                    var text = ctrl.reply1;
                } else if (level == 2) {
                    var text = ctrl.reply2;
                } else if (level == 3) {
                    var text = ctrl.reply3;
                }
                else {
                    var text = ctrl.reply4;
                }
                var promise = authenticationservice.postcomments(id, text, $sessionStorage.real_name, $sessionStorage.avator, parentid, level, slugabove, fullslug, slug);
                promise.then(function (response) {
                    var promise = authenticationservice.gettopic(id);
                    promise.then(function (response) {
                        $scope.topic = response.data;
                        var comments = authenticationservice.getdiscussion(id);
                        comments.then(function (responsec) {
                                $scope.comments = responsec.data;
                                $scope.repsec0 = false;
                            }, function (errorc) {
                                $scope.token = errorc.data;
                            }
                        )
                    }, function (errorPayload) {
                        $scope.token = errorPayload.data;
                    });
                }, function (errorPayload) {
                    $location.path('/newtopic');
                });
            }
        };

        

        $scope.fname = $sessionStorage.real_name;
        $scope.avator = $sessionStorage.avator;

    }]);
