//! Les constantes.

require('dotenv').config();
const mcpadc = require('mcp-spi-adc');
const Gpio = require('onoff').Gpio;
const jaune = '\x1b[33m';
const sequelize = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../../models');
const gestionAirModels = db.gestionAir;
const gestionAirsDataModels = db.gestionAirData;
const gestionAirEtalonnageModels = db.etalonnageAir;
const gestionAirEtatRelayModels = db.gestionAirEtatRelay;
const gestionLogsModels = db.gestionLogsBack;

const logger = require('../../src/logger');
//-------------------------------------

//! Les variables.

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
let etatRelay;
let actionRelay;
let etatVanne;
let etatVanneBDD;

//-------------------------------------

//! Les tableaux.

listValAir = [];
//-------------------------------------

//! fonctions

let miseAjourEtatRelay = () => {
  gestionAirModels
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);
      lastId = id.maxid;

      gestionAirModels
        .update(
          { actionRelay: actionRelay, etatRelay: etatRelay },
          { where: { id: lastId } }
        )

        .then(function (result) {
          console.log('Nb mise à jour data =======> ' + result);
        })

        .catch((err) => console.log(err));
    });
};
//-------------------------------------

//! Récupération de la consigne

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

//! Récupération de l'étalonage

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
      'Fchier source : gestionAir | Module : recuperation Etalonnage | Type erreur : ',
      error
    );
  }
};
recuperationEtalonnage();

//------------------------------------------------------------

//! Récupération de l'état de la vanne froid.

let recuperationEtatRelay = () => {
  try {
    gestionAirModels
      .findOne({
        attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
        raw: true,
      })
      .then((id) => {
        // console.log(id.maxid);

        gestionAirModels
          .findOne({
            where: { id: id.maxid },
          })
          .then((result) => {
            // console.log(result);

            etatVanneBDD = result['etatRelay'];
            // console.log('etatVanneBDD ========> ', etatVanneBDD);
          });
      });
  } catch (error) {
    logger.info(
      'Fchier source : gestionAir | Module : recuperation etatVanneBDD | Type erreur : ',
      error
    );
  }
};
recuperationEtatRelay();

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
  //! Définition des actions.
  .then(() => {
    try {
      if (delta >= 1.1) {
        //
        let preconisation = 40000;
        console.log('preconisation : ' + preconisation);

        const relay_22_ON = new Gpio(22, 'out');
        const relay_23_ON = new Gpio(23, 'out');
        console.log('Ouverture du froid');

        if (etatVanneBDD >= 40000) {
          etatRelay = 40000;
        } else {
          etatRelay = preconisation;
        }

        actionRelay = 1;
        miseAjourEtatRelay();

        setTimeout(() => {
          //
          const relay_22_OFF = new Gpio(22, 'in');
          const relay_23_OFF = new Gpio(23, 'in');
          console.log('Fermeture du froid');

          actionRelay = 0;
          miseAjourEtatRelay();
          //
        }, preconisation);
        //
      } else if (delta <= 1 && delta >= 0.6) {
        //
        let preconisation = 15000;
        console.log('preconisation : ' + preconisation);

        const relay_22_ON = new Gpio(22, 'out');
        const relay_23_ON = new Gpio(23, 'out');

        if (etatVanneBDD >= 40000) {
          etatRelay = 40000;
        } else {
          etatRelay = preconisation;
        }

        actionRelay = 1;
        miseAjourEtatRelay();

        setTimeout(() => {
          //
          const relay_22_OFF = new Gpio(22, 'in');
          const relay_23_OFF = new Gpio(23, 'in');

          actionRelay = 0;
          miseAjourEtatRelay();
          //
        }, preconisation);

        //
      } else if (delta <= 0.5 && delta >= 0.4) {
        //
        let preconisation = 5000;
        console.log('preconisation : ' + preconisation);

        const relay_22_ON = new Gpio(22, 'out');
        const relay_23_ON = new Gpio(23, 'out');

        if (etatVanneBDD >= 40000) {
          etatRelay = 40000;
        } else {
          etatRelay = preconisation;
        }

        actionRelay = 1;
        miseAjourEtatRelay();

        setTimeout(() => {
          //
          const relay_22_OFF = new Gpio(22, 'in');
          const relay_23_OFF = new Gpio(23, 'in');

          actionRelay = 0;
          miseAjourEtatRelay();
          //
        }, preconisation);

        //
      } else if (delta <= 0.3 && delta >= -0.3) {
        //***************************************************************
        //! Pas d'action car interval entre -0.3 et 0.3"
        //***************************************************************
      } else if (delta <= -0.4 && delta >= -0.5) {
        //

        let preconisation = 5000;
        console.log('preconisation : ' + preconisation);

        const relay_22_OFF = new Gpio(22, 'out');

        if (etatVanneBDD <= 0) {
          etatRelay = 0;
        } else {
          etatRelay = preconisation;
        }

        etatRelay = preconisation;
        actionRelay = 1;
        miseAjourEtatRelay();

        setTimeout(() => {
          //
          const relay_22_OFF = new Gpio(22, 'in');

          actionRelay = 0;
          miseAjourEtatRelay();
          //
        }, preconisation);

        //
      } else if (delta <= -0.6 && delta >= -1) {
        //
        let preconisation = 15000;
        console.log('preconisation : ' + preconisation);

        const relay_22_OFF = new Gpio(22, 'out');

        if (etatVanneBDD <= 0) {
          etatRelay = 0;
        } else {
          etatRelay = preconisation;
        }

        actionRelay = 1;
        miseAjourEtatRelay();

        setTimeout(() => {
          //
          const relay_22_OFF = new Gpio(22, 'in');

          actionRelay = 0;
          miseAjourEtatRelay();
          //
        }, preconisation);

        //
      } else if (delta <= -1.1) {
        //

        let preconisation = 40000;
        console.log('preconisation : ' + preconisation);

        const relay_22_OFF = new Gpio(22, 'out');

        if (etatVanneBDD <= 0) {
          etatRelay = 0;
        } else {
          etatRelay = preconisation;
        }

        actionRelay = 1;
        miseAjourEtatRelay();

        setTimeout(() => {
          //
          const relay_22_OFF = new Gpio(22, 'in');

          actionRelay = 0;
          miseAjourEtatRelay();
          //
        }, preconisation);

        //
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
    //! Enregistrement des datas dans la base.
    try {
      //

      const enregistrementTemperature = () => {
        gestionAirModels
          .create({
            temperatureAir: temperatureCorrigée,
            deltaAir: delta,
            actionRelay: actionRelay,
            etatRelay: etatRelay,
          })

          // .then(function (result) {
          //   console.log(
          //     'Enregistrement des datas dans la base =======> ' + result
          //   );
          // })

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
      };
      enregistrementTemperature();

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
      //! Mise à jour du delta.

      let newDelta = () => {
        gestionAirModels
          .update(
            {
              deltaAir: delta,
              days: days,
              heures: heures,
            },
            { where: { id: lastId } }
          )
          // .then((result) =>
          //   console.log(
          //     jaune,
          //     '[ GESTION AIR CALCULES  ] Le delta à été mis à jour'
          //   )
          // )

          // .then(function (result) {
          //   console.log('Mise à jour du delta =======> ' + result);
          // })

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
