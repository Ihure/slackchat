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
                        Notification({message: 'Link copied to clipboard'}, 'success');
                        //$route.reload();
                    }, function(errorPayload) {
                        $location.path('/newtopics');
                        $scope.error = errorPayload.data;
                    });
                });


      };

    $scope.options = {
    focus: true,
    airMode: true,
        popover: {
            image: [
                ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
                ['float', ['floatLeft', 'floatRight', 'floatNone']],
                ['remove', ['removeMedia']]
            ],
            link: [
                ['link', ['linkDialogShow', 'unlink']]
            ],
            air: [
                ['color', ['color']],
                ['font', ['bold', 'underline', 'clear','superscript','fontsize']],
                ['para', ['ul', 'paragraph','ol','style']],
                ['insert', ['link']]
            ]
        }

    };
      $scope.tinymceOptions = {
         /* showExternalToolbar: function(){

              if (this.editor.getParam('theme_advanced_toolbar_location') != 'external') return;

              if (!document.getElementById('externalToolbarWrapper')) $(document.body).prepend('<div id="externalToolbarWrapper"></div>');

              var $toolbar = $('#'+this.editor.id + '_external');

              // inserts the external toolbar in the external wrapper
              $('#externalToolbarWrapper').append('<div id="replacementDiv"></div>');

              $('#replacementDiv').replaceWith($toolbar.show());
              $toolbar.css('top','0px');
              $toolbar.css('display','block');

              $('#' + this.editor.id + '_external_close').remove();
              $('#' + this.editor.id +'_toolbargroup').css('width', innerWidth || 800); // innerwidth is an integer value
          },*/
          selector: '#externalToolbarWrapper',  // change this value according to your HTML
          inline: true,
          fixed_toolbar_container: '#externalToolbar'
          /*setup: function(editor) {
              //Focus the editor on load
              //$timeout(function(){ editor.focus(); });
              editor.on("init", function() {

              });
              editor.on("click", function() {
                  console.log('Editor was clicked');
              });
          },*/


      };

      /*ctrl.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };*/

  }]);
