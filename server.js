require('dotenv').config()
global.express = require('express');
var app = express();
global.bodyParser = require('body-parser');
global.jsonParser = bodyParser.json();
global.TokenKey = process.env.TokenKey;
global.jwt = require('jwt-simple');
var mysql = require('mysql');
// global.https = require('https');
global.generatePassword = require("password-generator");
global.formidable = require('formidable');
var http = require('http').Server(app);
global.fs = require('fs');
global.validator = require('validator');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// if (process.env.IsProduction == 1) {
//     global.connection = mysql.createConnection({
//         host: process.env.MysqlHost,
//         user: process.env.Mysqluser,
//         password: process.env.Mysqlpassword,
//         database: process.env.MysqlProddatabase
//     });
// } else {
//     global.connection = mysql.createConnection({
//         host: process.env.MysqlHost,
//         user: process.env.Mysqluser,
//         password: process.env.Mysqlpassword,
//         database: process.env.Mysqldatabase
//     });
// }
// app.use(passport.initialize());
app.use(express.static(__dirname + '/'));
//email setup


app.use(function (req, res, next) {
    var oneof = false;
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if (req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if (req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    // if (oneof) {
    //     res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    // }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});


app.use('/main', require('./controllers/main'));

http.listen(process.env.ApiPort, function () {
    console.log('listening on *:' + process.env.ApiPort);
});