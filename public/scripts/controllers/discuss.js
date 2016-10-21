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
    .controller('DiscussCtrl',['authenticationservice','users','$scope','$sessionStorage','$uibModal','$routeParams','$location','authentication','Notification','$route','slackinteraction', function (authenticationservice,users,$scope,$sessionStorage,$uibModal,$routeParams,$location,authentication,Notification,$route,slackinteraction) {

        var state = $routeParams.state;
        var code = $routeParams.code;

        if(state == 'signin'){
            $sessionStorage.fcode = code;
            //$sessionStorage.authorize = true;
            var promise = authenticationservice.authorize($sessionStorage.fcode);
            promise.then(function(response) {
                //var scope = response.data.scope;
                $sessionStorage.token = response.data.access_token;
                $scope.token = $sessionStorage.token;
                $sessionStorage.userid = response.data.user_id;

                    var user = authenticationservice.getProfile($sessionStorage.token,$sessionStorage.userid);
                    user.then(function (user_response) {
                        //users.real_name = user_response.data.profile.real_name;
                        $sessionStorage.real_name = user_response.data.user.name;
                        $sessionStorage.userid = user_response.data.user.id;
                        $scope.fname = $sessionStorage.real_name;
                        $scope.error = user_response.data.error;
                        $scope.data = user_response.data;
                        //users.avator = user_response.data.profile.image_24;
                        $sessionStorage.avator = user_response.data.user.image_24;
                        $scope.avator = $sessionStorage.avator;
                        $sessionStorage.team_id = user_response.data.team.id;
                        $sessionStorage.team = user_response.data.team.name;
                        $sessionStorage.islogged = 1;
                        
                    }, function (user_error) {

                    })
            }, function(errorPayload) {
                $scope.token = errorPayload;
            });
             $location.search('code', null);
             $location.search('state', null);

        }
        else if(state == 'add'){
                    $sessionStorage.scode = code;
                    var promise = authenticationservice.authorize($sessionStorage.scode);
                    promise.then(function (response) {
                        //Notification({message: 'adding flowtalk to your team'+response.data.incoming_webhook.url}, 'success');
                        //$scope.data = response.data;
                        $sessionStorage.authtoken = response.data.access_token;
                        $scope.token = $sessionStorage.authtoken;
                        //$sessionStorage.userid = response.data.user_id;
                        var tname = response.data.team_name;
                        $sessionStorage.team =tname;
                        var tid = response.data.team_id;
                        $sessionStorage.team_id = tid;
                        var wurl = response.data.incoming_webhook.url;
                        var wchnl = response.data.incoming_webhook.channel;
                        var wcurl = response.data.incoming_webhook.configuration_url;
                        var bid = response.data.bot.bot_user_id;
                        var btkn = response.data.bot.bot_access_token;

                        var dhook = authenticationservice.getahook(tid);
                        dhook.then( function (thehook) {
                            if(thehook.data.webhk_url == undefined){
                                var create = authenticationservice.createhook($sessionStorage.authtoken,tname,tid,wurl,wchnl,wcurl,bid,btkn);
                                create.then(function(success){
                                    var post = slackinteraction.welcome(wurl);
                                    post.then(function (succ) {
                                        //Notification({message: 'slack response '}, 'success');
                                    },function (err) {
                                        Notification({message: 'slack error '+err.data}, 'error');
                                    })

                                    Notification({message: 'flowtalk was successfully added, you can now add topics here or through slack'}, 'success');

                                },function (error) {
                                    Notification({message: 'there was a problem creating a hook '+error.data}, 'error');
                                });
                            }else{
                                Notification({message: 'Flowtalk has already been added to your team'}, 'warning');
                            }
                        },function (thehookerr) {
                            Notification({message: 'problem querying database '+thehookerr.data.error}, 'error');
                        })

                    });
            /* }else{
                    Notification({message: 'Flowtalk has already been added to your team'}, 'warning');
                }
            },function (hookerror) {
                Notification({message: 'there was a problem fetching database'}, 'error');
            });*/

            $location.search('code', null);
            $location.search('state', null);

            $scope.fname = $sessionStorage.real_name;
            $scope.avator = $sessionStorage.avator;
        }
        else if($sessionStorage.real_name== null){
                $scope.fname = 'Guest';
                $scope.avator = 'images/guest.png';
        }
        else{
            $scope.fname = $sessionStorage.real_name;
            $scope.avator = $sessionStorage.avator;
        }

        $scope.code = code;
        if($sessionStorage.real_name == null){

        }else{
            var topics = authenticationservice.listtopic($sessionStorage.userid);
            topics.then( function (tresponse) {
                //$scope.error = 'this';
                $scope.topics = tresponse.data;
                //$scope.link =$sce.trustAsHtml(tresponse.data.link);
            }, function (error) {
                $location.path('/');
                $scope.error = error.data;
            });

            /*var followedtopics = authenticationservice.getfollowedbyteam($sessionStorage.team_id);
            followedtopics.then(function (topics) {
                $scope.foltopics = topics.data;
            });*/
        }

       /* var limtopics = authenticationservice.getlimit();
        limtopics.then( function (tresponse) {
            //$scope.error = 'this';
            $scope.limtopics = tresponse.data;
        }, function (error) {
            $location.path('/');
            $scope.error = error.data;
        });*/


        var ctrl = this;


        ctrl.ok = function () {
            var promise = authenticationservice.createtopic(ctrl.topic, $sessionStorage.userid, $sessionStorage.avator);
            promise.then(function(response) {
                // take user to list of topics
                var topics = authenticationservice.listtopic();
                topics.then( function (response) {
                    $scope.topics = response.data;
                    $location.path('/topics');
                }, function () {
                    $location.path('/error')
                })
            }, function(errorPayload) {
                $location.path('/newtopic');
            });
        };

        ctrl.follow = function (topic,topicid) {
            var getfollow = authenticationservice.getafollow($sessionStorage.team_id,topicid);
            //var getfollow = authenticationservice.gettopic(topicid);
                getfollow.then(function (success) {

                    if(success.data.topic_id == undefined){
                        var gethook = authenticationservice.getahook($sessionStorage.team_id);
                        gethook.then(function (success) {

                            var weburl = success.data.webhk_url;
                            var bid = success.data.bot_id;
                            var btkn = success.data.bot_token;
                            //$scope.ferror = 'b';
                            if(weburl == null){
                                Notification({message: 'Ask your team admin to add flowtalk to your team before you can follow a topic'}, 'error');
                            }else{
                                var addfollow = authenticationservice.addfollow($sessionStorage.real_name,$sessionStorage.userid,topic,topicid,weburl,bid,btkn,$sessionStorage.team_id);
                                Notification({message: 'This topic has been added to your team'}, 'success');
                            }

                        }, function (error) {
                            Notification({message: 'Unable to add topic to your team'}, 'warning');
                            //$scope.ferror = 'c';
                        });
                    }else{


                        Notification({message: 'This Topic has already been followed by a member of your team'}, 'warning');
                    }
                   /* if (success.data.user){
                        Notification({message: 'This Topic has already been followed by a member of your team'}, 'warning');
                    }else{
                        var gethook = authenticationservice.getahook($sessionStorage.team_id);
                        gethook.then(function (success) {

                            var weburl = success.data.webhk_url;
                            var bid = success.data.bot_id;
                            var btkn = success.data.bot_token;
                            //$scope.ferror = 'b';
                            var addfollow = authenticationservice.addfollow($sessionStorage.real_name,$sessionStorage.userid,topic,topicid,weburl,bid,btkn,$sessionStorage.team_id);
                            Notification({message: 'This topic has been added to your team'}, 'success');
                        }, function (error) {
                            Notification({message: 'Unable to add topic to your team'}, 'warning');
                            //$scope.ferror = 'c';
                        });
                    }*/
                },function (errorgetfollow) {
                    Notification({message: 'error getting team'}, 'warning');

                });

            $route.reload();
        };

        ctrl.animationsEnabled = true;

        ctrl.open = function (size) {
            if($sessionStorage.userid == null || $sessionStorage.userid == undefined){
                var modalInstance = $uibModal.open({
                    animation: ctrl.animationsEnabled,
                    arialabelledBy: 'modal-title2',
                    ariaDescribedBy: 'modal-body2',
                    templateUrl: 'signin.html',
                    controller:'createtopicCtrl',
                    controllerAs: 'ctrl',
                    size: size,
                });
            }else{
                var modalInstance = $uibModal.open({
                    animation: ctrl.animationsEnabled,
                    arialabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'addtopictemplate.html',
                    controller:'createtopicCtrl',
                    controllerAs: 'ctrl',
                    size: size,
                });
            }

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
