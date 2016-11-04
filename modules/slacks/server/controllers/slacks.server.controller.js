'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Slack = mongoose.model('Slack'),
  Comment = mongoose.model('Comments'),
  Reply = mongoose.model('Reply'),
  WebHook = mongoose.model('WebHook'),
  Follows = mongoose.model('Follows'),
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
* Create a Webhook
*/

exports.create_hook = function(req, res) {
    var hook = new WebHook(req.body);

    hook.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(hook);
        }
    });
};
/**
* Add a Follow
*/

exports.create_follow = function(req, res) {
    var follow = new Follows(req.body);

    follow.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(follow);
        }
    });
};
/**
* Create a Comment
*/
exports.create_comment = function(req, res) {
    var comment = new Comment(req.body);

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
* Create a reply
*/
exports.create_reply = function(req, res) {
    var reply = new Comment(req.body);
    /*topic.user = req.user;
     topic.createdby= req.body.createdby;
     topic.topic= req.topic;
     topic.avator= req.avator;*/

    reply.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(reply);
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

  res.jsonp(req.slack);
};
/**
 * read replies
 */
exports.read_reply = function(req, res) {

    res.jsonp(req.slack);
};
/**
 * read hook
 */
exports.read_hook = function(req, res) {

    res.jsonp(req.slack);
};
/**
 * read a follow
 */
exports.read_follow = function(req, res) {

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
 * List of Slacks limit to 6
 */
exports.list_limit = function(req, res) {
    Slack.find().limit(6).sort('-created').populate('user', 'displayName').exec(function(err, slacks) {
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



exports.slacksByID = function(req, res, next, id) {

  Slack.findOne({cond_tname:req.params.tmId,cond_topic:req.params.tpcID}).exec(function (err, slack) {
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


exports.topicByID = function(req, res, next, id) {


  Slack.find({userid:req.params.creatorId}).exec(function (err, slack) {
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
                message: 'No comment with that identifier has been found'
            });
        }
        req.slack = slack;
        next();
    });
};
exports.replyByID = function(req, res, next, id) {

  /*if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Slack is invalid'
    });
  }*/

    Reply.find({_comment:id}).populate('_comment').exec(function (err, slack) {
        if (err) {
            return next(err);
        } else if (!slack) {
            return res.status(404).send({
                message: 'No reply with that identifier has been found'
            });
        }
        req.slack = slack;
        next();
    });
};
exports.flwByID = function(req, res, next, id) {

  /*if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Slack is invalid'
    });
  }*/

    Follows.find({team_id:id}).exec(function (err, slack) {
        if (err) {
            return next(err);
        } else if (!slack) {
            return res.status(404).send({
                message: 'No reply with that identifier has been found'
            });
        }
        req.slack = slack;
        next();
    });
};

exports.hookByID = function(req, res, next, id) {

        WebHook.findOne({team_id:req.params.hookId}).select('bot_token webhk_url webhk_channel token team_id').exec(function (err, slack) {
            if (err) {
                return next(err);
            } else if (!slack) {
                return res.status(404).send({
                    message: 'No hook with that identifier has been found'
                });
            }
            req.slack = slack;
            next();
        });


};
exports.followByID = function(req, res, next, id) {

        //Follows.find({team_id:req.params.teamId,topic_id:req.params.topicId}).exec(function (err, slack) {
        Follows.findOne({topic_id:req.params.topicId,team_id:req.params.teamId}).exec(function (err, slack) {
            if (err) {
                return next(err);
            } else if (!slack) {
                return res.status(404).send({
                    message: 'No hook with that identifier has been found'
                });
            }
            req.slack = slack;
            next();
        });


};

