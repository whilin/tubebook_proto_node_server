var http = require('http');
var https = require('https');
var fs = require('fs');

var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var cors = require('cors');

var AWS = require('aws-sdk'); // To set the AWS credentials and region.

//! 1단계, 앱 서버 설정
var app = express();
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//app.use(multer());


//! 2단계, API 라우팅 테이블 구성
var routeTable = require('./routeTable');
routeTable.mappingRouteTable(app);

//! 테이블을 사용하지 않고 직접 라우트 코드 작성하기
app.get('/hello/:db/:collection', function(req, res){
  res.send("Hi~, Fuck you");
});

const options = {
	key: fs.readFileSync('./keys/private.pem'),
	cert: fs.readFileSync('./keys/public.pem')
};

//! 3단계, 서버 실행
var serverConfig = require('./serverConfig');
https.createServer(options, app).listen(serverConfig.port, //, serverConfig.hostname, 
  function()
  {
      console.log(`Server running at https://${serverConfig.hostname}:${serverConfig.port}/`);
  });


AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
    console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
  }
});


AWS.config.update({
    region: "ap-northeast-2",
});
