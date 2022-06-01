var http = require('http');

const numSalle = require('../../configNumSalle');

var options = {
  host: 'localhost',
  // host: '192.168.0.10',
  path: '/api/getCo2Routes/getCo2/' + numSalle,
  port: '5000',
  headers: { 'Content-Type': 'application/json' },
};

callback = function (response) {
  let str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log('Le taux de Co2 : ', JSON.parse(str)['co2Room']);
  });
};

let req = http.request(options, callback);
// console.log('req :', req);

req.end();
