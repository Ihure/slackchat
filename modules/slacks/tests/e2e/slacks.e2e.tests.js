'use strict';

describe('Slacks E2E Tests:', function () {
  describe('Test Slacks page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/slacks');
      expect(element.all(by.repeater('slack in slacks')).count()).toEqual(0);
    });
  });
});
