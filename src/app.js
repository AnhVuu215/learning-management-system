const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');
const { authRateLimiter } = require('./middlewares/rateLimit');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(',') || true,
    credentials: true,
  })
);
app.use(helmet());
app.use(compression());

app.use('/api/v1/auth', authRateLimiter, routes.authRouter);
app.use('/api/v1', routes.apiRouter);
app.use('/', routes.viewRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

