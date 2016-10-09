(function () {
  'use strict';

  angular
    .module('slacks')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Slacks',
      state: 'slacks',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'slacks', {
      title: 'List Slacks',
      state: 'slacks.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'slacks', {
      title: 'Create Slack',
      state: 'slacks.create',
      roles: ['user']
    });
  }
}());
