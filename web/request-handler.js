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
      data = data.slice(4, data.length);
      //eventually we will need to url.parts to get the top level domain
      archive.isUrlInList(data, (exists) => {
        if (exists) {
          archive.isUrlArchived(data, (isArchived) => {
            if (isArchived) {
              // add it to sites.txt
              // TODO: data is escaped???
              console.log('WE ARE ARCHIVED!' + data);
              // res.writeHead(302, _.extend(httpHelper.headers, {'Location': '/loading'}));
              res.writeHead(302, _.extend(httpHelper.headers, {'Location': '/' + data}));
              res.end(data); 
            } else {
              archive.addUrlToList(data, null); 
              res.writeHead(302, _.extend(httpHelper.headers, {'Location': '/loading'}));
              res.end(data); 
              // the daemon just takes our url and queries the server?
            }
          });
        } else {
          archive.addUrlToList(data, null); 
          res.writeHead(302, _.extend(httpHelper.headers, {'Location': '/loading'}));
          res.end(data); 
        }
      });
    });

  } else if (req.method === 'GET') {
    // req.on('end', function() {
    //   //eventually we will need to url.parts to get the top level domain
    //   archive.isUrlArchived(req.url, (isArchived) => {
    //     if (isArchived) {
    //       // load the url to the dom 
          
    //     } else {
    //       // console.log('loading.html should be loaded');
    //       // location.pathname = './public/loading.html';
    //       // load loading.html and do daemon stuff
    //       // all the daemon code could be here
    //       // load the url to the dom
    //     }
    //   });
    // });
    if (req.url === '/') {
      fs.readFile(path.join(archive.paths.siteAssets, '/index.html'), function(err, data) {
        if (err) {
          throw err; 
        }
        //console.log('we are trying to write data ' + data);
        res.writeHead(200, httpHelper.headers);
        res.end(data);
      }); 
    } else if (req.url === '/loading') {
      fs.readFile(path.join(archive.paths.siteAssets, '/loading.html'), function(err, data) {
        if (err) {
          throw err; 
        }
        //console.log('we are trying to write data ' + data);
        console.log('LOADED??');
        res.writeHead(200, httpHelper.headers);
        res.end(data); 
      }); 
    } else if (req.url === '/styles.css') {
      res.writeHead(200, httpHelper.headers);
      res.end(data);
    } else if (req.url === '/favicon.ico') {
      res.writeHead(200, httpHelper.headers);
      res.end(data);
    } else {
      console.log('attempting to redirect to: ' + req.url);
      var isInList = false;
      archive.isUrlArchived(req.url.slice(1, req.url.length), function(exists) {
        if (exists) {
          fs.readFile(path.join(archive.paths.archivedSites, req.url), function(err, data) {
            if (err) {
              throw err;
            }
            //console.log('we are trying to write data ' + data);
            res.writeHead(200, httpHelper.headers);
            res.end(data.toString()); 
          });
        } else {
          console.log('4040 club?? ');
          //REDIRECT TO THE 4040CLUB??!?111
          res.writeHead(404, httpHelper.headers);
          res.end();
        }
      });
      
    }
    
    // console.log('Responding with header 302');
    // res.redirect('./public/loading.html');
    
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, httpHelper.headers);
    res.end('hello world3');
  } else {
    res.writeHead(404, httpHelper.headers);
    res.end('hello world4');
  }
};
