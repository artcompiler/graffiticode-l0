const express = require('express');
const morgan = require('morgan');

const {createAuth} = require('./src/lib/auth.js');
const compiler = require('./src/lib/compile.js');
const routes = require('./src/lib/routes');

global.config = require('./config.json');
const PORT = process.env.PORT || `5${compiler.langID}`;

const auth = createAuth(compiler);

const app = exports.app = express();
app.use(morgan('dev'));
app.use(express.json({ type: 'application/json', limit: '50mb' }));

// app routes
app.get('/', routes.root(compiler));
app.get('/version', routes.version(compiler));
app.post('/compile', routes.auth(auth, 'compile'), routes.compile(compiler));

// serve up static content from dist
app.use(express.static('dist'));

// catch and log any errors and return 500s
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(500);
});

// start the dance...
if (!module.parent) {
  app.listen(parseInt(PORT, 10), () => {
    console.log(`Node app is running at :${PORT}`);
  });
}
