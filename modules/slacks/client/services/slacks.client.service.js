// Slacks service used to communicate Slacks REST endpoints
(function () {
  'use strict';

  angular
    .module('slacks')
    .factory('SlacksService', SlacksService);

  SlacksService.$inject = ['$resource'];

  function SlacksService($resource) {
    return $resource('api/slacks/:slackId', {
      slackId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
