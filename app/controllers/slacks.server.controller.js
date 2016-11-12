'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Slack = mongoose.model('Slack'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Slack
 */
exports.create = function(req, res) {
  var slack = new Slack(req.body);
  slack.user = req.user;

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
 * Show the current Slack
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var slack = req.slack ? req.slack.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  slack.isCurrentUserOwner = req.user && slack.user && slack.user._id.toString() === req.user._id.toString();

  res.jsonp(slack);
};

/**
 * Update a Slack
 */
exports.update = function(req, res) {
  var slack = req.slack;

  slack = _.extend(slack, req.body);

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
