/**
 * Created by Sheldon Lee on 12/12/2015.
 */
'strict';
var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + new ObjectID().toHexString());
    }
});
var streamifier = require('streamifier');
//var mysql = require('mysql');

var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var ObjectID = mongo.ObjectID;
var GridStore = mongo.GridStore;
var comments = [];
var responseObj;
//var monk = require('monk');

//app.use(bodyParser.json());       // to support JSON-encoded bodies
//app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//    extended: true
//}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:63342");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, boundary");

    next();
});

app.get('/api/comments', function (req, res) {
    /*fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        console.log( data );
        res.end( data );
    });*/

    //var connection = mysql.createConnection({
    //    host     : 'localhost',
    //    user     : 'root',
    //    password : 'Saturday13$',
    //    database : 'personalproject'
    //});
    //connection.connect();
    //
    //connection.query('SELECT json from reacttutorial', function(err, rows, fields) {
    //    if (!err) {
    //        responseObj = rows.map(function(row) {
    //            return JSON.parse(row.json);
    //        });
    //
    //        res.end(JSON.stringify(responseObj));
    //    } else {
    //        console.log('Error while performing Query.');
    //        res.end('{}');
    //    }
    //});
    //
    //connection.end();

    mongoClient.connect('mongodb://localhost:27017/ReactTutorial', function(err, db) {
        if (err !== null) {
            db.close();
        } else {
            db.collection('comment').find().toArray(function(err, items) {
                if (items !== null) {
                    responseObj = items;
                    res.end(JSON.stringify(items));
                } else {
                    res.end('[]');
                }
                db.close();
            });
        }
    });
});

app.post('/api/comments', function(req, res) {
    var body, id;

    if (req.body && req.body.author && req.body.text)
    {
        id = responseObj.length + 1;
        body = req.body;
        body['id'] = id;

        //responseObj.push(body);
        //
        //var connection = mysql.createConnection({
        //    host     : 'localhost',
        //    user     : 'root',
        //    password : 'Saturday13$',
        //    database : 'personalproject'
        //});
        //
        //connection.connect();
        //
        //connection.query('INSERT INTO reacttutorial (id, json) values (' + body.id + ',\'' + JSON.stringify(body) + '\')', function(err, rows, fields) {
        //    if (!err) {
        //        console.log('successful saved the new comment');
        //    } else {
        //        console.log('Error while performing Query.');
        //    }
        //});
        //
        //connection.end();

        mongoClient.connect('mongodb://localhost:27017/ReactTutorial', function(err, db) {
            if (err !== null) {
                db.close();
            } else {
                db.collection('comment').save(body, function(err, item) {
                    if (item !== null) {
                        body['_id'] = item.ops[0]._id;
                        responseObj.push(body);
                        res.end(JSON.stringify(responseObj));
                    } else {
                        res.end('[]');
                    }
                    db.close();
                });
            }
        });
    } else {
        res.end('[]');
    }

    //res.end(JSON.stringify(responseObj));
});

app.post('/api/FileUpload', multer(/*{ storage : storage}*/).single('fileUploadInput'), function(req, res) {
    var gridStore;
    var fieldId;
    //var binary;
    if (req.file) {
        mongoClient.connect('mongodb://localhost:27017/ReactTutorial', function(err, db) {
            if (err !== null) {
                db.close();
            } else {
                fieldId = new ObjectID();
                gridStore = new GridStore(db, fieldId, req.file.originalname, 'w', {root:'FileStorage',content_type:req.file.mimetype});
                //binary = new mongo.Binary(req.file.buffer);
                gridStore.chunkSize = 1024 * 256;

                gridStore.open(function(err, gridStore) {
                    gridStore.write(req.file.buffer, function(err, gridStore) {
                        if (err === null) {
                            // Close (Flushes the data to MongoDB)
                            gridStore.close(function(err, result) {
                                if (err === null) {
                                    // Verify that the file exists
                                    GridStore.exist(db, req.file.originalname, 'FileStorage', function (err, result) {
                                        //assert.equal(null, err);
                                        //assert.equal(true, result);
                                        if (result) {
                                            console.log('File has been persisted to database');
                                            res.end(req.file.originalname + ' has been persisted to database.');
                                        } else {
                                            console.log('Failed to persisted file to database.');
                                            res.end('Error while persisting ' + req.file.originalname);
                                        }
                                        db.close();
                                    });
                                }
                            });
                        }
                    });
                });
            }
        });
    }

    // the following code is good for debuging but it won't let you retrieve the binary though.
    //upload(req,res,function(err) {
    //    if(err) {
    //        return res.end("Error uploading file.");
    //    }
    //    res.end("File is uploaded");
    //});
});

app.get('/api/RetrieveFile', function(req, res) {
    var objectId, fileName, gridStore;
    if (req.query /*&& req.query.fileName*/ && req.query.fileId) {
        objectId = new ObjectID(req.query.fileId);
        fileName = req.query.fileName;

        mongoClient.connect('mongodb://localhost:27017/ReactTutorial', function(err, db) {
            if (err !== null) {
                db.close();
            } else {
                gridStore = new GridStore(db, objectId, 'r', {root:'FileStorage'});

                gridStore.open(function(err, gridStore) {
                    var stream = gridStore.stream();

                    stream.on("data", function(chunk) {
                        console.log("Chunk of file data");
                    });

                    stream.on("end", function() {
                        console.log("EOF of file");
                        // Content-Disposition would set the file name and if the browser should download the file immediately when the get request is processed
                        // 'attachment' would cause the browser to download the file immediately when get operation went through.
                        // filename would only default the file name for this file. EX. filename=test.txt then the file name will be 'test.txt'
                        // Example:     'Content-Disposition':'attachment;filename=' + this.gs.filename
                        res.writeHead(200, {'Content-Type': this.gs.contentType, 'Content-Disposition':'filename=' + this.gs.filename, 'Content-Length':this.gs.length.toString()});
                        res.end(this.gs.currentChunk.data.buffer, 'binary');
                    });

                    stream.on("close", function() {
                        console.log("Finished reading the file");
                    });
                });
            }
        });
    }
});

var server = app.listen(63341, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

});
