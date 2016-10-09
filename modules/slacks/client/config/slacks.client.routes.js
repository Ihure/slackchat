(function () {
  'use strict';

  angular
    .module('slacks')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('slacks', {
        abstract: true,
        url: '/slacks',
        template: '<ui-view/>'
      })
      .state('slacks.list', {
        url: '',
        templateUrl: 'modules/slacks/client/views/list-slacks.client.view.html',
        controller: 'SlacksListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Slacks List'
        }
      })
      .state('slacks.create', {
        url: '/create',
        templateUrl: 'modules/slacks/client/views/form-slack.client.view.html',
        controller: 'SlacksController',
        controllerAs: 'vm',
        resolve: {
          slackResolve: newSlack
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Slacks Create'
        }
      })
      .state('slacks.edit', {
        url: '/:slackId/edit',
        templateUrl: 'modules/slacks/client/views/form-slack.client.view.html',
        controller: 'SlacksController',
        controllerAs: 'vm',
        resolve: {
          slackResolve: getSlack
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Slack {{ slackResolve.name }}'
        }
      })
      .state('slacks.view', {
        url: '/:slackId',
        templateUrl: 'modules/slacks/client/views/view-slack.client.view.html',
        controller: 'SlacksController',
        controllerAs: 'vm',
        resolve: {
          slackResolve: getSlack
        },
        data: {
          pageTitle: 'Slack {{ slackResolve.name }}'
        }
      });
  }

  getSlack.$inject = ['$stateParams', 'SlacksService'];

  function getSlack($stateParams, SlacksService) {
    return SlacksService.get({
      slackId: $stateParams.slackId
    }).$promise;
  }

  newSlack.$inject = ['SlacksService'];

  function newSlack(SlacksService) {
    return new SlacksService();
  }
}());
