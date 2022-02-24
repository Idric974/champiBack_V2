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

listValAir = [];
//-------------------------------------

// Récupération de la consigne

let recuperationConsigneAir = () => {
  try {
    gestionAirsDataModels
      .findOne({
        attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
        raw: true,
      })
      .then((id) => {
        // console.log(id.maxid);

        gestionAirsDataModels
          .findOne({
            where: { id: id.maxid },
          })
          .then((result) => {
            // console.log(result);

            lastId = result['id'];
            // console.log('LastId :   ', lastId);

            consigne = result['consigneAir'];
            // console.log('Consigne : ', consigne);

            pas = result['pasAir'];
            // console.log('Pas :      ', pas);

            objectif = result['objectifAir'];
            // console.log('Objectif : ', objectif);
          });
      });
  } catch (error) {
    logger.info(
      'Fchier source : gestionAir | Module : recuperationConsigneAir | Type erreur : ',
      error,
      TypeError
    );

    let errorType = error.name + ': ' + error.message;

    const newLog = gestionLogsModels.create({
      fichier: 'gestionAir',
      nomModule: 'recuperationConsigneAir',
      typeErreur: errorType,
    });
  }
};

recuperationConsigneAir();

//------------------------------------------------------------

// Récupération de l'étalonage

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
            // console.log('========> Valeur etalonage Air : ', etalonnage);
          });
      });
  } catch (error) {
    logger.info(
      'Fchier source : gestionAir | Module : recuperationEtalonnage | Type erreur : ',
      error
    );
  }
};
recuperationEtalonnage();

//------------------------------------------------------------

// Calcule de la temprature.

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

//------------------------------------------------------------

