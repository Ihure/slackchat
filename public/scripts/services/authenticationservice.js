'use strict';

/**
 * @ngdoc service
 * @name slackchatApp.authenticationservice
 * @description
 * # authenticationservice
 * Factory in the slackchatApp.
 */
angular.module('slackchatApp')
  .factory('authenticationservice',['$http', '$cookieStore', '$rootScope', function ($http, $cookieStore, $rootScope) {
    // Service logic
    // ...
    var service = {};

    return{
      authorize: function (code) {
        var data ={
          client_id:'87012615811.87769233137',
          client_secret:'e90b3fd0d83f266e7d3f25e7370f73d8',
          code:code
        }
       return $http({
          method: "post",
          url: "https://slack.com/api/oauth.access",
          //transformRequest: transformRequestAsFormPost,
          data: $.param(data),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
          //return $http.post('https://slack.com/api/oauth.access', {client_id:'87012615811.87769233137',client_secret:'e90b3fd0d83f266e7d3f25e7370f73d8',code:code});
      },
      getProfile: function (token,user) {
        var data ={
          token:token,
          user:user
        }
        return $http({
          method: "post",
          url: "https://slack.com/api/users.profile.get",
          data: $.param(data),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
      },
      testapi: function (token,user) {
        return $http.get('/api/comment');
      },
      createtopic: function (topic,user,avator,name) {
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
                  name:name
              }
          });
      },
      listtopic: function () {
          return $http.get('/api/slacks');
      },
      gettopic: function (id) {
          return $http.get('/api/slacks/'+id);
      },
      getdiscussion: function (id) {
          return $http.get('/api/comment/'+id);
      },
      postcomments: function (id,body,user,avator) {
          return $http({
              method: "post",
              url: "/api/comment/",
              data: {
                  body:body,
                  user:user,
                  avator:avator,
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
