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
    .controller('CommentCtrl',['authenticationservice','users','$routeParams','$scope','$location','$sessionStorage', function (authenticationservice,users,$routeParams,$scope,$location,$sessionStorage) {
        var ctrl = this;

       var id = $routeParams.id;
        var promise = authenticationservice.gettopic(id);
            promise.then(function(response) {
                $scope.topic = response.data;
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

        ctrl.rep = function (parentid,level,slugabove,fullslug,slug) {
            if(level==0){
                var text = ctrl.reply0;
            }else if(level== 1){
                var text = ctrl.reply1;
            }else{
                var text = ctrl.reply2;
            }
            var promise = authenticationservice.postcomments(id,text, $sessionStorage.real_name,$sessionStorage.avator,parentid,level,slugabove,fullslug,slug);
                promise.then(function(response) {
                    var promise = authenticationservice.gettopic(id);
                        promise.then(function(response) {
                        $scope.topic = response.data;
                        var comments = authenticationservice.getdiscussion(id);
                        comments.then(function (responsec) {
                                $scope.comments= responsec.data;
                            }, function (errorc) {
                                $scope.token = errorc.data;
                            }
                        )
                    }, function(errorPayload) {
                        $scope.token = errorPayload.data;
                    });
            }, function(errorPayload) {
                $location.path('/newtopic');
            });
        };

        $scope.fname = $sessionStorage.real_name;
        $scope.avator = $sessionStorage.avator;

    }]);
