var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers');
var fs = require('fs');
var _ = require('underscore');
// require more modules/folders here!

// this is called when http form does a post
// if fs.exists(url) does not exist, then we need to pass it to our daemon and send back loading, when page loaded, load page
// if fs.exists(url) does exist, then we want to load up that page
exports.handleRequest = function (req, res) {
  console.log('Receiving method of type ' + req.method + ' from url ' + req.url);
  if (req.method === 'POST') {
    // archive.isUrlArchived();
    var data = '';
    req.on('data', function(chunk) {
      data += chunk;
    }).on('end', function() {
      data;
      //eventually we will need to url.parts to get the top level domain
      archive.isUrlArchived(data, (isArchived) => {
        if (!isArchived) {
          // add it to sites.txt
          // TODO: data is escaped???
          archive.addUrlToList(data, null); 
        }
      });
    });
    fs.readFile(path.join(archive.paths.siteAssets, '/loading.html'), function(err, data) {
      if (err) {
        throw err; 
      }
      console.log('we are trying to write data ' + data);
      res.writeHead(200, httpHelper.headers);
      res.end(data); 
    }); 

  } else if (req.method === 'GET') {
    req.on('end', function() {
      //eventually we will need to url.parts to get the top level domain
      archive.isUrlArchived(req.url, (isArchived) => {
        if (isArchived) {
          // load the url to the dom 
          
        } else {
          // console.log('loading.html should be loaded');
          // location.pathname = './public/loading.html';
          // load loading.html and do daemon stuff
          // all the daemon code could be here
          // load the url to the dom
        }
      });
    });
    
    fs.readFile(path.join(archive.paths.siteAssets, '/index.html'), function(err, data) {
      if (err) {
        throw err; 
      }
      console.log('we are trying to write data ' + data);
      res.writeHead(200, httpHelper.headers);
      res.end(data); 
    }); 
    
    console.log('Responding with header 302');
    // res.redirect('./public/loading.html');
    
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, httpHelper.headers);
    res.end('hello world3');
  } else {
    console.log('else');
    res.writeHead(404, httpHelper.headers);
    res.end('hello world4');
  }
};
