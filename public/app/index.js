'use strict';

angular.module('angularMaterialAdmin', [
    'ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ui.router',
    'ngMaterial',
    'ngRoute',
    'updateMeta',
    'ui-notification',
    'ngclipboard',
    'ngClipboard',
    'summernote',
    'ngStorage',
    'ui.bootstrap',
    'angularMoment',
    'monospaced.elastic',
    'opentok',
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.poster",
    'app'
  ])

  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider,$mdIconProvider,NotificationProvider,$locationProvider) {
    $stateProvider
      .state('authorize',{
        url: '/',
        title:'Authorize',
        layout: 'column',
        templateUrl: 'app/views/authorize.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .state('create_topic',{
        url: '/createtopic',
        title:'Create Topic',
        layout: 'column',
        templateUrl: 'app/views/ngdialog.html',
        controller: 'createtopicCtrl',
        controllerAs: 'ctrl',
        data: {
          title: 'home'
        }
      })
      .state('home', {
        url: '',
        templateUrl: 'app/views/land.html',
        controller: 'DiscussCtrl',
        controllerAs: 'vm',
        abstract: true
      })
      .state('home.home', {
        title: 'Home',
        url: '/home?code&state',
        layout: 'row',
        templateUrl: 'app/views/test.html',
        data: {
          title: 'home'
        }
      })
      .state('home.viewcomment', {
        title: 'Home',
        url: '/view/:teamname/:topic',
        layout: 'row',
        templateUrl: 'app/views/test.html',
        controller: 'CommentCtrl',
        controllerAs: 'ctrl',
        data: {
          title: 'home'
        }
      })
      .state('home.comment', {
        title: 'Comment',
        url: '/:teamname/:topic?code&state',
        layout: 'row',
        templateUrl: 'app/views/comment.html',
        controller: 'CommentCtrl',
        controllerAs: 'ctrl',
        data: {
          title: 'comments'
        }
      })
      .state('home.profile', {
        url: '/profile',
        title:'profile',
        templateUrl: 'app/views/profile.html',
        controller: 'ProfileController',
        controllerAs: 'vm',
        data: {
          title: 'Profile'
        }
      })
      .state('home.table', {
        url: '/table',
        controller: 'TableController',
        controllerAs: 'vm',
        templateUrl: 'app/views/table.html',
        data: {
          title: 'Table'
        }
      });

    $urlRouterProvider.otherwise('/');

    $mdThemingProvider
      .theme('default')
        .primaryPalette('grey', {
          'default': '600'
        })
        .accentPalette('teal', {
          'default': '500'
        })
        .warnPalette('defaultPrimary');

    $mdThemingProvider.theme('dark', 'default')
      .primaryPalette('defaultPrimary')
      .dark();

    $mdThemingProvider.theme('grey', 'default')
      .primaryPalette('grey');

    $mdThemingProvider.theme('custom', 'default')
      .primaryPalette('defaultPrimary', {
        'hue-1': '50'
    });

    $mdThemingProvider.definePalette('defaultPrimary', {
      '50':  '#FFFFFF',
      '100': 'rgb(255, 198, 197)',
      '200': '#E75753',
      '300': '#E75753',
      '400': '#E75753',
      '500': '#E75753',
      '600': '#E75753',
      '700': '#E75753',
      '800': '#E75753',
      '900': '#E75753',
      'A100': '#E75753',
      'A200': '#E75753',
      'A400': '#E75753',
      'A700': '#E75753'
    });

    $mdIconProvider.icon('user', 'assets/images/user.svg', 64);
    $locationProvider
        .html5Mode(true);
    NotificationProvider
        .setOptions({
          delay: 10000,
          startTop: 20,
          startRight: 10,
          verticalSpacing: 20,
          horizontalSpacing: 20,
          positionX: 'left',
          positionY: 'bottom'
        });
  })
  .run(['$rootScope', '$stateParams','$cookieStore','$state', '$location', function ($rootScope,$stateParams,$cookieStore,$state,$location) {
      //ngMeta.init();
     $rootScope.$on('$stateChangeSuccess', function() {
        document.title = $state.current.title;
         $rootScope.$state = $state;
         $rootScope.$stateParams = $stateParams;
      });
      $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to home page if user is loged in and tryin to access authorize page
        var authPage = $.inArray($location.path(), ['/', '/register']) === -1;
        var loggedIn = $cookieStore.get('flowtalklog');
        if (!authPage && loggedIn == 'logged') {
          $location.path('/home');
        }
      });
    }])
    .filter('trusturls',['$sce', function ($sce) {
      return function (val) {
        return $sce.trustAsResourceUrl(val);
      };
    }])
    .filter('totrusted',['$sce', function ($sce) {
      return function (value) {
        return $sce.trustAsHtml(value);
      };

    }])
    .directive('showFocus', function($timeout) {
      return function(scope, element, attrs) {
        scope.$watch(attrs.showFocus,
            function (newValue) {
              $timeout(function() {
                newValue && element.focus();
              });
            },true);
      };
    })
    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown", function(e) {
                if(e.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'e': e});
                    });
                    e.preventDefault();
                }
            });
        };
    })
    .directive('enterSubmit', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {

                elem.bind('keydown', function(event) {
                    var code = event.keyCode || event.which;

                    if (code === 13) {
                        if (!event.shiftKey) {
                            event.preventDefault();
                            scope.$apply(attrs.enterSubmit);
                        }
                    }
                });
            }
        }
    })
    .directive('blink', ['$interval', function($interval) {
        return function(scope, element, attrs) {
            var timeoutId;

            var blink = function() {
                element.css('visibility') === 'hidden' ? element.css('visibility', 'inherit') : element.css('visibility', 'hidden');
            }

            timeoutId = $interval(function() {
                blink();
            }, 1000);

            element.css({
                'display': 'inline-block'
            });

            element.on('$destroy', function() {
                $interval.cancel(timeoutId);
            });
        };
    }]);;
