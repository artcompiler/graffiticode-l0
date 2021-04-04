const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const { Polly } = require('@pollyjs/core');
const FSPersister = require('@pollyjs/persister-fs');
const { createAuth } = require('./auth');

Polly.register(FSPersister);
Polly.register(NodeHttpAdapter);

describe('auth', () => {
  const compiler = { langID: '0' };
  const { server } = new Polly("1", {
    adapters: ['node-http'],
    persister: 'fs',
  });

  it('should validate with no token', function(done) {
    // Arrange
    const auth = createAuth(compiler);

    // Act
    auth(null, 'foo', (err, data) => {
      if (err) {
        return done(err);
      }

      // Assert
      expect(data.address).toBe('guest');
      expect(data.access).toBe('foo');
      done();
    });
  });

  it('should return err for invalid token', function(done) {
    // Arrange
    const auth = createAuth(compiler);
    server
      .post('https://auth.artcompiler.com/validate')
      .intercept((_, res) => res.sendStatus(401));

    // Act
    auth('fake-token', 'foo', (err, data) => {
      if (!err) {
        return done(new Error('expected an error'));
      }

      // Assert
      expect(err.message).toBe('Unauthorized');
      done();
    });
  });

  it('should data for valid token', function(done) {
    // Arrange
    const auth = createAuth(compiler);
    server
      .post('https://auth.artcompiler.com/validate')
      .intercept((_, res) => res.status(200).json({ address: '1.2.3.4', access: 'foo' }));
    server
      .post('https://auth.artcompiler.com/count')
      .intercept((_, res) => res.sendStatus(200));

    // Act
    auth('fake-token', 'foo', (err, data) => {
      if (err) {
        return done(err);
      }

      // Assert
      expect(data.address).toBe('1.2.3.4');
      expect(data.access).toBe('foo');
      done();
    });
  });

  it('should cache data', function(done) {
    // Arrange
    const auth = createAuth(compiler);
    server
      .post('https://auth.artcompiler.com/validate')
      .intercept((_, res) => res.status(200).json({ address: '1.2.3.4', access: 'foo' }), {times: 1});
    server
      .post('https://auth.artcompiler.com/count')
      .intercept((_, res) => res.sendStatus(200))
      .times(2);

    // Act
    auth('fake-token', 'foo', (err, data) => {
      if (err) {
        return done(err);
      }

      // Assert
      expect(data.address).toBe('1.2.3.4');
      expect(data.access).toBe('foo');

      auth('fake-token', 'foo', (err, data) => {
        if (err) {
          return done(err);
        }

        // Assert
        expect(data.address).toBe('1.2.3.4');
        expect(data.access).toBe('foo');
        done();
      });
    });
  });
});
