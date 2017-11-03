// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.



var fs = require('fs');
var http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 8080,
  path: '/',
  method: 'GET',
  headers: {
  }
};

console.log('pressed button');
const req = http.get('http://www.google.com', (res) => {
  console.log(res.statusCode);  
  var data = '';
  res.on('data', (chunk) => {
    data += chunk;
  }).on('end', () => {
    console.log(data);
    fs.appendFile('/Users/student/code/hrsf84-web-historian/archives/sites/www.google.com', data, function(err) {
      if (err) {  
        throw err; 
      }
    });
  });
});
