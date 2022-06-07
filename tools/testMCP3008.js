//! Les constantes.

const mcpadc = require('mcp-spi-adc');
const jaune = '\x1b[33m';

//! --------------------------------------------------

//! Les variables.

let mcpBroche = 1;
let nbTour = 0;

//! --------------------------------------------------

//! Les tableaux.

listValAir = [];

//! --------------------------------------------------

//! Fonction moyenne.

function ArrayAvg(listValAir) {
  let i = 0,
    summ = 0,
    ArrayLen = listValAir.length;
  while (i < ArrayLen) {
    summ = summ + listValAir[i++];
  }
  return summ / ArrayLen;
}

//! -------------------------------------------------- !

//! Fonction de test.

let testMCP3008 = () => {
  return new Promise((resolve) => {
    // Compteur.
    let temps = 0;

    let count = () => {
      temps = temps++;

      if (temps++ === nbTour) {
        clearInterval(conteur);
      }

      const tempSensor = mcpadc.open(mcpBroche, { speedHz: 20000 }, (err) => {
        if (err) throw err;

        tempSensor.read((err, reading) => {
          if (err) throw err;
          listValAir.push(reading.value * 40);
          console.log(
            jaune,
            '[ GESTION AIR CALCULES  ] listValAir',
            listValAir
          );
        });
      });
    };

    setTimeout(() => {
      resolve(ArrayAvg(listValAir));
    }, 11000);

    let conteur = setInterval(count, 1000);
  });
};

testMCP3008();

//! -------------------------------------------------- !
