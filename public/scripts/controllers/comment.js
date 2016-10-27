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
    .controller('CommentCtrl',['authenticationservice','users','$routeParams','$scope','$location','$sessionStorage','$uibModal','Notification','$timeout','$cookieStore', function (authenticationservice,users,$routeParams,$scope,$location,$sessionStorage,$uibModal,Notification,$timeout,$cookieStore) {



        //ngMeta.setTag('description', 'Matthew Cooper');
        //ngMeta.setTag('image', 'http://placeholder.com/abc.jpg');
        var ctrl = this;

       //var id = $routeParams.id;
        var state = $routeParams.state;
       var tname = $routeParams.teamname;
       var ctopic = $routeParams.topic;

        ctrl.animationsEnabled = true;

        ctrl.openm = function (size) {
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
        var promises = authenticationservice.gettopic(tname,ctopic);
                                promises.then(function(response) {
                                    $scope.topicc = response.data;
                                    var id = response.data._id;
                                    var commentsc = authenticationservice.getdiscussion(id);
                                    commentsc.then(function (response) {
                                            $scope.commentsc= response.data;
                                        }, function (error) {
                                            $scope.token = error.data;
                                        }
                                    )
                                }, function(errorPayload) {
                                    $scope.token = errorPayload.data;
                                });
        $scope.callAtreply = function () {
            //$scope.$apply();
            if($cookieStore.get('reply') == 'comment' && state == 'signin'){
                var rtext = $cookieStore.get('rtext');
                var rid = $cookieStore.get('rid');
                var rpid = $cookieStore.get('rpid');
                var rlvl = $cookieStore.get('rlvl');
                var rslabv = $cookieStore.get('rslabv');
                var rfslg = $cookieStore.get('rfslg');
                var rslg = $cookieStore.get('rslg')
                var real_name = $cookieStore.get('real_name');
                var avator = $cookieStore.get('avator');
                var promises = authenticationservice.postcomments(rid,rtext,real_name,avator,rpid,rlvl,rslabv,rfslg,rslg);
                promises.then(function (response) {
                    var promise = authenticationservice.gettopic(tname,ctopic);
                    promise.then(function (response) {
                        $scope.topic = response.data;
                        var comments = authenticationservice.getdiscussion(rid);
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

                //$sessionStorage.reply = 'reply';
                $cookieStore.put('reply','reply');
                console.log('add comment at'+ Date.now());
            }
            else{
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
                console.log('fetched topic and comments at'+ Date.now());
            }

        };

        $timeout( function(){ $scope.callAtreply(); }, 800);


        ctrl.rep = function (id,parentid,level,slugabove,fullslug,slug) {
            if($sessionStorage.userid == null || $sessionStorage== undefined){
                $cookieStore.put('reply','comment');
                //$sessionStorage.reply = 'comment';
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
                //$sessionStorage.rtext = text;
                $cookieStore.put('rtext',text);
                //$sessionStorage.rid = id;
                $cookieStore.put('rid',id);
                //$sessionStorage.rpid = parentid;
                $cookieStore.put('rpid',parentid);
                //$sessionStorage.rlvl =level;
                $cookieStore.put('rlvl',level);
                //$sessionStorage.rslabv = slugabove;
                $cookieStore.put('rslabv',slugabove);
                //$sessionStorage.rfslg = fullslug;
                $cookieStore.put('rfslg',fullslug);
                //$sessionStorage.rslg = slug;
                $cookieStore.put('rslg',slug);
                var modalInstance = $uibModal.open({
                    animation: ctrl.animationsEnabled,
                    arialabelledBy: 'modal-title2',
                    ariaDescribedBy: 'modal-body2',
                    templateUrl: 'signin2.html',
                    controller:'CommentCtrl',
                    controllerAs: 'ctrl'
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
                    var promise = authenticationservice.gettopic(tname,ctopic);
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

        $scope.onSuccess = function(e) {
            Notification({message: 'Link copied to clipboard'}, 'success');
        };
        
                $scope.fname = $sessionStorage.real_name;
                $scope.avator = $sessionStorage.avator;

    }]);
