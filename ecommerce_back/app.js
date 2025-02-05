var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var produitsRouter = require('./routes/produits');
var imageRouter = require('./routes/image');
var downloadRouter = require('./routes/download');
var categoriesRouter = require('./routes/categories')
var paniersRouter = require("./routes/paniers")
var panierProduitsRouter = require('./routes/panierProduits')
var commandesRouter = require('./routes/commandes')
var sousCategorieRouter = require('./routes/souscategorie')
const authRouter = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const checkRole = require('./middleware/roles')

var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/', indexRouter);
app.use('/users',authMiddleware,checkRole([1]), usersRouter);
app.use('/produits', produitsRouter);
app.use('/image', imageRouter);
app.use('/download', authMiddleware, downloadRouter);
app.use('/categories', categoriesRouter);
app.use('/commandes', authMiddleware, commandesRouter);
app.use('/paniers', authMiddleware, paniersRouter);
app.use('/panierProduits', authMiddleware, panierProduitsRouter);
app.use('/auth', authRouter);
app.use('/souscategories', sousCategorieRouter);

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
