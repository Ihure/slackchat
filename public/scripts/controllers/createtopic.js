'use strict';

/**
 * @ngdoc function
 * @name slackchatApp.controller:CreatetopicCtrl
 * @description
 * # CreatetopicCtrl
 * Controller of the slackchatApp
 */
angular.module('slackchatApp')
  .controller('createtopicCtrl',['authenticationservice','users','$scope','$location','$sessionStorage','$uibModalInstance','$route', function (authenticationservice,users,$scope,$location,$sessionStorage,$uibModalInstance,$route) {
      var ctrl = this;

      ctrl.add = function () {
          if(ctrl.emb == null){
              var emb = '';
          }else{
              emb = ctrl.emb;
          }
          var teamnames = $sessionStorage.team;
          var teamname = teamnames.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '_').replace(/^(_)+|(_)+$/g,'');
          var condtopic = ctrl.topic.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '_').replace(/^(_)+|(_)+$/g,'');
          var url = $location.protocol()+'://'+location.host+'/#/comments/'+teamname+'/'+condtopic;
          var encoded = encodeURI(url);
          var create = authenticationservice.createtopic(ctrl.topic, $sessionStorage.userid, $sessionStorage.avator, $sessionStorage.real_name,ctrl.desc,emb,teamname,condtopic,url,encoded);
          create.then(function(response) {
              $uibModalInstance.dismiss('cancel');
              $location.path('/comments/'+teamname+'/'+condtopic);
              //$route.reload();
          }, function(errorPayload) {

              $location.path('/newtopics');
              $scope.error = errorPayload.data;
          });

      };

      ctrl.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };

  }]);
