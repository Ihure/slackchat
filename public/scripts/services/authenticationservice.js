'use strict';

/**
 * @ngdoc service
 * @name slackchatApp.authenticationservice
 * @description
 * # authenticationservice
 * Factory in the slackchatApp.
 */
angular.module('slackchatApp')
  .factory('authenticationservice',['$http', '$cookieStore', '$rootScope','$location', function ($http, $cookieStore, $rootScope,$location) {
    // Service logic
    // ...
    var service = {};

    return{
      authorize: function (code,url) {
        var data ={
          client_id:'87012615811.87769233137',
          client_secret:'e90b3fd0d83f266e7d3f25e7370f73d8',
          code:code,
          redirect_uri:url
        };
       return $http({
          method: "post",
          url: "https://slack.com/api/oauth.access",
          //transformRequest: transformRequestAsFormPost,
          data: $.param(data),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
          //return $http.post('https://slack.com/api/oauth.access', {client_id:'87012615811.87769233137',client_secret:'e90b3fd0d83f266e7d3f25e7370f73d8',code:code});
      },
      getProfileid: function (token,user) {
        var data ={
          token:token,
          user:user
        }
        return $http({
          method: "post",
          url: "https://slack.com/api/users.identity",
          data: $.param(data),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
      },
      getProfile: function (token) {
        var data ={
          token:token,
          //user:user
        }
        return $http({
          method: "post",
          url: "https://slack.com/api/users.profile.get",
          data: $.param(data),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
      },
      testapi: function (token,user) {
        return $http.get('/api/slacks');
      },
      createtopic: function (topic,user,avator,name,desc,link,tname,ctopic,url,encoded,tid,bid,btkn,userid) {
          var n = link.search("<iframe");
          var t = link.search("http");
          if(n >= 0){
              var status = 1;
          }else if( t>= 0){
              status = 0;
          }else {
              status = 2;
          }
          var data ={
              topic:topic,
              createdby:user,
              avator:avator
          }
          return $http({
              method: "post",
              url: "/api/slacks",
              data: {
                  topic:topic,
                  createdby:user,
                  avator:avator,
                  name:name,
                  description:desc,
                  link: link,
                  status: status,
                  cond_tname:tname,
                  cond_topic:ctopic,
                  url:url,
                  encoded:encoded,
                  team_id:tid,
                  bot_id: bid,
                  bot_token: btkn,
                  userid:userid
              }
          });
      },
    createhook: function (tkn,tnm,tid,wurl,wchnl,wcurl,bid,btkn,enc) {

     /* var data ={
          topic:topic,
          createdby:user,
          avator:avator
      }*/
      return $http({
          method: "post",
          url: "/api/hook",
          data: {
              token:tkn,
              team_name:tnm,
              team_id:tid,
              webhk_url:wurl,
              webhk_channel:wchnl,
              webhk_cnfgurl: wcurl,
              bot_id: bid,
              bot_token: btkn,
              encoded:enc
          }
      });
      },
     addfollow: function (user,userid,topic,topicid,weburl,bid,btkn,tmid) {
          return $http({
              method: "post",
              url: "/api/follow",
              data: {
                  user:user,
                  user_id:userid,
                  topic:topic,
                  topic_id:topicid,
                  webhk_url:weburl,
                  bot_id: bid,
                  bot_token: btkn,
                  team_id: tmid
              }
          });
      },
      listtopic: function (userid) {
          return $http.get('/api/topics/'+userid);
      },
      gettopic: function (tname,ctopic) {
          return $http.get('/api/slack/'+tname+'/'+ctopic);
      },
      getahook: function (id) {
          return $http.get('/api/hook/'+id);
      },
      getafollow: function (tmid,tpid) {
          return $http.get('/api/follow/'+tpid+'/'+tmid);
      },
      getfollowedbyteam: function (tmid) {
          return $http.get('/api/follows/'+tmid);
      },
      getlimit: function () {
          return $http.get('/api/topic');
      },
      getdiscussion: function (id) {
          return $http.get('/api/comment/'+id);
      },
      postcomments: function (id,body,user,avator,parentid,level,slugabv,fullslug,slug) {
          var level= level + 1;

         var myslug = Math.random().toString(36).substring(2,5);
          var fulslug = fullslug+'/'+myslug;

          return $http({
              method: "post",
              url: "/api/comment/",
              data: {
                  body:body,
                  user:user,
                  avator:avator,
                  parentid:parentid,
                  level:level,
                  slugabove:slugabv,
                  slug:myslug,
                  full_slug:fulslug,
                  _topic:id
              }
          });
      },

      ClearCredentials:function () {
        $rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'JWT';
      }
    };
  }]);
