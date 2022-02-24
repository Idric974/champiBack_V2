// Les constantes.

require('dotenv').config();
const mcpadc = require('mcp-spi-adc');
const Gpio = require('onoff').Gpio;
const jaune = '\x1b[33m';
const sequelize = require('sequelize');
const db = require('../../models');
const gestionAirModels = db.gestionAir;
const gestionAirsDataModels = db.gestionAirData;
const gestionAirEtalonnageModels = db.etalonnageAir;
const gestionLogsModels = db.gestionLogsBack;
const logger = require('../../src/logger');
//-------------------------------------

// Les variables.

let mcpBroche = 2; // Broche 2.
let temperatureCorrigée;
let ValTemp;
let etalonnage;
let lastId;
let consigne;
let pas;
let objectif;
let delta;
let days;
let heures;
//-------------------------------------

// Les tableaux.

let listValAir = [];
//-------------------------------------

let calculeTemperature = () => {
  let result = 1 + 3;

  // Fonction moyenne
  function ArrayAvg(listValAir) {
    let i = 0,
      summ = 0,
      ArrayLen = listValAir.length;
    while (i < ArrayLen) {
      summ = summ + listValAir[i++];
    }
    return summ / ArrayLen;
  }
  // FIN Fonction moyenne

  // Compteur.
  let temps = 0;

  let count = () => {
    temps = temps++;
    //console.log(temps++);
    if (temps++ === 9) {
      clearInterval(conteur);
    }

    // Ma fonction.
    const tempSensor = mcpadc.open(mcpBroche, { speedHz: 20000 }, (err) => {
      if (err) throw err;

      tempSensor.read((err, reading) => {
        if (err) throw err;
        listValAir.push(reading.value * 40);
        // console.log(jaune, '[ GESTION AIR CALCULES  ] listValAir', listValAir);
      });
    });
    // FIN Ma fonction.
  };

  setTimeout(() => {
    resolve(ArrayAvg(listValAir));
  }, 11000);

  let conteur = setInterval(count, 1000);

  //------------------------------------------------------------

  return result;
};

let gestionAirPromesse = () => {
  return new Promise((resolve, reject) => {
    //

    setTimeout(() => {
      resolve(calculeTemperature());
    }, 3000);
  });
};

gestionAirPromesse()
  .then((temperatureAir) => {
    console.log(temperatureAir);
  })

  .then(() => {
    console.log('Then 2');
  })

  .then(() => {
    console.log('Then 3');
  })
  .catch(function (error) {
    console.log('Catch de error : ' + error);
  });
