import request from 'supertest';
import express from 'express';
import routes from '../index.js';
describe('routes', () => {
  describe('lang', () => {
    it('should return specified compiler langID', (done) => {
      const compiler = {
        langID: '42'
      };
      const app = express();
      app.get('/lang', routes.lang(compiler));
      request(app)
        .get('/lang')
        .expect(200, 'Hello, L42!', done);
    });
    it('should return v0.0.0 when no compiler langID', (done) => {
      const compiler = {};
      const app = express();
      app.get('/lang', routes.lang(compiler));
      request(app)
        .get('/lang')
        .expect(200, 'Hello, L0!', done);
    });
  });
});
