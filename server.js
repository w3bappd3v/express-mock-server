// server.js
const express = require('express');
const jsonServer = require('json-server');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const reload = require('reload');
const server = jsonServer.create();
const router = jsonServer.router('db.json');

server.use(fileUpload());
server.use(morgan('combined'));
server.use(express.static('public'));

server.options('*', cors());

server.listen(3100, () => {
  console.log('JSON Server is running')
});

server.get('/echo', (req, res) => {
  res.jsonp({ 'hey': '1' });
});

server.get('/' + process.argv[2] + '/' + process.argv[2] + ' /', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/' + process.argv[2] + '/' + process.argv[2] + '.html'));
});

server.post('/upload', function (req, res) {
  var fs = require('fs');
  var util = require('util')

  fs.writeFileSync('./req.json', util.inspect(req), 'utf-8');

  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }

  for (var file in req.files) {
    if (req.files.hasOwnProperty(file)) {
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let thisFile = req.files[file];
      // Use the mv() method to place the file somewhere on your server
      thisFile.mv('./uploads/' + thisFile.name, function (err) {
        // if (err)
        //   return res.status(500).send(err);
        //
      });
    }
  }
  res.send('Files uploaded!');
});

server.use(router);