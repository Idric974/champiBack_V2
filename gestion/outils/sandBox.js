//! les constaantes.

const mcpadc = require('mcp-spi-adc');
const mcpBroche = 2;
const logger = require('../../src/logger');
const jaune = '\x1b[33m';
const sequelize = require('sequelize');
const db = require('../../models');

//! --------------------------------------------------

//! les variables.

let nombreDeBoucle = 0;
let temperatureEtalonnee;
let temperatureAirMoyenne;
let etalonnage;

//! --------------------------------------------------

//! Les tableaux.

let tableauTemperatureAir = [];

//! --------------------------------------------------

//! I) LES FONCTIONS.

//* Récupération de la valeur étalonnage.

const gestionAirEtalonnageModels = db.etalonnageAir;

let recuperationEtalonnage = () => {
  try {
    gestionAirEtalonnageModels
      .findOne({
        attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
        raw: true,
      })
      .then((id) => {
        // console.log(id.maxid);

        gestionAirEtalonnageModels
          .findOne({
            where: { id: id.maxid },
          })
          .then((result) => {
            // console.log(result);

            etalonnage = result['etalonnageAir'];

            console.log('Type etalonnage', typeof etalonnage);

            console.log(
              jaune,
              '[ GESTION AIR CALCULES  ] Valeur etalonage Air : ' +
                etalonnage +
                '°C'
            );
          });
      });
  } catch (error) {
    console.log('Erreur recuperation Etalonnage');

    logger.info(
      'Fchier source : gestionAir | Module : recuperation Etalonnage | Type erreur : ',
      error
    );
  }
};
recuperationEtalonnage();

//* --------------------------------------------------

//! --------------------------------------------------

//! II) CALCUL DE LA TEMPÉRATURE MOYENNE.

const calculTemperatureMoyenne = new Promise((resolve, reject) => {
  setInterval((stopInteval) => {
    if (nombreDeBoucle <= 3) {
      nombreDeBoucle++;

      //* Fonction qui mesure la température.

      const tempSensor = mcpadc.open(mcpBroche, { speedHz: 20000 }, (err) => {
        if (err) throw err;

        tempSensor.read((err, reading) => {
          if (err) throw err;
          let temperature = reading.value * 40;
          tableauTemperatureAir.push(temperature);

          console.log(
            jaune,
            '[ GESTION AIR CALCULES  ] Tableau des tempratures : ',
            tableauTemperatureAir
          );
        });
      });

      //* --------------------------------------------------
    } else {
      clearInterval(stopInteval);
      resolve();
      return;
    }
  }, 1000);
});

let actionGestionAir = async () => {
  let go = await calculTemperatureMoyenne;
  return go;
};

//! III) LES ACTIONS.

actionGestionAir()
  //
  //! Calcule de la température moyenne.

  .then(() => {
    const array = tableauTemperatureAir;
    let sum = 0;

    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }
    let temperatureBrut = sum / array.length;

    temperatureAirMoyenne = Math.round(temperatureBrut * 100) / 100;

    console.log(
      jaune,
      '[ GESTION AIR CALCULES  ] La température air moyenne brute est de : ' +
        temperatureAirMoyenne +
        '°C'
    );
  })

  //! --------------------------------------------------

  //! Calcule de la température étalonnée.

  .then(() => {
    temperatureEtalonnee = temperatureAirMoyenne + etalonnage;

    console.log(
      jaune,
      '[ GESTION AIR CALCULES  ] La température air moyenne corrigée est de ' +
        temperatureEtalonnee +
        '°C'
    );
  })

  //! --------------------------------------------------
  .catch((e) => {
    console.log(jaune, '[ GESTION AIR CALCULES  ] Erreur gestion Air : ', e);
  });
