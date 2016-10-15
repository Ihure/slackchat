'use strict';

/**
 * @ngdoc service
 * @name slackchatApp.authentication
 * @description
 * # authentication
 * Service in the slackchatApp.
 */
angular.module('slackchatApp')
  .service('authentication', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      islogged:0
    }
  });
