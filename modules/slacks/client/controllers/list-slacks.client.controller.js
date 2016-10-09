(function () {
  'use strict';

  angular
    .module('slacks')
    .controller('SlacksListController', SlacksListController);

  SlacksListController.$inject = ['SlacksService'];

  function SlacksListController(SlacksService) {
    var vm = this;

    vm.slacks = SlacksService.query();
  }
}());
