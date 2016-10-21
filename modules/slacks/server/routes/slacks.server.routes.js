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

  app.route('/api/hook').all()
    .post(slacks.create_hook);

  app.route('/api/follow').all()
    .post(slacks.create_follow);

  app.route('/api/topic').all()
    .get(slacks.list_limit);

  app.route('/api/comment').all()
    .get(slacks.list_comments)
    .post(slacks.create_comment);

  app.route('/api/reply').all()
    .get(slacks.list_comments)
    .post(slacks.create_reply);

  app.route('/api/comment/:commentId').all()
    .get(slacks.read_comment);

  app.route('/api/reply/:replyId').all()
    .get(slacks.read_reply);

  app.route('/api/hook/:hookId').all()
    .get(slacks.read_hook);

  app.route('/api/follow/:topicId/:teamId').all()
    .get(slacks.read_follow);

  app.route('/api/follows/:tmId').all()
    .get(slacks.read_follow);

  app.route('/api/topics/:creatorId').all()
    .get(slacks.read_follow);

  app.route('/api/slacks/:slackId').all()
    .get(slacks.read)
    .put(slacks.update)
    .delete(slacks.delete);

  app.route('/api/slack/:tmId/:tpcID').all()
      .get(slacks.read_follow);

  // Finish by binding the Slack middleware
  app.param('slackId', slacks.slackByID);
  app.param('commentId', slacks.commentByID);
  app.param('replyId', slacks.replyByID);
  app.param('hookId', slacks.hookByID);
  //app.param('chnlID', slacks.hookByID);
  app.param('topicId', slacks.followByID);
  app.param('teamId', slacks.followByID);
  app.param('tmId', slacks.flwByID);
  app.param('creatorId', slacks.topicByID);
  app.param('tmId', slacks.slacksByID);
  app.param('tpcID', slacks.slacksByID);
};
