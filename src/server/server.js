const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');

const app = express();

const pcDir = 'pc';
const mobileDir = 'mobile';

app.use(compression());
app.use(favicon(path.join(__dirname, pcDir, 'public', 'favicon.ico')));
app.use(favicon(path.join(__dirname, mobileDir, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, pcDir, 'public')));
app.use(express.static(path.join(__dirname, mobileDir, 'public')));

app.use(function(req, res, next) {
  if(path.extname(req.path)) {
    next();
  }else {
    const deviceAgent = req.headers["user-agent"].toLowerCase();
    const agentID = deviceAgent.match(/(iphone|ipod|ipad|android|mobile)/);
    let filePath = pcDir;

    if(agentID){
      filePath = mobileDir;
    }

    res.sendfile(path.resolve(__dirname, filePath, 'public', 'index.html'));
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.end('error');
});

const port = 8000;
app.listen(port, function() {
  console.log('Listening on 1 port ' + port + '...');
  if(process.env !== 'development') {
    app.use('/apps/journalistCloud', require('./apps/journalistCloud'));
  }else {

  }
});
