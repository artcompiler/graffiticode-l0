import request from 'supertest';
import express from 'express';
import routes from '../index.js';
describe('routes', () => {
  describe('compile', () => {
    let called;
    let app;
    beforeEach(() => {
      called = 0;
      const compiler = {
        compile: function(code, data, config, resume) {
          called++;
          resume(null, null);
        }
      };

      app = express();
      app.use(express.json({type: "application/json", limit: '50mb' }));
      app.post('/compile', routes.compile(compiler));
    });

    it('should call compile function', (done) => {
      request(app)
        .post('/compile')
        .set('Content-type', 'application/json')
        .send(JSON.stringify({src: {}, data: {}}))
        .expect(200, 'null')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(called).toBe(1);
          done();
        });
    });

    it('should return 400 for bad body', (done) => {
      request(app)
        .post('/compile')
        .set('Content-type', 'text/plain')
        .send('bad body')
        .expect(400, 'Bad Request', done);
    });

    it('should return 400 for no data', (done) => {
      request(app)
        .post('/compile')
        .set('Content-type', 'application/json')
        .send({})
        .expect(400, 'Bad Request', done);
    });

    it('should return 400 for no code', (done) => {
      request(app)
        .post('/compile')
        .set('Content-type', 'application/json')
        .send(JSON.stringify({data: {}}))
        .expect(400, 'Bad Request', done);
    });
  });
});
