require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var compression = require('compression');
var helmet = require('helmet');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var inventoryRouter = require('./routes/inventory')

var app = express();

var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI || process.env.URL
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console,'Mongo DB Connection Error'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads');
  },
  filename: (req, file, callback) => {
    callback(null, file.fieldname + "-" + Date.now());
  }
});

var upload = multer({ storage: storage })

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js"],
      "style-src": ["'self'", "https://fonts.googleapis.com/css2family=Odibee+Sans&display=swap", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css", 'sha256-Y9v1MZrln1N8aPBY5lmpxYKwFkcp/nyBMMEnn7WFjuw='],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      
    },
  })
);

app.disable('x-powered-by')

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/inventory', inventoryRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
