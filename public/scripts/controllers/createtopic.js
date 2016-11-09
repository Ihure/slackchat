'use strict';

/**
 * @ngdoc function
 * @name slackchatApp.controller:CreatetopicCtrl
 * @description
 * # CreatetopicCtrl
 * Controller of the slackchatApp
 */
angular.module('slackchatApp')
  .controller('createtopicCtrl',['authenticationservice','users','$scope','$location','$sessionStorage','ngClipboard','Notification','slackinteraction', function (authenticationservice,users,$scope,$location,$sessionStorage,ngClipboard,Notification,slackinteraction) {
      var ctrl = this;

      ctrl.add = function () {
          /*if(ctrl.emb == null || ctrl.emb == undefined){
              var emb = '';
          }else{
              emb = ctrl.emb;
          }*/
          var emb = '';
          var teamnames = $sessionStorage.team;
          var teamname = teamnames.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '_').replace(/^(_)+|(_)+$/g,'');
          var condtopic = ctrl.topic.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '_').replace(/^(_)+|(_)+$/g,'');
          //var url = $location.protocol()+'://'+location.host+'/#/comments/'+teamname+'/'+condtopic;
          var url = $location.protocol()+'://'+location.host+'/'+teamname+'/'+condtopic;
          ngClipboard.toClipboard(url);
          Notification({message: 'Link copied to clipboard'}, 'success');
          var encoded = encodeURI(url);
          console.log('user desc '+ctrl.desc);
            var getid = slackinteraction.get_id($sessionStorage.btkn,$sessionStorage.userid);
                getid.then(function (getid) {
                   var cid = getid.data.channel.id;
                    //console.log('user id '+getid.data.channel.id);
                    //console.log('error '+getid.data.error);
                    var create = authenticationservice.createtopic(ctrl.topic, cid, $sessionStorage.avator, $sessionStorage.real_name,ctrl.desc,emb,teamname,condtopic,url,encoded,$sessionStorage.team_id,$sessionStorage.bid,$sessionStorage.btkn,$sessionStorage.userid);
                    create.then(function(response) {
                        //$uibModalInstance.dismiss('cancel');
                        $location.path('/'+teamname+'/'+condtopic);
                        //$route.reload();
                    }, function(errorPayload) {
                        $location.path('/newtopics');
                        $scope.error = errorPayload.data;
                    });
                });


      };

    $scope.options = {
    height: 300,
    focus: true,
    airMode: true,
    toolbar: [
            ['edit',['undo','redo']],
            ['headline', ['style']],
            ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
            ['fontface', ['fontname']],
            ['textsize', ['fontsize']],
            ['fontclr', ['color']],
            ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
            ['height', ['height']],
            ['table', ['table']],
            ['insert', ['link','picture','video','hr']],
            ['view', ['fullscreen', 'codeview']],
            ['help', ['help']]
        ]
  };

      /*ctrl.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };*/

  }]);
