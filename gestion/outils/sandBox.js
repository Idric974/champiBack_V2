//! Les constantes.

require('dotenv').config();
const cyan = '\x1b[36m';
const https = require('https');
const { resolve } = require('path');
const sequelize = require('sequelize');
const db = require('../../models');
const gestionCo2Models = db.gestionCo2;
const gestionCo2DataModels = db.gestionCo2Data;
//* -----------------------------------------------------------

//* Les variables.

let tauxCO2 = 1500;
let consigne;
let deltaCo2;
let daysCo2;
let heuresCo2;
//* ----------------------------------

const getTauxCo2 = new Promise((resolve, reject) => {
  https
    .get('https://api.nasa.gov/planetary/apod?ap_key=DEMO_KEY', (resp) => {
      let data = '';

      // Un morceau de réponse est reçu
      resp.on('data', (chunk) => {
        data += chunk;

        console.log('response.status : ' + chunk);

        // if (typeof err === 'error') {
        //   console.log('data = errorrrrrrrrrr : ' + data);
        // } else {
        //   console.log('data PAS VIDE : ' + data);
        // }
      });
    })

    .on('response', function (resp) {
      if (resp.statusCode === 200) {
        console.log('OK OK');
        resolve();
      } else {
        reject();
        console.log('PAS OK');
      }
    })
    .on('error', (err) => {
      console.log('Error: ' + err.message);
    });
});

let actiongetTauxCo2 = async () => {
  let go = await getTauxCo2;
  return go;
};

actiongetTauxCo2()
  .then(() => {
    console.log('execution du then');
  })
  .catch(() => {
    console.log('ereurrrrrrrrrr');
  });
