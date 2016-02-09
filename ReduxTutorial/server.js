/**
 * Created by Sheldon Lee on 2/6/2016.
 */
var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var multiparty = require('multiparty');

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
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        console.log(files);
        res.end('{"message":"File received"}');
    });
});

var server = app.listen(3000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://localhost:3000");
});
