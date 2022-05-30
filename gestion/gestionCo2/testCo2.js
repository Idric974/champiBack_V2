const http = require('http');
const numSalle = require('../../configNumSalle');

let url = 'http://192.168.0.10:6000/api/getCo2Routes/getCo2/' + numSalle;
// let url = 'http://localhost:5000/api/getCo2Routes/getCo2/' + numSalle;
console.log('url :', url);

let data = '';
let tauxCo2;

http
  .get(url, (resp) => {
    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      tauxCo2 = JSON.parse(data)['co2Room'];
      console.log('Le taux de Co2 de la master : ', tauxCo2);
    });
  })
  .on('error', (err) => {
    console.log('Error: ' + err.message);
  });
