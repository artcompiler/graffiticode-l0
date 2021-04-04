const request = require('supertest');
const express = require('express');

const routes = require('.');

describe('routes', () => {
  describe('version', () => {
    it('should return specified compiler version', (done) => {
      const compiler = {
        version: 'v1.2.3'
      };
      const app = express();
      app.get('/version', routes.version(compiler));
      request(app)
        .get('/version')
        .expect(200, 'v1.2.3', done);
    });

    it('should return v0.0.0 when no compiler version', (done) => {
      const compiler = {};
      const app = express();
      app.get('/version', routes.version(compiler));
      request(app)
        .get('/version')
        .expect(200, 'v0.0.0', done);
    });
  });
});
