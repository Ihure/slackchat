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
    .controller('DiscussCtrl',['authenticationservice','users','$scope','$sessionStorage','$uibModal','$routeParams','$location','authentication','Notification','$route','slackinteraction','$timeout','$cookieStore', function (authenticationservice,users,$scope,$sessionStorage,$uibModal,$routeParams,$location,authentication,Notification,$route,slackinteraction,$timeout,$cookieStore) {

        //ngMeta.setTag('description', 'Matthew Cooper');
        //ngMeta.setTag('og:title', 'My ass');

        var state = $routeParams.state;
        var tname = $routeParams.teamname;
        var ctopic = $routeParams.topic;

        $scope.state = state;

        var url = $location.protocol()+'://'+location.host+$location.path();
        url = encodeURI(url);

        if(state == 'signin'){
            //$scope.test = 't';
            var code = $routeParams.code;
            //$sessionStorage.code =code;
            $scope.authcode = 'test';

            var auth = authenticationservice.authorize(code,url);
               auth.then(function (auth_succ) {

                   if(auth_succ.data.user.name == undefined){
                       $sessionStorage.user_id = auth_succ.data.user_id;
                       var prof = authenticationservice.getProfile($sessionStorage.token,$sessionStorage.user_id);
                       prof.then(function (prof_succ) {
                           $sessionStorage.real_name = prof_succ.data.user.name;
                                $cookieStore.put('real_name',$sessionStorage.real_name);
                           $sessionStorage.userid = prof_succ.data.user.id;
                                $cookieStore.put('userid',$sessionStorage.userid);
                           $scope.fname = $sessionStorage.real_name;
                           $scope.error = prof_succ.data.error;
                           $scope.authdata = prof_succ;
                           $sessionStorage.avator = prof_succ.data.user.image_24;
                                $cookieStore.put('avator',$sessionStorage.avator);
                           $scope.avator = $sessionStorage.avator;
                           $sessionStorage.team_id = prof_succ.data.team.id;
                                $cookieStore.put('team_id',$sessionStorage.team_id);
                           $sessionStorage.team = prof_succ.data.team.name;
                                $cookieStore.put('team',$sessionStorage.team);
                           $sessionStorage.islogged = 1;

                           $cookieStore.put('flowtalklog','logged');
                           console.log('fetched direct profile at'+ Date.now());

                       },function (prof_err) {
                           Notification({message: 'there was a problem fetching user profile'}, 'error');
                       });
                   }else{
                       $sessionStorage.token = auth_succ.data.access_token;
                       $scope.authdata = auth_succ;
                       $sessionStorage.real_name = auth_succ.data.user.name;
                            $cookieStore.put('real_name',$sessionStorage.real_name);
                       $sessionStorage.userid = auth_succ.data.user.id;
                            $cookieStore.put('userid',$sessionStorage.userid);
                       $scope.fname = $sessionStorage.real_name;
                       $scope.error = auth_succ.data.error;
                       $sessionStorage.avator = auth_succ.data.user.image_24;
                            $cookieStore.put('avator',$sessionStorage.avator);
                       $scope.avator = $sessionStorage.avator;
                       $sessionStorage.team_id = auth_succ.data.team.id;
                            $cookieStore.put('team_id',$sessionStorage.team_id);
                       $sessionStorage.team = auth_succ.data.team.name;
                            $cookieStore.put('team',$sessionStorage.team);
                       $sessionStorage.islogged = 1;
                       //$scope.$apply();
                       $cookieStore.put('flowtalklog','logged');
                       console.log('fetched get_profile at'+ Date.now());
                   }

                },function (auth_err) {
                    Notification({message: 'there was a problem authorizing slack'}, 'error');
                });
            $location.search('code', null);
            $location.search('state', null);

            //$scope.fname = $sessionStorage.real_name;
            //$scope.avator = $sessionStorage.avator;

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

        /**
         * timeout test
         *
        $scope.callAtTimeout = function() {
            console.log("$scope.callAtTimeout - Timeout occurred");
        }*/
        $scope.callAtTimeout = function () {

            if($cookieStore.get('flowtalklog') == 'logged' ){
                $sessionStorage.real_name= $cookieStore.get('real_name');
                $sessionStorage.userid = $cookieStore.get('userid');
                $sessionStorage.avator = $cookieStore.get('avator');
                $sessionStorage.team_id = $cookieStore.get('team_id');
                $sessionStorage.team = $cookieStore.get('team');
                var topics = authenticationservice.listtopic($sessionStorage.userid);
                topics.then( function (tresponse) {
                    //$scope.error = 'this';
                    $scope.topics = tresponse.data;
                    //$scope.link =$sce.trustAsHtml(tresponse.data.link);
                }, function (error) {
                    //$location.path('/');
                    $scope.error = error.data;
                });

                $scope.fname = $sessionStorage.real_name;
                $scope.avator = $sessionStorage.avator;
                console.log('set avator at'+ Date.now());


            }
            else{
                //$scope.test = 'n';
                $scope.fname = 'Guest';
                $scope.avator = 'images/guest.png';
                console.log('set Guest avator at'+ Date.now());
            }

            $scope.$apply();
            /*if($cookieStore.get('reply') == 'comment'){
                var rtext = $cookieStore.get('rtext');
                var rid = $cookieStore.get('rid');
                var rpid = $cookieStore.get('rpid');
                var rlvl = $cookieStore.get('rlvl');
                var rslabv = $cookieStore.get('rslabv');
                var rfslg = $cookieStore.get('rfslg');
                var rslg = $cookieStore.get('rslg')
                var promises = authenticationservice.postcomments(rid,rtext, $sessionStorage.real_name, $sessionStorage.avator,rpid,rlvl,rslabv,rfslg,rslg);
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
            }*/

        };

        $timeout( function(){ $scope.callAtTimeout(); }, 500);

        /*$scope.callreply = function () {
            if($cookieStore.get('reply') == 'comment'){
                var rtext = $cookieStore.get('rtext');
                var rid = $cookieStore.get('rid');
                var rpid = $cookieStore.get('rpid');
                var rlvl = $cookieStore.get('rlvl');
                var rslabv = $cookieStore.get('rslabv');
                var rfslg = $cookieStore.get('rfslg');
                var rslg = $cookieStore.get('rslg')
                var promises = authenticationservice.postcomments(rid,rtext, $sessionStorage.real_name, $sessionStorage.avator,rpid,rlvl,rslabv,rfslg,rslg);
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
            }
            $scope.$apply()
        };

        $timeout( function(){ $scope.$apply(function () {
            $scope.callreply();
        }); }, 1600);*/
        //$timeout(updatescope, 4000);

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

        //$scope.authcode = 'test';


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
                    templateUrl: 'addtopic.html',
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
function updatescope () {
    if($sessionStorage.real_name == null){
        //$scope.test = 'n';
        $scope.fname = 'Guest';
        $scope.avator = 'images/guest.png';
    }
    else{
        var topics = authenticationservice.listtopic($sessionStorage.userid);
        topics.then( function (tresponse) {
            //$scope.error = 'this';
            $scope.topics = tresponse.data;
            //$scope.link =$sce.trustAsHtml(tresponse.data.link);
        }, function (error) {
            //$location.path('/');
            $scope.error = error.data;
        });

        $scope.fname = $sessionStorage.real_name;
        $scope.avator = $sessionStorage.avator;
    }

    //$scope.$apply();


}
