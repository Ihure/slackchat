'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Slack = mongoose.model('Slack'),
  Comment = mongoose.model('Comments'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Slack
 */
exports.create = function(req, res) {
  var slack = new Slack(req.body);
  /*topic.user = req.user;
  topic.createdby= req.body.createdby;
  topic.topic= req.topic;
  topic.avator= req.avator;*/

  slack.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(slack);
    }
  });
};
/**
* Create a Comment
*/
exports.create_comment = function(req, res) {
    var comment = new Comment(req.body);
    /*topic.user = req.user;
     topic.createdby= req.body.createdby;
     topic.topic= req.topic;
     topic.avator= req.avator;*/

    comment.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(comment);
        }
    });
};
/**
 * Show the current topic
 */
exports.read = function(req, res) {
    res.jsonp(req.slack);
};

/**
 * Show the current topic with comments
 */
exports.read_comment = function(req, res) {
  /* // convert mongoose document to JSON
  var slack = req.slack ? req.slack.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  //slack.isCurrentUserOwner = req.user && slack.user && slack.user._id.toString() === req.user._id.toString();
  slack.findOne({ '_id': req.body.id }, 'name comments avator created topic', function (err, person) {
    if (err) return handleError(err);
      res.jsonp(slack); // Space Ghost is a talk show host.
  })*/
  /*Comment.find({_topic:req.id})
      .populate('_topic')
      .exec(function (err, story) {
          if (err) {
              return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
              });
          } else {
              res.jsonp(story);
          }
          //console.log('The creator is %s', story._creator.name);// prints "The creator is Aaron"
          //res.jsonp(story)
      });*/

  res.jsonp(req.slack);
};

/**
 * Update a Slack
 */
exports.update = function(req, res) {
  var slack = req.slack;

  //slack = _.extend(slack, req.body);
    //slack.comments = req.body;
    //slack.comments.user = req.body.user;
    //slack.comments.avator = req.body.avator;

  slack.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(slack);
    }
  });
};

/**
 * Delete an Slack
 */
exports.delete = function(req, res) {
  var slack = req.slack;

  slack.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(slack);
    }
  });
};

/**
 * List of Slacks
 */
exports.list = function(req, res) {
  Slack.find().sort('-created').populate('user', 'displayName').exec(function(err, slacks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(slacks);
    }
  });
};

/**
 * List of comments
 */
exports.list_comments = function(req, res) {
    Comment.find().sort('-date').populate('_topic').exec(function(err, slacks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(slacks);
        }
    });
};

/**
 * Slack middleware
 */
exports.slackByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Slack is invalid'
    });
  }

  Slack.findById(id).populate('user', 'displayName').exec(function (err, slack) {
    if (err) {
      return next(err);
    } else if (!slack) {
      return res.status(404).send({
        message: 'No Slack with that identifier has been found'
      });
    }
    req.slack = slack;
    next();
  });
};

exports.commentByID = function(req, res, next, id) {

  /*if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Slack is invalid'
    });
  }*/

    Comment.find({_topic:id}).populate('_topic').exec(function (err, slack) {
        if (err) {
            return next(err);
        } else if (!slack) {
            return res.status(404).send({
                message: 'No Slack with that identifier has been found'
            });
        }
        req.slack = slack;
        next();
    });
};
