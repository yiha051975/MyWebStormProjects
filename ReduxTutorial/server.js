/**
 * Created by Sheldon Lee on 2/6/2016.
 */
var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var storedFiles, filesLocation;

fs.stat('./uploads/', function(err) {
    if (err) {
        fs.mkdir('./uploads');
        fs.writeFile('./uploads/files.json', '{}', function(err) {
            if (!err) {
                fs.readFile('./uploads/files.json', 'utf8', function (err, data) {
                    if (err) throw err;
                    storedFiles = JSON.parse(data);
                });
            }
        });
        fs.writeFile('./uploads/files-location.json', '{"filesLocation":{},"previewLocation":{}}', function(err, data) {
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
            storedFiles = JSON.parse(data);
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
        var fileId = fields.fileId[0];
        var tempFile;

        if (files.preview) {
            filesLocation.previewLocation[fileId] = files.preview[0].path;
        }

        if (files.fileUpload) {
            filesLocation.filesLocation[fileId] = files.fileUpload[0].path;
            if (!storedFiles[parentId]) {
                storedFiles[parentId] = {};
            }

            if (!storedFiles[parentId].files) {
                storedFiles[parentId].files = [];
            }

            tempFile = {
                id: fileId,
                file: {
                    name: files.fileUpload[0].originalFilename,
                    type: files.fileUpload[0].headers['content-type'],
                    size: files.fileUpload[0].size
                },
                isUploaded: true,
                isUploading: false,
                uploadedDate: new Date().getTime(),
                previewUrl: './api/ViewPreview?fid=' + fileId,
                fileUrl: './api/ViewFile?fid=' + fileId
            };

            storedFiles[parentId].files.push(tempFile);
        }
        fs.writeFileSync('./uploads/files.json', JSON.stringify(storedFiles));
        fs.writeFileSync('./uploads/files-location.json', JSON.stringify(filesLocation));
        res.end(JSON.stringify(tempFile));
    });
});

app.get('/api/ViewPreview', function(req, res) {
    var fileId = req.query.fid;

    var readStream = fs.createReadStream(filesLocation.previewLocation[fileId]);
    readStream.pipe(res);
});

app.get('/api/ViewFile', function(req, res) {
    var fileId = req.query.fid;

    var readStream = fs.createReadStream(filesLocation.filesLocation[fileId]);
    readStream.pipe(res);
});

var server = app.listen(3000, function () {
    console.log("Example app listening at http://localhost:3000");
});
