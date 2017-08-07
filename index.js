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
app.use(bodyParser.json());

var pathJSON = path.join(__dirname, 'data.json');

app.get('/chirps', function(req, res){
    res.sendFile(pathJSON);
   
});

app.post('/chirps', function(req, res){
  console.log('We are posting');

});

app.put('/chirps/:id', function(req, res){
    console.log('Here\'s where we update');
});

app.delete('/chirps/:id', function(req, res){
    console.log('Delete the things');
});

app.get('/chirps/:id', function(req, res) {
    console.log('get single item');
    res.sendFile(pathJSON, 'utf-8', function(err, file){
        if (err){
            res.status(500);
            res.send('Unable to find single message.')
        }
        var arr = JSON.parse(file);
        var id = req.params.id;
        var result;

        arr.forEach(function(chirp){
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