let calculeTemperatureMoyenne = () => {
  return new Promise((resolve) => {
    // Compteur.
    let temps = 0;

    let count = () => {
      temps = temps++;
      //console.log(temps++);
      if (temps++ === 9) {
        clearInterval(conteur);
      }

      // console.log(jaune, '[ GESTION AIR CALCULES  ] temps', temps);
      // FIN Compteur.

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
  });
};

//------------------------------------------------------------
let resultats = async () => {
  let temperatureMoyenneAir = await calculeTemperatureMoyenne();

  return temperatureMoyenneAir;
};

resultats()
  .then((temperatureMoyenneAir) => {
    // Calcule de la température.

    // console.log(
    //   jaune,
    //   "[ GESTION AIR CALCULES  ] Temperature Moyenne de l'air : ",
    //   parseFloat(temperatureMoyenneAir).toFixed(1)
    // );
    temperatureCorrigée =
      parseFloat(temperatureMoyenneAir.toFixed(1)) + etalonnage;
    ValTemp = temperatureCorrigée;
    // console.log(
    //   jaune,
    //   "[ GESTION AIR CALCULES  ] Temperature Moyenne de l'air corrigée affichée : ",
    //   ValTemp
    // );

    // Affichage de la consigne.
    // console.log(
    //   jaune,
    //   '[ GESTION AIR CALCULES  ] La consigne est de',
    //   consigne
    // );

    // Calcule du delta.

    delta = parseFloat((ValTemp - consigne).toFixed(1));

    // console.log(jaune, '[ GESTION AIR CALCULES  ] Le delta est de : ', delta);
  })
  //
  // Définition des actions.
  .then(() => {
    try {
      if (delta >= 1.1) {
        const realy22On = new Gpio(22, 'out');
        const realy23On = new Gpio(23, 'out');

        // console.log(
        //   jaune,
        //   '[ GESTION AIR CALCULES  ] Ouverture du froid pour 40 secondes'
        // );

        setTimeout(() => {
          const realy22Off = new Gpio(22, 'in');
          const realy23Off = new Gpio(23, 'in');
          // console.log(
          //   jaune,
          //   '[ GESTION AIR CALCULES  ] Fin action ouverture  40 secondes'
          // );
        }, 40000);

        //
      } else if (delta <= 1 && delta >= 0.6) {
        const realy22On = new Gpio(22, 'out');
        const realy23On = new Gpio(23, 'out');

        // console.log(
        //   jaune,
        //   '[ GESTION AIR CALCULES  ] Ouverture du froid pour 15 secondes'
        // );

        setTimeout(() => {
          const realy22Off = new Gpio(22, 'in');
          const realy23Off = new Gpio(23, 'in');

          // console.log(
          //   jaune,
          //   '[ GESTION AIR CALCULES  ] Fin action ouverture 15 secondes'
          // );
        }, 15000);
        //
      } else if (delta <= 0.5 && delta >= 0.4) {
        const realy22On = new Gpio(22, 'out');
        const realy23On = new Gpio(23, 'out');

        // console.log(
        //   jaune,
        //   '[ GESTION AIR CALCULES  ] Ouverture du froid pour 5 secondes'
        // );

        setTimeout(() => {
          const realy22Off = new Gpio(22, 'in');
          const realy23Off = new Gpio(23, 'in');
          // console.log(
          //   jaune,
          //   '[ GESTION AIR CALCULES  ] Fin action ouverture 5 secondes'
          // );
        }, 5000);
        //
      } else if (delta <= 0.3 && delta >= -0.3) {
        // console.log(
        //   jaune,
        //   "[ GESTION AIR CALCULES  ] Pas d'action car interval entre -0.3 et 0.3"
        // );
        //
      } else if (delta <= -0.4 && delta >= -0.5) {
        const realy22On = new Gpio(22, 'out');
        // console.log(
        //   jaune,
        //   '[ GESTION AIR CALCULES  ] Fermeture du froid pour 5 secondes'
        // );

        setTimeout(() => {
          const realy22Off = new Gpio(22, 'in');

          // console.log(
          //   jaune,
          //   '[ GESTION AIR CALCULES  ] Fin action ouverture Fermeture  5 secondes'
          // );
        }, 5000);

        //
      } else if (delta <= -0.6 && delta >= -1) {
        const realy22On = new Gpio(22, 'out');

        // console.log(
        //   jaune,
        //   '[ GESTION AIR CALCULES  ] Fermeture du froid pour 15 secondes'
        // );

        setTimeout(() => {
          const realy22Off = new Gpio(22, 'in');
          // console.log(
          //   jaune,
          //   '[ GESTION AIR CALCULES  ] Fin action ouverture Fermeture 15 secondes'
          // );
        }, 15000);
        //
      } else if (delta <= -1.1) {
        const realy22On = new Gpio(22, 'out');

        // console.log(
        //   jaune,
        //   '[ GESTION AIR CALCULES  ] Fermeture du froid pour 40 secondes'
        // );

        setTimeout(() => {
          const realy22Off = new Gpio(22, 'in');

          // console.log(
          //   jaune,
          //   '[ GESTION AIR CALCULES  ] Fin action ouverture Fermeture 40 secondes'
          // );
        }, 40000);
      }
    } catch (error) {
      logger.info(
        'Fchier source : gestionAir | Module : Définition des actions | Type erreur : ',
        error
      );
    }
  })
  //
  //
  .then(() => {
    // Enregistrement des datas dans la base
    try {
      //
      const newVal = gestionAirModels
        .create({
          temperatureAir: temperatureCorrigée,
          deltaAir: delta,
        })

        .then(() => {
          // console.log(
          //   jaune,
          //   '[ GESTION AIR CALCULES  ] Données transférées à la base de données.'
          // );
        })
        .catch((error) => {
          console.log(
            jaune,
            '[ GESTION AIR CALCULES  ] Erreur dans le processus d’enregistrement',
            error
          );
        });
      //
    } catch (error) {
      logger.info(
        'Fchier source : gestionAir | Module : Enregistrement dans la base de donnée | Type erreur : ',
        error
      );
    }
  })
  .then(() => {
    listValAir = [];
  })

  .then(() => {
    //
    try {
      // Mise à jour du delta.

      let newDelta = () => {
        gestionAirModels
          .update(
            { deltaAir: delta, days: days, heures: heures },
            { where: { id: lastId } }
          )
          // .then((result) =>
          //   console.log(
          //     jaune,
          //     '[ GESTION AIR CALCULES  ] Le delta à été mis à jour'
          //   )
          // )
          .catch((err) => console.log(err));
      };

      newDelta();
      //
    } catch (error) {
      logger.info(
        'Fchier source : gestionAir | Module : Mise à jour des informations dans la base de donnée | Type erreur : ',
        error
      );
    }
  });
