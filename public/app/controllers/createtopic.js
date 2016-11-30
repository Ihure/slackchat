'use strict';

/**
 * @ngdoc function
 * @name slackchatApp.controller:CreatetopicCtrl
 * @description
 * # CreatetopicCtrl
 * Controller of the slackchatApp
 */
angular.module('angularMaterialAdmin')
  .controller('createtopicCtrl',['authenticationservice','$scope','$location','$sessionStorage','ngClipboard','Notification','slackinteraction','$http','OTSession','opentokinteraction','$timeout', function (authenticationservice,$scope,$location,$sessionStorage,ngClipboard,Notification,slackinteraction,$http,OTSession,opentokinteraction,$timeout) {
      var ctrl = this;



      if (navigator.geolocation){ navigator.geolocation.getCurrentPosition(function(position) {
          //console.log('test evaluation ');
          var lat = position.coords.latitude;
          var lng = position.coords.longitude;
          console.log('test evaluation ' +lat +' long ' +lng);
          var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key=AIzaSyAApD0SrzAHCrAc-inaREdMX7EbyAxGsIA";
          $http.get(url)
              .then(function(result) {
                  //console.log('test evaluation ');
                  var address = result.data.results[4].formatted_address;
                  //$scope.address = address;
                  var time = new Date();
                  var date = (time.getMonth() + 1) + "-" + time.getDate() + "-" + time.getFullYear();
                  var fdate = '['+date+']'; 
                  console.log('adress is '+address +' '+ fdate);
        
                      console.log('test scope ');
                      var title = address+' '+ fdate;
                      $scope.ctrl = {topic: title};
                  
              },function(error){
              //console.log('error is '+error.data);
              //console.log('error evaluation ');
          });
        }
        );
      }
      //var apiKey =  '45727312';
      //var sessionId = '1_MX40NTcyNzMxMn5-MTQ4MDQxNTA5MTcwMX5ieS9wUkMxbDZMYnBEdW1JWmlJblFHWUt-QX4';
      //var token= 'T1==cGFydG5lcl9pZD00NTcyNzMxMiZzaWc9Y2EwMjMxZjllMGE4MWFmYzYxZDliNDFjNjJjYWViYWRkNzlkZDA4YTpzZXNzaW9uX2lkPTFfTVg0ME5UY3lOek14TW41LU1UUTRNRFF4TlRBNU1UY3dNWDVpZVM5d1VrTXhiRFpNWW5CRWRXMUpXbWxKYmxGSFdVdC1RWDQmY3JlYXRlX3RpbWU9MTQ4MDQxNTA5MiZub25jZT0wLjgzODU5MjM0NDAxNTU2MDkmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ4MDQyNTg5MiZjb25uZWN0aW9uX2RhdGE9bmFtZSUzREpvaG5ueQ==';
      //OTSession.init(apiKey, sessionId, token);

      angular.element(document).ready(function () {
          //document.getElementById('msg').innerHTML = 'Hello';
          var apiKey =  '45727312';
          var sessionId = '1_MX40NTcyNzMxMn5-MTQ4MDQxNTA5MTcwMX5ieS9wUkMxbDZMYnBEdW1JWmlJblFHWUt-QX4';
          var token= 'T1==cGFydG5lcl9pZD00NTcyNzMxMiZzaWc9Y2EwMjMxZjllMGE4MWFmYzYxZDliNDFjNjJjYWViYWRkNzlkZDA4YTpzZXNzaW9uX2lkPTFfTVg0ME5UY3lOek14TW41LU1UUTRNRFF4TlRBNU1UY3dNWDVpZVM5d1VrTXhiRFpNWW5CRWRXMUpXbWxKYmxGSFdVdC1RWDQmY3JlYXRlX3RpbWU9MTQ4MDQxNTA5MiZub25jZT0wLjgzODU5MjM0NDAxNTU2MDkmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ4MDQyNTg5MiZjb25uZWN0aW9uX2RhdGE9bmFtZSUzREpvaG5ueQ==';


         /* var session = OT.initSession(apiKey, sessionId);
           // Connect to our session and publish our feed
           session.connect(token, function(error) {
           publisher = OT.initPublisher( angular.element("publisher"));
           session.publish(publisher);
           });
           // When a client connects, subscribe to its feed
           session.on( {
           streamCreated: function(event) {
           session.subscribe(event.stream, "subscriber");
           }});*/
      });

     /*var otsess = opentokinteraction.generate_session();
        otsess.then(function (succ) {
            //var sessionId = succ.data.sessionid;
            //var apiKey = succ.data.apikey;
            //console.log('api key is ' +apiKey);
            //var token = succ.data.token;
            //var apiKey =  '45727312';
            //var sessionId = '1_MX40NTcyNzMxMn5-MTQ4MDQxNTA5MTcwMX5ieS9wUkMxbDZMYnBEdW1JWmlJblFHWUt-QX4';
            //var token= 'T1==cGFydG5lcl9pZD00NTcyNzMxMiZzaWc9Y2EwMjMxZjllMGE4MWFmYzYxZDliNDFjNjJjYWViYWRkNzlkZDA4YTpzZXNzaW9uX2lkPTFfTVg0ME5UY3lOek14TW41LU1UUTRNRFF4TlRBNU1UY3dNWDVpZVM5d1VrTXhiRFpNWW5CRWRXMUpXbWxKYmxGSFdVdC1RWDQmY3JlYXRlX3RpbWU9MTQ4MDQxNTA5MiZub25jZT0wLjgzODU5MjM0NDAxNTU2MDkmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ4MDQyNTg5MiZjb25uZWN0aW9uX2RhdGE9bmFtZSUzREpvaG5ueQ==';


            /*var session = OT.initSession(apiKey, sessionId);
            // Connect to our session and publish our feed
            session.connect(token, function(error) {
                publisher = OT.initPublisher( angular.element(publisher));
                session.publish(publisher);
            });
            // When a client connects, subscribe to its feed
            session.on( {
                streamCreated: function(event) {
                    session.subscribe(event.stream, "subscriber");
                }});*/
           /* //$scope.$apply(function() {
                OTSession.init(succ.data.apikey, succ.data.sessionid, succ.data.token);
            //})
        },function (err) {

        });*/


     /* $scope.callAtTimeout = function () {
          var otsess = opentokinteraction.generate_session();
          otsess.then(function (succ) {
              OTSession.init(succ.data.apikey, succ.data.sessionid, succ.data.token);
          },function (err) {

          });
      };

      $timeout( function(){ $scope.callAtTimeout(); }, 1500);*/



      //OTSession.init(apiKey, sessionId, token);
      //$scope.streams = OTSession.streams;
      //console.log('test evaluation ');
         /* if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          //console.log('test evaluation ');
          $scope.$apply(function(){
            console.log('test evaluation ');
            $scope.position = position;
          });
        });
      }*/

      ctrl.add = function () {
          /*if(ctrl.emb == null || ctrl.emb == undefined){
              var emb = '';
          }else{
              emb = ctrl.emb;
          }*/
          //$scope.creates = false;
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
                        $scope.creates = false;
                        $location.path('/'+teamname+'/'+condtopic);
                        Notification({message: 'Link copied to clipboard'}, 'success');
                        //$route.reload();
                    }, function(errorPayload) {
                        $location.path('/newtopics');
                        $scope.error = errorPayload.data;
                    });
                });


      };
      //$scope.creates = false;
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

  }])
