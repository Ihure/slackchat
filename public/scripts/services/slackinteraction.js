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
    .service('slackinteraction',['$http','Notification','$httpParamSerializerJQLike' , function ($http,Notification,$httpParamSerializerJQLike) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        return{
            welcome: function (url) {
                var data ={
                    attachments: [
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
            notify_owner: function (token,owner,topic, comment,topic_url,commenter_avator,commenter) {
                var datas ={
                    token: token,
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
                };
                //Notification({message: 'slack error '+JSON.stringify(data)}, 'error');
                //Notification({message: 'slack send '+JSON.stringify(datas)}, 'error');
                console.log('param'+$.param(datas))
                console.log(datas);
                return $http({
                    method: "POST",
                    url:"https://slack.com/api/chat.postMessage",
                    data:$.param(datas),
                    headers: {'Content-type': 'application/x-www-form-urlencoded'}
                });

            },
            notify_channel: function (wh_url,owner,topic, comment,topic_url,commenter_avator,commenter) {
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

            },
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
]*/
