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
angular.module('angularMaterialAdmin')
    .controller('DiscussCtrl',['authenticationservice','$scope','$sessionStorage','$routeParams','$location','authentication','Notification','$route','slackinteraction','$timeout','$cookieStore','$stateParams','$uibModal','navService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$state', '$mdToast',
                    function (authenticationservice,$scope,$sessionStorage,$routeParams,$location,authentication,Notification,$route,slackinteraction,$timeout,$cookieStore,$stateParams,$uibModal,navService, $mdSidenav, $mdBottomSheet, $log, $q, $state, $mdToast) {

        //ngMeta.setTag('description', 'Matthew Cooper');
        //ngMeta.setTag('og:title', 'My ass');

        var vm = this;

        vm.menuItems = [ ];
        vm.selectItem = selectItem;
        vm.toggleItemsList = toggleItemsList;
        vm.showActions = showActions;
        vm.title = $state.current.data.title;
        vm.showSimpleToast = showSimpleToast;
        vm.toggleRightSidebar = toggleRightSidebar;

        navService
            .loadAllItems()
            .then(function(menuItems) {
                vm.menuItems = [].concat(menuItems);
            });

        function toggleRightSidebar() {
            $mdSidenav('right').toggle();
        }

        function toggleItemsList() {
            var pending = $mdBottomSheet.hide() || $q.when(true);

            pending.then(function(){
                $mdSidenav('left').toggle();
            });
        }

        function selectItem (item) {
            vm.title = item.name;
            vm.toggleItemsList();
            vm.showSimpleToast(vm.title);
        }

        function showActions($event) {
            $mdBottomSheet.show({
                parent: angular.element(document.getElementById('content')),
                templateUrl: 'app/views/partials/bottomSheet.html',
                controller: [ '$mdBottomSheet', SheetController],
                controllerAs: "vm",
                bindToController : true,
                targetEvent: $event
            }).then(function(clickedItem) {
                clickedItem && $log.debug( clickedItem.name + ' clicked!');
            });

            function SheetController( $mdBottomSheet ) {
                var vm = this;

                vm.actions = [
                    { name: 'Share', icon: 'share', url: 'https://twitter.com/intent/tweet?text=Angular%20Material%20Dashboard%20https://github.com/flatlogic/angular-material-dashboard%20via%20@flatlogicinc' },
                    { name: 'Star', icon: 'star', url: 'https://github.com/flatlogic/angular-material-dashboard/stargazers' }
                ];

                vm.performAction = function(action) {
                    $mdBottomSheet.hide(action);
                };
            }
        }

        function showSimpleToast(title) {
            $mdToast.show(
                $mdToast.simple()
                    .content(title)
                    .hideDelay(2000)
                    .position('bottom right')
            );
        }

        //var state = $routeParams.state;
        var state = $state.params.state;
        var code = $state.params.code;
        console.log('state is  '+ state+' '+code);
        var tname = $stateParams.teamname;
        var ctopic = $stateParams.topic;

        $scope.state = state;
        var logged = 0;

        $scope.resize = function(evt,ui) {
            //console.log (evt,ui);
            $scope.w = ui.size.width;
            $scope.h = ui.size.height;
        }

        var url = $location.protocol()+'://'+location.host+$location.path();
        url = encodeURI(url);



        if(state == 'signin'){
            console.log('state is signin at '+ Date.now());
            logged = 1;
            //$scope.test = 't';
            var code = $state.params.code;
            //$sessionStorage.code =code;
            $scope.authcode = 'test';

            var auth = authenticationservice.authorize(code,url);
               auth.then(function (auth_succ) {

                   if(auth_succ.data.user.name == undefined){
                       $sessionStorage.user_id = auth_succ.data.user_id;
                       var prof = authenticationservice.getProfileid($sessionStorage.token,$sessionStorage.user_id);
                       prof.then(function (prof_succ) {
                          // console.log('fetched get_profile data '+ prof_succ);
                           $sessionStorage.real_name = prof_succ.data.user.name;
                                $cookieStore.put('real_name',$sessionStorage.real_name);
                           $sessionStorage.userid = prof_succ.data.user.id;
                                $cookieStore.put('userid',$sessionStorage.userid);
                           $scope.fname = $sessionStorage.real_name;
                           $scope.error = prof_succ.data.error;
                           $scope.authdata = prof_succ;
                           $sessionStorage.avator = prof_succ.data.user.image_48;
                                $cookieStore.put('avator',$sessionStorage.avator);
                           $scope.avator = $sessionStorage.avator;
                           $sessionStorage.team_id = prof_succ.data.team.id;
                                $cookieStore.put('team_id',$sessionStorage.team_id);
                           $sessionStorage.team = prof_succ.data.team.name;
                                $cookieStore.put('team',$sessionStorage.team);
                           $sessionStorage.islogged = 1;

                           $cookieStore.put('flowtalklog','logged');
                           console.log('fetched get_direct profile at'+ Date.now());
                           //console.log('fetched data '+ );

                       },function (prof_err) {
                           Notification({message: 'there was a problem fetching user profile'}, 'error');
                       });
                   }else{

                       $sessionStorage.token = auth_succ.data.access_token;
                       $scope.authdata = auth_succ.data;
                       $cookieStore.put('auth',auth_succ);
                       $sessionStorage.real_name = auth_succ.data.user.name;
                            $cookieStore.put('real_name',$sessionStorage.real_name);
                       $sessionStorage.userid = auth_succ.data.user.id;
                            $cookieStore.put('userid',$sessionStorage.userid);
                       $scope.fname = $sessionStorage.real_name;
                       $scope.error = auth_succ.data.error;
                       $sessionStorage.avator = auth_succ.data.user.image_48;
                            $cookieStore.put('avator',$sessionStorage.avator);
                       $scope.avator = $sessionStorage.avator;
                       $sessionStorage.team_id = auth_succ.data.team.id;
                            $cookieStore.put('team_id',$sessionStorage.team_id);
                       $sessionStorage.team = auth_succ.data.team.name;
                            $cookieStore.put('team',$sessionStorage.team);
                       $sessionStorage.islogged = 1;
                       //$scope.$apply();
                       $cookieStore.put('flowtalklog','logged');
                       //console.log('fetched direct profile data '+ auth_succ.data);
                       console.log('fetched direct profile at'+ Date.now());
                   }

                },function (auth_err) {
                    Notification({message: 'there was a problem authorizing slack'}, 'error');
                });
            //$location.search('code', null);
            //$location.search('state', null);

            //$scope.fname = $sessionStorage.real_name;
            //$scope.avator = $sessionStorage.avator;
            $scope.creates = false;

        }else if (state == 'add'){
            console.log('state is add at '+ Date.now());
            logged = 1;
            var code = $state.params.code;
            //$sessionStorage.code =code;
            //$scope.code = $sessionStorage.code;
            //$cookieStore.put('flowtalklog','logged');
            var auth = authenticationservice.authorize(code,url);
                auth.then(function (auth_succ) {
                    $sessionStorage.authtoken = auth_succ.data.access_token;
                        $cookieStore.put('authtoken',$sessionStorage.authtoken);
                            $cookieStore.put('auth',auth_succ);
                    //$cookieStore.put('flowtalklog','logged');
                    var bid = auth_succ.data.bot.bot_user_id;
                        $cookieStore.put('bid',bid);
                        $sessionStorage.bid = bid;
                    var btkn = auth_succ.data.bot.bot_access_token;
                        $cookieStore.put('btkn',btkn);
                        $sessionStorage.btkn = btkn;
                    $sessionStorage.userid = auth_succ.data.user_id;
                    $cookieStore.put('userid',$sessionStorage.userid);
                    $sessionStorage.team_id = auth_succ.data.team_id;
                    $cookieStore.put('team_id',$sessionStorage.team_id);
                    $sessionStorage.team = auth_succ.data.team_name;
                    $cookieStore.put('team',$sessionStorage.team);
                    var prof = authenticationservice.getProfile($sessionStorage.authtoken);
                    prof.then(function (prof_succ) {
                        $cookieStore.put('auth2',prof_succ);
                        //console.log('fetched auth_profile data '+ prof_succ);
                        $sessionStorage.real_name = prof_succ.data.profile.real_name_normalized;
                        $cookieStore.put('real_name',$sessionStorage.real_name);

                        //$scope.fname = $sessionStorage.real_name;
                        //$scope.error = prof_succ.data.error;
                        //$scope.authdata = prof_succ;
                        $sessionStorage.avator = prof_succ.data.profile.image_48;
                        $cookieStore.put('avator',$sessionStorage.avator);
                        //$scope.avator = $sessionStorage.avator;
                //$sessionStorage.real_name= $cookieStore.get('real_name');
                //$sessionStorage.userid = $cookieStore.get('userid');
                //$sessionStorage.avator = $cookieStore.get('avator');
                //$sessionStorage.team_id = $cookieStore.get('team_id');
                //$sessionStorage.team = $cookieStore.get('team');
                //$sessionStorage.bid = $cookieStore.get('bid');
                //$sessionStorage.btkn = $cookieStore.get('btkn');
                //$sessionStorage.authtoken = $cookieStore.get('authtoken');
                $scope.authdata = $cookieStore.get('auth');
                $scope.authdata2 = $cookieStore.get('auth2');
                        $scope.creates = false;

                

                        $cookieStore.put('flowtalklog','logged');
                        console.log('fetched auth_direct profile at'+ Date.now());
                            $scope.fname = $sessionStorage.real_name;
                            $scope.avator = $sessionStorage.avator;
                        console.log('set avator at'+ Date.now()+' name is '+$sessionStorage.real_name);
                var topics = authenticationservice.listtopic($sessionStorage.userid);
                topics.then( function (tresponse) {
                    //$scope.error = 'this';
                    $scope.topics = tresponse.data;
                    console.log('set topics at '+ Date.now()+' id  is '+$sessionStorage.userid);
                    //$scope.link =$sce.trustAsHtml(tresponse.data.link);
                }, function (error) {
                    //$location.path('/');
                    $scope.error = error.data;
                    console.log('error getting topics '+ Date.now()+' error is '+error.data.error);
                });
                        //console.log('fetched data '+ );

                    },function (prof_err) {
                        Notification({message: 'there was a problem fetching user profile'}, 'error');
                    });
                },function (auth_err) {
                    Notification({message: 'problem authenticating flowtalk with slack'}, 'error');
                });
            //$location.search('code', null);
            //$location.search('state', null);

            
        }else if(state == undefined && logged == 0){
            console.log('state is undefined at '+ Date.now());
                if($cookieStore.get('flowtalklog') == 'logged' ){
                $sessionStorage.real_name= $cookieStore.get('real_name');
                $sessionStorage.userid = $cookieStore.get('userid');
                $sessionStorage.avator = $cookieStore.get('avator');
                $sessionStorage.team_id = $cookieStore.get('team_id');
                $sessionStorage.team = $cookieStore.get('team');
                $sessionStorage.bid = $cookieStore.get('bid');
                $sessionStorage.btkn = $cookieStore.get('btkn');
                $sessionStorage.authtoken = $cookieStore.get('authtoken');
                $scope.authdata = $cookieStore.get('auth');
                $scope.authdata2 = $cookieStore.get('auth2');

                var topics = authenticationservice.listtopic($sessionStorage.userid);
                topics.then( function (tresponse) {
                    //$scope.error = 'this';
                    $scope.topics = tresponse.data;
                    console.log('set no_state topics at '+ Date.now()+' id  is '+$sessionStorage.userid);
                    //$scope.link =$sce.trustAsHtml(tresponse.data.link);
                }, function (error) {
                    //$location.path('/');
                    $scope.error = error.data;
                    console.log('error getting topics '+ Date.now()+' error is '+error.data.error);
                });
               /* var hook = authenticationservice.getahook($sessionStorage.team_id);
                    hook.then(function (hook_succ) {
                        $scope.hook = false;
                    },function (hook_err) {
                        $scope.hook = true;
                    });*/

                $scope.creates = false;
                $scope.fname = $sessionStorage.real_name;
                $scope.avator = $sessionStorage.avator;
                console.log('set no_state avator at'+ Date.now());


            }
            else{
                //$scope.authdata = $cookieStore.get('auth');
                //$scope.authdata2 = $cookieStore.get('auth2');
                //$scope.test = 'n';
                $scope.creates = false;
                $scope.fname = 'Guest';
                $scope.avator = 'images/guest.png';
                $scope.notlogged = true;
                console.log('set Guest avator at'+ Date.now());
            }
 
        }

        if($location.path()=='/home'){
            $scope.link= true;
        }else{
            $scope.toggle = true;
        }
        $scope.creates = false;
        /**
         * timeout test
         *
        $scope.callAtTimeout = function() {
            console.log("$scope.callAtTimeout - Timeout occurred");
        }*/
       /* $scope.callAtTimeout = function () {

            if($cookieStore.get('flowtalklog') == 'logged' ){
                $sessionStorage.real_name= $cookieStore.get('real_name');
                $sessionStorage.userid = $cookieStore.get('userid');
                $sessionStorage.avator = $cookieStore.get('avator');
                $sessionStorage.team_id = $cookieStore.get('team_id');
                $sessionStorage.team = $cookieStore.get('team');
                $sessionStorage.bid = $cookieStore.get('bid');
                $sessionStorage.btkn = $cookieStore.get('btkn');
                $sessionStorage.authtoken = $cookieStore.get('authtoken');
                $scope.authdata = $cookieStore.get('auth');
                $scope.authdata2 = $cookieStore.get('auth2');

                var topics = authenticationservice.listtopic($sessionStorage.userid);
                topics.then( function (tresponse) {
                    //$scope.error = 'this';
                    $scope.topics = tresponse.data;
                    //$scope.link =$sce.trustAsHtml(tresponse.data.link);
                }, function (error) {
                    //$location.path('/');
                    $scope.error = error.data;
                });
               /* var hook = authenticationservice.getahook($sessionStorage.team_id);
                    hook.then(function (hook_succ) {
                        $scope.hook = false;
                    },function (hook_err) {
                        $scope.hook = true;
                    });


                $scope.fname = $sessionStorage.real_name;
                $scope.avator = $sessionStorage.avator;
                console.log('set avator at'+ Date.now());


            }
            else{
                //$scope.authdata = $cookieStore.get('auth');
                //$scope.authdata2 = $cookieStore.get('auth2');
                //$scope.test = 'n';
                $scope.fname = 'Guest';
                $scope.avator = 'images/guest.png';
                console.log('set Guest avator at'+ Date.now());
            }

            //$scope.$apply();


        };

        $timeout( function(){ $scope.callAtTimeout(); }, 3000);*/


       /**
        $scope.code = code;
            /*var followedtopics = authenticationservice.getfollowedbyteam($sessionStorage.team_id);
            followedtopics.then(function (topics) {
                $scope.foltopics = topics.data;
            });
        */


        var vm = this;


        vm.ok = function () {
            var promise = authenticationservice.createtopic(vm.topic, $sessionStorage.userid, $sessionStorage.avator);
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

        vm.follow = function (topic,topicid) {
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

        vm.animationsEnabled = true;
        $scope.creates = false;

        vm.open = function (size) {
            if($sessionStorage.userid == null || $sessionStorage.userid == undefined){
                var modalInstance = $uibModal.open({
                    animation: vm.animationsEnabled,
                    arialabelledBy: 'modal-title2',
                    ariaDescribedBy: 'modal-body2',
                    templateUrl: 'signin.html',
                    controller:'MainCtrl',
                    controllerAs: 'vm',
                    size: size,
                });
            }else{
                $scope.creates = true;
            }

        };

        vm.openm = function (size) {
            if($sessionStorage.userid == null || $sessionStorage== undefined){
                var modalInstance = $uibModal.open({
                    animation: vm.animationsEnabled,
                    arialabelledBy: 'modal-title2',
                    ariaDescribedBy: 'modal-body2',
                    templateUrl: 'signin.html',
                    controller:'MainCtrl',
                    size: size,
                });
            }else{
                $location.path('/createtopic');
            }
        };
        
        vm.comment =function (id) {
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

        $scope.callAtTimeout = function () {
            $location.search('code', null);
            $location.search('state', null);
            console.log('cleared get parameters at'+ Date.now());
        };
        $timeout( function(){ $scope.callAtTimeout(); }, 3000);


                        //$scope.topi= 'chris';

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
