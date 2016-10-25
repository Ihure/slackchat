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

        //ngMeta.setTag('description', 'Matthew Cooper');
        //ngMeta.setTag('og:title', 'My ass');

        var state = $routeParams.state;

        $scope.state = state;


        if(state == 'signin'){
            //$scope.test = 't';
            var code = $routeParams.code;
            //$sessionStorage.code =code;
            //$scope.code = $sessionStorage.code;

            var auth = authenticationservice.authorize(code);
               auth.then(function (auth_succ) {
                   $sessionStorage.token = auth_succ.data.access_token;
                   $sessionStorage.user_id = auth_succ.data.user_id;
                   $sessionStorage.real_name = auth_succ.data.user.name;
                   $sessionStorage.userid = auth_succ.data.user.id;
                   $scope.fname = $sessionStorage.real_name;
                   $scope.error = auth_succ.data.error;
                   //$scope.authdata = auth_succ;
                   $sessionStorage.avator = auth_succ.data.user.image_24;
                   $scope.avator = $sessionStorage.avator;
                   $sessionStorage.team_id = auth_succ.data.team.id;
                   $sessionStorage.team = auth_succ.data.team.name;
                   $sessionStorage.islogged = 1;
                   if($sessionStorage.user_id == undefined){

                   }else{
                       var prof = authenticationservice.getProfile($sessionStorage.token,$sessionStorage.user_id);
                       prof.then(function (prof_succ) {
                           $sessionStorage.real_name = prof_succ.data.user.name;
                           $sessionStorage.user_id = prof_succ.data.user.id;
                           $scope.fname = $sessionStorage.real_name;
                           $scope.error = prof_succ.data.error;
                           $scope.authdata = prof_succ;
                           $sessionStorage.avator = prof_succ.data.user.image_24;
                           $scope.avator = $sessionStorage.avator;
                           $sessionStorage.team_id = prof_succ.data.team.id;
                           $sessionStorage.team = prof_succ.data.team.name;
                           $sessionStorage.islogged = 1;


                       },function (prof_err) {
                           Notification({message: 'there was a problem fetching user profile'}, 'error');
                       });
                   }

                },function (auth_err) {
                    Notification({message: 'there was a problem authorizing slack'}, 'error');
                });
            $location.search('code', null);
            $location.search('state', null);

            $scope.fname = $sessionStorage.real_name;
            $scope.avator = $sessionStorage.avator;

        }else if (state == 'add'){
            var code = $routeParams.code;
            //$sessionStorage.code =code;
            //$scope.code = $sessionStorage.code;

            var auth = authenticationservice.authorize(code);
                auth.then(function (auth_succ) {
                    $sessionStorage.authtoken = auth_succ.data.access_token;
                    var tname = auth_succ.data.team_name;
                    $sessionStorage.team = tname;
                    var tid = auth_succ.data.team_id;
                    $sessionStorage.team_id = tid;
                    var wurl = auth_succ.data.incoming_webhook.url;
                    var wchnl = auth_succ.data.incoming_webhook.channel;
                    var wcurl = auth_succ.data.incoming_webhook.configuration_url;
                    var bid = auth_succ.data.bot.bot_user_id;
                    var btkn = auth_succ.data.bot.bot_access_token;
                    
                    var hook = authenticationservice.getahook(tid);
                        hook.then(function (hook_succ) {
                            if(hook_succ.data.webhk_url == undefined){
                                var createHook = authenticationservice.createhook($sessionStorage.authtoken,tname,tid,wurl,wchnl,wcurl,bid,btkn);
                                    createHook.then(function (ch_succ) {
                                        var post = slackinteraction.welcome(wurl);
                                            post.then(function (succ) {
                                                //Notification({message: 'slack response '}, 'success');
                                            },function (err) {
                                                Notification({message: 'slack error '+err.data}, 'error');
                                            });

                                        Notification({message: 'flowtalk was successfully added, you can now add topics here or through slack'}, 'success');

                                    },function (ch_err) {
                                        Notification({message: 'there was a problem creating a hook '+ch_err.data}, 'error');
                                    });
                            }else{
                                Notification({message: 'Flowtalk has already been added to your team'}, 'warning');
                            }
                        }, function (hook_err) {
                            Notification({message: 'problem querying database '+hook_err.data.error}, 'error');
                        });
                },function (auth_err) {
                    Notification({message: 'problem authenticating flowtalk with slack'}, 'error');
                });
            //$location.search('code', null);
            //$location.search('state', null);

            $scope.fname = $sessionStorage.real_name;
            $scope.avator = $sessionStorage.avator;
        }


        if($sessionStorage.userid == null){

        }else{
            var topics = authenticationservice.listtopic($sessionStorage.userid);
            topics.then( function (tresponse) {
                //$scope.error = 'this';
                $scope.topics = tresponse.data;
                //$scope.link =$sce.trustAsHtml(tresponse.data.link);
            }, function (error) {
                //$location.path('/');
                $scope.error = error.data;
            });
        }

       /**
        $scope.code = code;
            /*var followedtopics = authenticationservice.getfollowedbyteam($sessionStorage.team_id);
            followedtopics.then(function (topics) {
                $scope.foltopics = topics.data;
            });
        */

       /* var limtopics = authenticationservice.getlimit();
        limtopics.then( function (tresponse) {
            //$scope.error = 'this';
            $scope.limtopics = tresponse.data;
        }, function (error) {
            $location.path('/');
            $scope.error = error.data;
        });*/
        if($sessionStorage.real_name == null){
            $scope.test = 'n';
            $scope.fname = 'Guest';
            $scope.avator = 'images/guest.png';
        }
        else{
            $scope.fname = $sessionStorage.real_name;
            $scope.avator = $sessionStorage.avator;
        }



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
                    controller:'MainCtrl',
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

        ctrl.openm = function (size) {
            if($sessionStorage.userid == null || $sessionStorage== undefined){
                var modalInstance = $uibModal.open({
                    animation: ctrl.animationsEnabled,
                    arialabelledBy: 'modal-title2',
                    ariaDescribedBy: 'modal-body2',
                    templateUrl: 'signin2.html',
                    controller:'CommentCtrl',
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

        };

        var url = $location.protocol()+'://'+location.host+'/home';
        $scope.url = encodeURI(url);

        //$location.search('code', null);
        //$location.search('state', null);

    }]);
