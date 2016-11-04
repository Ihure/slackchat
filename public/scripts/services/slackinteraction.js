/**
 * Created by Chris on 10/19/2016.
 */
'use strict';

/**
 * @ngdoc service
 * @name slackchatApp.slackinteraction
 * @description
 * # slack interaction
 * Service in the slackchatApp.
 */
angular.module('slackchatApp')
    .service('slackinteraction',['$http','Notification','$httpParamSerializerJQLike' ,'$httpParamSerializer', function ($http,Notification,$httpParamSerializerJQLike,$httpParamSerializer) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        return{
            welcome: function (url) {
                var data ={
                    attachments: [
                        {
                            fallback: "Welcome to Flowtalk",
                            color: "#800080",
                            pretext: "Welcome to Flowtalk",
                            author_name: "Flowtalk",
                            author_link: "http://www.flowtalk.io",
                            author_icon: "https://blog.agilebits.com/wp-content/uploads/2014/10/FlowBrowser-Icon.png",
                            title: "Frictionless, asynchronous conversations. For Slack",
                            title_link: "http://www.flowtalk.io/",
                            text: "create a topic by using",
                            fields: [
                                {
                                    title: "@flowtalk",
                                    value: "/flowtalk",
                                    short: false
                                }
                            ],
                            image_url: "http://my-website.com/path/to/image.jpg",
                            thumb_url: "http://example.com/path/to/thumb.png",
                            footer: "Flowtalk",
                            footer_icon: "https://blog.agilebits.com/wp-content/uploads/2014/10/FlowBrowser-Icon.png",
                            ts:Date.now()
                        }
                    ]
                }
                //Notification({message: 'slack error '+JSON.stringify(data)}, 'error');
                return $http({
                    method: "POST",
                    url:url,
                    data:JSON.stringify(data),
                    headers: {'Content-type': 'application/x-www-form-urlencoded'}
                });

            },
            get_id: function (token,user) {
                var data ={
                    token: token,
                    user: user
                };
                //Notification({message: 'slack error '+JSON.stringify(data)}, 'error');
                return $http({
                    method: "POST",
                    url:"https://slack.com/api/im.open",
                    data:serializeData(data),
                    headers: {'Content-type': 'application/x-www-form-urlencoded'}
                });
                function serializeData( data ) {
                    // If this is not an object, defer to native stringification.
                    if ( ! angular.isObject( data ) ) {
                        return( ( data == null ) ? "" : data.toString() );
                    }
                    var buffer = [];
                    // Serialize each key in the object.
                    for ( var name in data ) {
                        if ( ! data.hasOwnProperty( name ) ) {
                            continue;
                        }
                        var value = data[ name ];
                        buffer.push(
                            encodeURIComponent( name ) +
                            "=" +
                            encodeURIComponent( ( value == null ) ? "" : value )
                        );
                    }
                    // Serialize the buffer and clean it up for transportation.
                    var source = buffer
                            .join( "&" )
                            .replace( /%20/g, "+" )
                        ;
                    return( source );
                }
            },
            notify_owner: function (token,owner,topic, comment,topic_url,commenter_avator,commenter) {
                var datas ={
                    token: token,
                    channel: owner
                };
                var att = {
                    fallback: commenter+" added a comment on your topic",
                    color: "#800080",
                    pretext: commenter+" added a comment on your topic",
                    title: topic,
                    title_link: topic_url,
                    text: comment,
                    footer: commenter,
                    //footer_icon: commenter_avator,
                    //ts:Date.now()
                };
                //Notification({message: 'slack error '+JSON.stringify(data)}, 'error');
                //Notification({message: 'slack send '+JSON.stringify(datas)}, 'error');
                //console.log('param1 '+JSON.stringify(datas));
                //console.log('param2 '+serializeData(datas)+'&attachments=['+JSON.stringify(att)+']');
                //console.log('param3 '+serializeData(datas)+'&attachments='+encodeURI('[{')+serializeData(att)+encodeURI('}]'));
                //console.log(datas);
                return $http({
                    method: "POST",
                    url:"https://slack.com/api/chat.postMessage",
                    headers: {'Content-type': 'application/x-www-form-urlencoded'},
                    //data: serializeData(datas)+'&attachments=['+JSON.stringify(att)+']'
                    data: serializeData(datas)+'&attachments=['+JSON.stringify(att)+']'
                   //data: serializeData(datas)
                });

                function serializeData( data ) {
                    // If this is not an object, defer to native stringification.
                    if ( ! angular.isObject( data ) ) {
                        return( ( data == null ) ? "" : data.toString() );
                    }
                    var buffer = [];
                    // Serialize each key in the object.
                    for ( var name in data ) {
                        if ( ! data.hasOwnProperty( name ) ) {
                            continue;
                        }
                        var value = data[ name ];
                        buffer.push(
                            encodeURIComponent( name ) +
                            "=" +
                            encodeURIComponent( ( value == null ) ? "" : value )
                        );
                    }
                    // Serialize the buffer and clean it up for transportation.
                    var source = buffer
                            .join( "&" )
                            .replace( /%20/g, "+" )
                        ;
                    return( source );
                }

            },
           /* notify_channel: function (wh_url,owner,topic, comment,topic_url,commenter_avator,commenter) {
                var data ={
                    channel: owner,
                    attachments: [
                        {
                            fallback: commenter+" added a comment on your topic",
                            color: "#36a64f",
                            pretext: commenter+" added a comment on your topic",
                            title: topic,
                            title_link: topic_url,
                            text: comment,
                            footer: commenter,
                            footer_icon: commenter_avator,
                            ts:Date.now()
                        }
                    ]
                }

                return $http({
                    method: "POST",
                    url:wh_url,
                    data:JSON.stringify(data),
                    headers: {'Content-type': 'application/x-www-form-urlencoded'}
                });

            },*/
        };
    }]);

/*attachments: [
    {
        fallback: "Welcome to Flowtalk",
        color: "#36a64f",
        pretext: "Welcome to Flowtalk",
        author_name: "Flowtalk",
        author_link: "http://www.flowtalk.io",
        author_icon: "https://blog.agilebits.com/wp-content/uploads/2014/10/FlowBrowser-Icon.png",
        title: "Frictionless, asynchronous conversations. For Slack",
        title_link: "http://www.flowtalk.io/",
        text: "create a topic by using",
        fields: [
            {
                title: "@flowtalk",
                value: "/flowtalk",
                short: false
            }
        ],
        image_url: "http://my-website.com/path/to/image.jpg",
        thumb_url: "http://example.com/path/to/thumb.png",
        footer: "Flowtalk",
        footer_icon: "https://blog.agilebits.com/wp-content/uploads/2014/10/FlowBrowser-Icon.png",
        ts:Date()
    }

 var param = function(obj)
 {
 var query = '';
 var name, value, fullSubName, subName, subValue, innerObj, i;

 for(name in obj)
 {
 value = obj[name];

 if(value instanceof Array)
 {
 for(i=0; i<value.length; ++i)
 {
 subValue = value[i];
 fullSubName = name + '[' + i + ']';
 innerObj = {};
 innerObj[fullSubName] = subValue;
 query += param(innerObj) + '&';
 }
 }
 else if(value instanceof Object)
 {
 for(subName in value)
 {
 subValue = value[subName];
 fullSubName = name + '[' + subName + ']';
 innerObj = {};
 innerObj[fullSubName] = subValue;
 query += param(innerObj) + '&';
 }
 }
 else if(value !== undefined && value !== null)
 {
 query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
 }
 }

 return query.length ? query.substr(0, query.length - 1) : query;
 };

 return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
]*/
