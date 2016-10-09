'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Slack = mongoose.model('Slack'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  slack;

/**
 * Slack routes tests
 */
describe('Slack CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Slack
    user.save(function () {
      slack = {
        name: 'Slack name'
      };

      done();
    });
  });

  it('should be able to save a Slack if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Slack
        agent.post('/api/slacks')
          .send(slack)
          .expect(200)
          .end(function (slackSaveErr, slackSaveRes) {
            // Handle Slack save error
            if (slackSaveErr) {
              return done(slackSaveErr);
            }

            // Get a list of Slacks
            agent.get('/api/slacks')
              .end(function (slacksGetErr, slacksGetRes) {
                // Handle Slacks save error
                if (slacksGetErr) {
                  return done(slacksGetErr);
                }

                // Get Slacks list
                var slacks = slacksGetRes.body;

                // Set assertions
                (slacks[0].user._id).should.equal(userId);
                (slacks[0].name).should.match('Slack name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Slack if not logged in', function (done) {
    agent.post('/api/slacks')
      .send(slack)
      .expect(403)
      .end(function (slackSaveErr, slackSaveRes) {
        // Call the assertion callback
        done(slackSaveErr);
      });
  });

  it('should not be able to save an Slack if no name is provided', function (done) {
    // Invalidate name field
    slack.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Slack
        agent.post('/api/slacks')
          .send(slack)
          .expect(400)
          .end(function (slackSaveErr, slackSaveRes) {
            // Set message assertion
            (slackSaveRes.body.message).should.match('Please fill Slack name');

            // Handle Slack save error
            done(slackSaveErr);
          });
      });
  });

  it('should be able to update an Slack if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Slack
        agent.post('/api/slacks')
          .send(slack)
          .expect(200)
          .end(function (slackSaveErr, slackSaveRes) {
            // Handle Slack save error
            if (slackSaveErr) {
              return done(slackSaveErr);
            }

            // Update Slack name
            slack.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Slack
            agent.put('/api/slacks/' + slackSaveRes.body._id)
              .send(slack)
              .expect(200)
              .end(function (slackUpdateErr, slackUpdateRes) {
                // Handle Slack update error
                if (slackUpdateErr) {
                  return done(slackUpdateErr);
                }

                // Set assertions
                (slackUpdateRes.body._id).should.equal(slackSaveRes.body._id);
                (slackUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Slacks if not signed in', function (done) {
    // Create new Slack model instance
    var slackObj = new Slack(slack);

    // Save the slack
    slackObj.save(function () {
      // Request Slacks
      request(app).get('/api/slacks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Slack if not signed in', function (done) {
    // Create new Slack model instance
    var slackObj = new Slack(slack);

    // Save the Slack
    slackObj.save(function () {
      request(app).get('/api/slacks/' + slackObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', slack.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Slack with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/slacks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Slack is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Slack which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Slack
    request(app).get('/api/slacks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Slack with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Slack if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Slack
        agent.post('/api/slacks')
          .send(slack)
          .expect(200)
          .end(function (slackSaveErr, slackSaveRes) {
            // Handle Slack save error
            if (slackSaveErr) {
              return done(slackSaveErr);
            }

            // Delete an existing Slack
            agent.delete('/api/slacks/' + slackSaveRes.body._id)
              .send(slack)
              .expect(200)
              .end(function (slackDeleteErr, slackDeleteRes) {
                // Handle slack error error
                if (slackDeleteErr) {
                  return done(slackDeleteErr);
                }

                // Set assertions
                (slackDeleteRes.body._id).should.equal(slackSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Slack if not signed in', function (done) {
    // Set Slack user
    slack.user = user;

    // Create new Slack model instance
    var slackObj = new Slack(slack);

    // Save the Slack
    slackObj.save(function () {
      // Try deleting Slack
      request(app).delete('/api/slacks/' + slackObj._id)
        .expect(403)
        .end(function (slackDeleteErr, slackDeleteRes) {
          // Set message assertion
          (slackDeleteRes.body.message).should.match('User is not authorized');

          // Handle Slack error error
          done(slackDeleteErr);
        });

    });
  });

  it('should be able to get a single Slack that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Slack
          agent.post('/api/slacks')
            .send(slack)
            .expect(200)
            .end(function (slackSaveErr, slackSaveRes) {
              // Handle Slack save error
              if (slackSaveErr) {
                return done(slackSaveErr);
              }

              // Set assertions on new Slack
              (slackSaveRes.body.name).should.equal(slack.name);
              should.exist(slackSaveRes.body.user);
              should.equal(slackSaveRes.body.user._id, orphanId);

              // force the Slack to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Slack
                    agent.get('/api/slacks/' + slackSaveRes.body._id)
                      .expect(200)
                      .end(function (slackInfoErr, slackInfoRes) {
                        // Handle Slack error
                        if (slackInfoErr) {
                          return done(slackInfoErr);
                        }

                        // Set assertions
                        (slackInfoRes.body._id).should.equal(slackSaveRes.body._id);
                        (slackInfoRes.body.name).should.equal(slack.name);
                        should.equal(slackInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Slack.remove().exec(done);
    });
  });
});
