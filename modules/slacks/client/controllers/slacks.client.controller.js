(function () {
  'use strict';

  // Slacks controller
  angular
    .module('slacks')
    .controller('SlacksController', SlacksController);

  SlacksController.$inject = ['$scope', '$state', '$window', 'Authentication', 'slackResolve'];

  function SlacksController ($scope, $state, $window, Authentication, slack) {
    var vm = this;

    vm.authentication = Authentication;
    vm.slack = slack;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Slack
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.slack.$remove($state.go('slacks.list'));
      }
    }

    // Save Slack
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.slackForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.slack._id) {
        vm.slack.$update(successCallback, errorCallback);
      } else {
        vm.slack.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('slacks.view', {
          slackId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
