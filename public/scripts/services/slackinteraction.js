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