import express from 'express';
import morgan from 'morgan';
import {createAuth} from './src/auth.js';
import {compiler} from './src/compile.js';
import routes from './src/routes/index.js';
import fs from 'fs';
global.config = fs.readFileSync('./config.json');
const PORT = process.env.PORT || `5${compiler.langID}`;
const auth = createAuth(compiler);
export const app = express();
app.use(morgan('dev'));
app.use(express.json({type: 'application/json', limit: '50mb'}));

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
app.listen(parseInt(PORT, 10), () => {
  console.log(`Node app is running at :${PORT}`);
});
