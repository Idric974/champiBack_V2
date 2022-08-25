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
const gestionLogsModels = db.gestionLogsBack;
const logger = require('../../src/logger');
const axios = require('axios');

//! -------------------------------------------------- !

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
let etatVanneBDD;
let dateDuJour;
let dateDemarrageCycle;
let difference;
let jourDuCycle;
let heureDuCycle;
let minuteDuCycle;
let heureMinute;
let valeurAxeX;

//! -------------------------------------------------- !

//! Les tableaux.

listValAir = [];

//! -------------------------------------------------- !

//? I) LES FONCTIONS.

//! Mise à jour de l'état des relay.

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
          // console.log('Nb mise à jour data =======> ' + result);
        })

        .catch((err) => console.log(err));
    });
};

//! -------------------------------------------------- *

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
            // console.log(
            //   jaune,
            //   '[ GESTION AIR CALCULES  ] La consigne : ',
            //   consigne
            // );

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

//! -------------------------------------------------- !

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

//! -------------------------------------------------- !

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
            // console.log(
            //   jaune,
            //   '[ GESTION AIR CALCULES  ] Dernier état vanne de la BDD : ',
            //   etatVanneBDD
            // );
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

//! -------------------------------------------------- !

//! Construction de la valeur de l'axe x.

let getDateDemarrageCycle = () => {
  axios
    .get('http://localhost:3003/api/gestionCourbeRoutes/getDateDemarrageCycle')
    .then((response) => {
      //   console.log(
      //     'Date démarrage du cycle :---:',
      //     response.data.dateDemarrageCycle.dateDemarrageCycle
      //   );

      //* Date du jour.

      dateDuJour = new Date();
      // console.log('Date du Jour :---------------------:', dateDuJour);

      //* --------------------------------------------------

      //* Date de demarrage du cycle

      dateDemarrageCycle = new Date(
        response.data.dateDemarrageCycle.dateDemarrageCycle
      );
      // console.log('La date de démarrage du cycle :----:', dateDemarrageCycle);

      //* --------------------------------------------------

      //* Calcul du nombre de jour du cycle.

      let nbJourBrut = dateDuJour.getTime() - dateDemarrageCycle.getTime();
      jourDuCycle = Math.round(nbJourBrut / (1000 * 3600 * 24)) + 1;
      // console.log('Le jour du cycle  ', jourDuCycle, ' jours');

      //* --------------------------------------------------

      //* Affichage de l'heure.
      heureDuCycle = new Date().getHours();
      minuteDuCycle = new Date().getMinutes();
      heureMinute = heureDuCycle + 'h' + minuteDuCycle;
      // console.log("l'heure du cycle :-----------------:", heureMinute);
      //* --------------------------------------------------

      //* Valeure de l'axe x.
      valeurAxeX = 'Jour ' + jourDuCycle + ' - ' + heureMinute;
      // console.log(
      //   jaune,
      //   "[ GESTION AIR CALCULES  ] Valeure de l'axe x : ",
      //   valeurAxeX
      // );
      //* --------------------------------------------------
    })
    .catch((error) => {
      console.log(error);
    });
};
getDateDemarrageCycle();

//! -------------------------------------------------- !

//? II) CALCULE DE LA TEMPÉRATURE.

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

//! -------------------------------------------------- !

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

