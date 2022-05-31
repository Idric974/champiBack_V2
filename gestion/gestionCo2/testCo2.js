var http = require('http');

const numSalle = require('../../configNumSalle');

var options = {
  // host: 'localhost',
  host: '192.168.0.10',
  path: '/api/getCo2Routes/getCo2/' + numSalle,
  port: '5000',
  headers: { 'Content-Type': 'application/json' },
};

callback = function (response) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log('Le taux de Co2 : ', JSON.parse(str)['co2Room']);
  });
};

var req = http.request(options, callback);
req.end();
