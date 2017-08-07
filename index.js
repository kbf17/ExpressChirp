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

});

app.delete('/chirps/:id', function(req, res){

});

app.get('/chirps/:id', function(req, res) {
 
});