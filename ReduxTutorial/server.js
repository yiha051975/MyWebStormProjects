/**
 * Created by Sheldon Lee on 2/6/2016.
 */
var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var files, filesLocation;

fs.stat('./uploads/', function(err) {
    if (err) {
        fs.mkdir('./uploads');
        fs.writeFile('./uploads/files.json', '{}', function(err) {
            if (!err) {
                fs.readFile('./uploads/files.json', 'utf8', function (err, data) {
                    if (err) throw err;
                    files = JSON.parse(data);
                });
            }
        });
        fs.writeFile('./uploads/files-location.json', '{}', function(err, data) {
            if (!err) {
                fs.readFile('./uploads/files-location.json', 'utf8', function(err, data) {
                    if (err) throw err;
                    filesLocation = JSON.parse(data);
                });
            }
        });
    } else {
        fs.readFile('./uploads/files.json', 'utf8', function (err, data) {
            if (err) throw err;
            files = JSON.parse(data);
        });
        fs.readFile('./uploads/files-location.json', 'utf8', function(err, data) {
            if (err) throw err;
            filesLocation = JSON.parse(data);
        });
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
        var parentId = fields.parentId[0];
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
