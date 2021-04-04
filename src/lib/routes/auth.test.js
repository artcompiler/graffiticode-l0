const express = require('express');
const request = require('supertest');

const routes = require('.');

describe('routes', () => {
  describe('auth', () => {
    let called;
    let app;
    let auth;
    beforeEach(() => {
      called = 0;
      auth = null;

      function authProxy(token, scope, resume) {
        if (!auth) {
          return resume(new Error('no auth given'));
        }
        auth(token, scope, resume);
      }

      app = express();
      app.use(express.json({type: "application/json", limit: '50mb' }));
      app.get('/auth', routes.auth(authProxy, 'foo'), (_, res) => res.sendStatus(200));
    });

    it('should pass token to auth', (done) => {
      auth = function(token, scope, resume) {
        expect(token).toBe('fake-token');
        resume(null, {access: 'foo'});
      };
      request(app)
        .get('/auth')
        .set('Content-type', 'application/json')
        .send({auth: 'fake-token'})
        .expect(200, 'OK', done);
    });

    it('should return 401 for bad body', (done) => {
      request(app)
        .get('/auth')
        .set('Content-type', 'text/plain')
        .send("bad body")
        .expect(401, 'Unauthorized', done);
    });

    it('should return 200 if auth does contain scope', (done) => {
      auth = function(token, scope, resume) {
        resume(null, {access: 'foo'});
      };
      request(app)
        .get('/auth')
        .set('Content-type', 'application/json')
        .send({})
        .expect(200, 'OK', done);
    });

    it('should return 401 if auth does not contain scope', (done) => {
      auth = function(token, scope, resume) {
        resume(null, {access: 'boo'});
      };
      request(app)
        .get('/auth')
        .set('Content-type', 'application/json')
        .send({})
        .expect(401, 'not authorized for foo', done);
    });

    it('should return 401 if auth returns error', (done) => {
      auth = function(token, scope, resume) {
        resume(new Error('bar'));
      };
      request(app)
        .get('/auth')
        .set('Content-type', 'text/plain')
        .send(JSON.stringify({}))
        .expect(401, 'Unauthorized', done);
    });
  });
});