//! -------------------------------------------------- !

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

    //?

    delta = parseFloat((ValTemp - consigne).toFixed(1));

    // console.log(jaune, '[ GESTION AIR CALCULES  ] Le delta est de : ', delta);
  })
  //
  //! Définition des actions.
  .then(() => {
    try {
      if (delta > 1.5) {
        //
        //! Condition à 40 secondes.

        let preconisation = 40000;

        const relay_23_ON = new Gpio(23, 'out');

        // console.log('Ouverture du froid');

        if (etatVanneBDD >= 100) {
          etatRelay = 100;
        } else {
          etatRelay = 100;
        }

        actionRelay = 1;

        miseAjourEtatRelay();

        setTimeout(() => {
          //
          const relay_23_OFF = new Gpio(23, 'in');

          // console.log('FIN Ouverture du froid');

          actionRelay = 0;
          miseAjourEtatRelay();
          //
        }, preconisation);

        //! -----------------------------------------------
        //
      } else if (delta <= 1.5 && delta > 1) {
        //
        //! Condition à 15 secondes.

        let preconisation = 15000;

        const relay_23_ON = new Gpio(23, 'out');

        if (etatVanneBDD >= 100) {
          etatRelay = 100;
        } else {
          etatRelay = 37.5;
        }

        actionRelay = 1;
        miseAjourEtatRelay();

        setTimeout(() => {
          //
          const relay_23_OFF = new Gpio(23, 'in');

          actionRelay = 0;
          miseAjourEtatRelay();
          //
        }, preconisation);

        //! -----------------------------------------------
        //
      } else if (delta <= 1 && delta > 0.5) {
        //
        //! Condition à 5 secondes.

        let preconisation = 5000;

        const relay_23_ON = new Gpio(23, 'out');

        if (etatVanneBDD >= 100) {
          etatRelay = 100;
        } else {
          etatRelay = 12.5;
        }

        actionRelay = 1;
        miseAjourEtatRelay();

        setTimeout(() => {
          //
          const relay_23_OFF = new Gpio(23, 'in');

          actionRelay = 0;
          miseAjourEtatRelay();
          //
        }, preconisation);

        //! -----------------------------------------------
        //
      } else if (delta <= 0.5 && delta > 0.3) {
        //
        //! Condition à 2 secondes.

        let preconisation = 2000;

        const relay_23_ON = new Gpio(23, 'out');

        if (etatVanneBDD >= 100) {
          etatRelay = 100;
        } else {
          etatRelay = 5;
        }

        actionRelay = 1;
        miseAjourEtatRelay();

        setTimeout(() => {
          //
          const relay_23_OFF = new Gpio(23, 'in');
          // console.log('ouverture  du froid');
          actionRelay = 0;
          miseAjourEtatRelay();
          //
        }, preconisation);

        //! -----------------------------------------------
        //
      } else if (delta <= 0.3 && delta >= -0.3) {
        //***************************************************************
        //! Pas d'action car interval entre -0.3 et 0.3"
        etatRelay = etatVanneBDD;
        miseAjourEtatRelay();
        //***************************************************************
      } else if (delta >= -0.5 && delta < -0.3) {
        //
        //! Condition à 2 secondes.

        let preconisation = 2000;

        const relay_22_ON = new Gpio(22, 'out');

        if (etatVanneBDD <= 0) {
          etatRelay = 0;
        } else {
          etatRelay = preconisation;
        }

        etatRelay = 5;
        actionRelay = 1;
        miseAjourEtatRelay();

        setTimeout(() => {
          //
          const relay_22_OFF = new Gpio(22, 'in');

          actionRelay = 0;
          miseAjourEtatRelay();
          //
        }, preconisation);

        //! -----------------------------------------------
        //
      } else if (delta > -1 && delta < -0.5) {
        //
        //! Condition à 5 secondes.

        let preconisation = 5000;

        const relay_22_ON = new Gpio(22, 'out');

        if (etatVanneBDD <= 0) {
          etatRelay = 0;
        } else {
          etatRelay = preconisation;
        }

        etatRelay = 12.5;
        actionRelay = 1;
        miseAjourEtatRelay();

        setTimeout(() => {
          //
          const relay_22_OFF = new Gpio(22, 'in');

          actionRelay = 0;
          miseAjourEtatRelay();
          //
        }, preconisation);

        //! -----------------------------------------------
        //
      } else if (delta >= -1.5 && delta < -1) {
        //
        //! Condition à 15 secondes.

        let preconisation = 15000;

        const relay_22_ON = new Gpio(22, 'out');

        if (etatVanneBDD <= 0) {
          etatRelay = 0;
        } else {
          etatRelay = 37.5;
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

        //! -----------------------------------------------
        //
      } else if (delta < -1.5) {
        //
        //! Condition à 5 secondes.

        let preconisation = 40000;

        const relay_22_ON = new Gpio(22, 'out');

        if (etatVanneBDD <= 0) {
          etatRelay = 0;
        } else {
          etatRelay = 100;
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

        //! -----------------------------------------------
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
            consigne: consigne,
            valeurAxeX: valeurAxeX,
            jourDuCycle: jourDuCycle,
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
    //
    //! -------------------------------------------------- !
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
      //! -------------------------------------------------- !
    } catch (error) {
      logger.info(
        'Fchier source : gestionAir | Module : Mise à jour des informations dans la base de donnée | Type erreur : ',
        error
      );
    }
  });
