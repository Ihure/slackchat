'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Slack Schema
 */
var SlackSchema = new Schema({
  topic: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: ''
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  avator: {
    type: String,
    default:''
  },
  link:{
    type: String,
    default: ''
  },
  status:{
      type: String,
      default:'2'
  },
  createdby:{
      type: String,
      default:''
  },
  description:{
      type: String,
      default:''
  },
  team:{
      type: String,
      default:''
  },
  team_id:{
      type: String,
      default:''
  },
  cond_tname:{
      type: String,
      default:''
  },
  url:{
      type: String,
      default:''
  },
  encoded:{
      type: String,
      default:''
  },
  cond_topic:{
      type: String,
      default:''
  },
  bot_id: {
     type: String,
     default: ''
  },
  bot_token: {
     type: String,
     default: ''
  },
  userid: {
     type: String,
     default: ''
  }
});

var WebHooksSchema = new Schema({
    token: {
        type: String,
        default: ''
    },
    date: {
        type:Date,
        default: Date.now
    },
    team_name:{
        type: String,
        default: ''
    },
    team_id: {
        type: String,
        default: ''
    },
    webhk_url: {
        type: String,
        default: ''
    },
    webhk_channel: {
        type: String,
        default: ''
    },
    webhk_cnfgurl: {
        type: String,
        default: ''
    },
    bot_id: {
        type: String,
        default: ''
    },
    bot_token: {
        type: String,
        default: ''
    }
});

var FollowsSchema = new Schema({
    user: {
        type: String,
        default: ''
    },
    date: {
        type:Date,
        default: Date.now
    },
    user_id:{
        type: String,
        default: ''
    },
    topic: {
        type: String,
        default: ''
    },
    topic_id: {
        type: String,
        default: ''
    },
    webhk_url: {
        type: String,
        default: ''
    },
    bot_id: {
        type: String,
        default: ''
    },
    bot_token: {
        type: String,
        default: ''
    },
    team_id: {
        type: String,
        default: ''
    }
});

var CommentSchema = new Schema({
    body: String,
    date: {
        type:Date,
        default: Date.now
          },
    user: String,
    parentid: String,
    level:{
          type:String,
          default: '1'
    },
    slug: String,
    slugabove: String,
    full_slug: String,
    avator: String,
    _topic:{
            type:String,
            ref: 'Slack'
    }
});
var ReplySchema = new Schema({
    body: String,
    date: {
        type:Date,
        default: Date.now
          },
    user: String,
    avator: String,
    _comment:{
            type:String,
            ref: 'Comments'
    }
});

mongoose.model('Slack', SlackSchema);
mongoose.model('Comments', CommentSchema);
mongoose.model('Reply', ReplySchema);
mongoose.model('WebHook', WebHooksSchema);
mongoose.model('Follows', FollowsSchema);
