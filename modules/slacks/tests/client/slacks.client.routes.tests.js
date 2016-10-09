(function () {
  'use strict';

  describe('Slacks Route Tests', function () {
    // Initialize global variables
    var $scope,
      SlacksService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SlacksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SlacksService = _SlacksService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('slacks');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/slacks');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SlacksController,
          mockSlack;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('slacks.view');
          $templateCache.put('modules/slacks/client/views/view-slack.client.view.html', '');

          // create mock Slack
          mockSlack = new SlacksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Slack Name'
          });

          // Initialize Controller
          SlacksController = $controller('SlacksController as vm', {
            $scope: $scope,
            slackResolve: mockSlack
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:slackId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.slackResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            slackId: 1
          })).toEqual('/slacks/1');
        }));

        it('should attach an Slack to the controller scope', function () {
          expect($scope.vm.slack._id).toBe(mockSlack._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/slacks/client/views/view-slack.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SlacksController,
          mockSlack;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('slacks.create');
          $templateCache.put('modules/slacks/client/views/form-slack.client.view.html', '');

          // create mock Slack
          mockSlack = new SlacksService();

          // Initialize Controller
          SlacksController = $controller('SlacksController as vm', {
            $scope: $scope,
            slackResolve: mockSlack
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.slackResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/slacks/create');
        }));

        it('should attach an Slack to the controller scope', function () {
          expect($scope.vm.slack._id).toBe(mockSlack._id);
          expect($scope.vm.slack._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/slacks/client/views/form-slack.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SlacksController,
          mockSlack;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('slacks.edit');
          $templateCache.put('modules/slacks/client/views/form-slack.client.view.html', '');

          // create mock Slack
          mockSlack = new SlacksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Slack Name'
          });

          // Initialize Controller
          SlacksController = $controller('SlacksController as vm', {
            $scope: $scope,
            slackResolve: mockSlack
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:slackId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.slackResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            slackId: 1
          })).toEqual('/slacks/1/edit');
        }));

        it('should attach an Slack to the controller scope', function () {
          expect($scope.vm.slack._id).toBe(mockSlack._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/slacks/client/views/form-slack.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
