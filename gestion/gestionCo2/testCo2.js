const http = require('http');
const numSalle = require('../../configNumSalle');

let tauxCO2;

let url = 'http://192.168.0.10:5000/api/getCo2Routes/getCo2/' + numSalle;
//let url = 'http://localhost:5000/api/getCo2Routes/getCo2/' + numSalle;
// console.log('url :', url);

function co2() {
  new Promise((resolve, reject) => {
    http
      .get(url, (resp) => {
        data = '';

        resp.on('data', (chunk) => {
          data += chunk;
          console.log('Valeur CO2 de la master', data);

          // Taux de Co2.
          tauxCO2 = parseFloat(data).toFixed(2);
          // console.log(tauxCO2);
        });
      })

      .on('error', (err) => {
        console.log(err);

        reject();
      });
  }).catch((err) => {
    console.log(err);
  });
}

co2();
