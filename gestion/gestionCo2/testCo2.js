const http = require('http');
const numSalle = require('../../configNumSalle');

const data = JSON.stringify({
  numSalle: numSalle,
});

let str = '';
let tauxCo2;

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/getCo2Routes/getCo2',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

const req = http.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);

  res
    .on('data', (d) => {
      str += d;
    })
    .on('end', () => {
      tauxCo2 = JSON.parse(str)['co2Room'];
      console.log('Le taux de Co2 reçut de la master: ', tauxCo2);
    });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
