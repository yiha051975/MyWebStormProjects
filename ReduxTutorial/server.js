/**
 * Created by Sheldon Lee on 2/6/2016.
 */
var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var multiparty = require('multiparty');

fs.stat('./uploads', function(err, stats) {
    if (err) {
        fs.mkdir('./uploads')
    }
});

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, boundary");

    next();
});

app.post('/api/upload', function(req, res) {
    var form = new multiparty.Form({uploadDir: './uploads'});

    form.parse(req, function(err, fields, files) {
        if (files.preview) {
            console.log(files.preview[0]);
        }

        if (files.fileUpload) {
            console.log(files.fileUpload[0]);
        }
        res.end('{"message":"File received"}');
    });
});

var server = app.listen(3000, function () {
    console.log("Example app listening at http://localhost:3000");
});
