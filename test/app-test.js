import request from 'supertest';
import chai from 'chai';
import {app} from './../app.js';
const expect = chai.expect;
describe('app', () => {
  it('GET /', (done) => {
    request(app)
      .get('/')
      .expect(200, 'Hello, L0!', done);
  });
  it('global.config.unused should be true', () => {
    expect(typeof global.config === 'object').to.equal(true);
  });
  it('GET /version', (done) => {
    request(app)
      .get('/version')
      .expect(200, 'v0.0.0', done);
  });
  it('POST /compile', (done) => {
    const body = {
      code: {
        "1": {
          "tag": "STR",
          "elts": [
            "hi"
          ]
        },
        "2": {
          "tag": "EXPRS",
          "elts": [
            1
          ]
        },
        "3": {
          "tag": "PROG",
          "elts": [
            2
          ]
        },
        "root": 3
      },
      data: {},
    };
    const encodedBody = JSON.stringify(body);
    request(app)
      .post('/compile')
      .set('Content-type', 'application/json')
      .send(encodedBody)
      .expect(200, '"hi"', done);
  });
});
