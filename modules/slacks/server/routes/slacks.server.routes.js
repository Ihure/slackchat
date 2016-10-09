'use strict';

/**
 * Module dependencies
 */
var slacksPolicy = require('../policies/slacks.server.policy'),
  slacks = require('../controllers/slacks.server.controller');

module.exports = function(app) {
  // Slacks Routes
  app.route('/api/slacks').all()
    .get(slacks.list)
    .post(slacks.create);

  app.route('/api/comment').all()
    .get(slacks.list_comments)
    .post(slacks.create_comment);

  app.route('/api/comment/:commentId').all()
    .get(slacks.read_comment)

  app.route('/api/slacks/:slackId').all()
    .get(slacks.read)
    .put(slacks.update)
    .delete(slacks.delete);

  // Finish by binding the Slack middleware
  app.param('slackId', slacks.slackByID);
  app.param('commentId', slacks.commentByID);
};
