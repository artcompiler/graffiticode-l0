import https from 'https';
import request from 'request';
import url from 'url';

const agent = new https.Agent({keepAlive: true});

function postAuth(path, data, resume) {
  const uri = new url.URL('https://auth.artcompiler.com');
  uri.pathname = path;

  const options = {
    uri: uri,
    body: data,
    json: true,
    agent: agent,
  };

  request.post(options, (err, res, body) => {
    if (err) {
      return resume(err);
    }
    if (res.statusCode !== 200) {
      return resume(new Error(body));
    }
    resume(null, body);
  });
}

function count(compiler, token, count) {
  const data ={
    jwt: token,
    lang: `L${compiler.langID}`,
    count: count,
  };
  postAuth('/count', data, (err) => {
    if (err) {
      console.log(`Auth count error: ${err.message}`);
    }
  });
}

export const createAuth = function createAuth(compiler) {
  const validatedCache = new Map();
  return function (token, scope, resume) {
    if (!token) {
      return resume(null, {
        address: 'guest',
        access: scope,
      });
    }
    if (validatedCache.has(token)) {
      count(compiler, token, 1);
      return resume(null, validatedCache.get(token));
    }
    const data = {
      jwt: token,
      lang: `L${compiler.langID}`,
    };
    postAuth('/validate', data, (err, data) => {
      if (err) {
        return resume(err);
      }
      validatedCache.set(token, data);
      count(compiler, token, 1);
      resume(null, data);
    });
  };
}
