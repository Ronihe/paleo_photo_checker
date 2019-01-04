const express = require('express');
const app = express();
//config the app to use pug
const path = require('path');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));
const APIError = require('./helpers/APIError');
// uncomment below to use morgan for basic logging
const morgan = require('morgan');

// allow express to parse JSON
app.use(express.json());
// Parse request bodies for JSON
app.use(express.urlencoded({ extended: true }));

// log items to console using morgan - optional enable
app.use(morgan('tiny'));

const imagesRoutes = require('./routes/images');
const paleoRoutes = require('./routes/paleo');

// routing control
app.use('/images', imagesRoutes);
app.use('/paleo', paleoRoutes);

/** 404 catch all */
app.use((req, res, next) => {
  const error = new Error('Resource could not be found.');
  error.status = 404;
  return next(error);
});

/** error handler */
app.use((err, req, res, next) => {
  // all errors that get to here get coerced into API Errors
  if (!(err instanceof APIError)) {
    err = new APIError(err.status, err.message);
  }

  // set the status and alert the user
  return res.status(err.status).json(err);
});

module.exports = app;
