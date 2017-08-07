var express = require('express');
var shortid = require('shortid');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

var app = express();

app.get('/', function(req, res) {
    res.send("Hello Server!");
});

app.listen(3000);

var pathJSON = path.join(__dirname, 'data.json');
app.use(bodyParser.json());

app.route('/chirps')
    .get(function(req, res){
        res.sendFile(pathJSON);
    })

    .post(function(req, res){
        console.log('We are posting');
        console.log(req.body);
        fs.readFile(pathJSON, 'utf-8', function(err, file){
            if (err) {
                res.status(500);
                res.send('Cannot read files');
            }
            var data = JSON.parse(file);
            req.body.id = shortid.generate();
            data.push(req.body);
            fs.writeFile(pathJSON, JSON.stringify(data), function(err, success){
                if (err){
                    res.status(500)
                    res.send('Unable to update data');
                } else{
                    res.status(201);
                    res.send(req.body);
                }
            });
        });
    });

app.route('/chirps/one/:id')
    .put(function(req, res){
        console.log('Here\'s where we update');
        fs.readFile(pathJSON, 'utf-8', function(err, file){
            if (err){
                res.status(500);
                res.send('Unable to find single message.')
            }
            var id = req.params.id;
            var data = JSON.parse(file);

            data.forEach(function(chirp){
                if (chirp.id === id){
                    chirp.user = req.body.user;
                    chirp.message = req.body.message;
                }
            });
            fs.writeFile(pathJSON, JSON.stringify(data), function(err, success){
                if(err){
                    res.status(500);
                    res.send('Unable to modify data.')
                } else {
                    res.status(201);
                    res.send(req.body);
                }
            })
        })
    })
    .delete(function(req, res){
        console.log('Delete the things');
        fs.readFile(pathJSON, 'utf-8', function(err, fileContents) {
            if (err) {
            res.status(500);
            res.send('Unable to delete');
            } else {
                var id = req.params.id;
                var data = JSON.parse(fileContents);
                var deleteIndex = -1;
                data.forEach(function(chirp, i) {
                    if (chirp.id === id) {
                        deleteIndex = i;
                    }
                });
                if (deleteIndex != -1) {
                    data.splice(deleteIndex, 1);
                    fs.writeFile(pathJSON, JSON.stringify(data), function(err, success) {
                        if (err) {
                            res.status(500);
                        } else {
                            res.status(202);
                        }
                    });
                } else {
                    res.status(404);
                };
            };     
        });
    })

    .get(function(req, res) {
        console.log('get single item');
        fs.readFile(pathJSON, 'utf-8', function(err, file){
            if (err){
                res.status(500);
                res.send('Unable to find single message.')
            }
            var id = req.params.id;
            console.log(id);
            var result;
            var data = JSON.parse(file);
            data.forEach(function(chirp){
                if (chirp.id === id){
                    result = chirp;
                }
            });
            if (result) {
                res.send(result);
            } else {
                res.send(404);
            }
        })
    });