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
  createdby:{
      type: String,
      default:''
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
