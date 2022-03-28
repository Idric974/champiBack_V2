//! Les constantes.

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../models');
const moment = require('moment');
require('dotenv').config();

// Gestion Air.
const gestionAirModels = db.gestionAir;
const gestionAirsDataModels = db.gestionAirData;
// ---------------------------------------------

// Gestion Humidité.

const gestionHumModels = db.gestionHum;
const gestionHumDataModels = db.gestionHumData;
// ---------------------------------------------

// Gestion Co2.

const gestionCo2Models = db.gestionCo2;
const gestionCo2DataModels = db.gestionCo2Data;
// ---------------------------------------------

const gestionCourbesModels = db.gestionCourbes;
// ---------------------------------------------

//!--------------------------------------------------------------

//! Les fonctions.

recuperationDateDebutCycleAir = () => {
  gestionAirDateDebutCycleCourbesModels
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);

      gestionAirDateDebutCycleCourbesModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((result) => {
          dateDemarrageCycleAir = result['dateDemarrageCycleAir'];

          // console.log('Date de début du Cycle : ' + dateDemarrageCycle);
          // console.log('Date de début du Cycle : ' + typeof dateDemarrageCycle);
        });
    });
};
//!--------------------------------------------------------------

//? I) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION DATE DE DEMARRAGE CYCLE ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//! GET Date de démarrage du Cycle.

exports.getDateDemarrageCycle = (req, res) => {
  //
  gestionCourbesModels
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);

      gestionCourbesModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((dateDemarrageCycle) => {
          console.log(
            'Date de démarrage du cycle =========> ' +
              JSON.stringify(dateDemarrageCycle.dateDemarrageCycle)
          );
          console.log(
            'Type Date de démarrage du cycle ====> ' +
              typeof JSON.stringify(dateDemarrageCycle.dateDemarrageCycle)
          );

          res.status(200).json({ dateDemarrageCycle });
        });
    });
};

//!--------------------------------------------------------------

//!POST Date de dmarrage du Cycle.

exports.dateDemarrageCycle = (req, res) => {
  //
  gestionCourbesModels
    .create({
      dateDemarrageCycle: req.body.dateDemarrageCycle,
    })
    .then(() =>
      res.status(200).json({
        message: 'La date de démarrage du cycle à été enregistrée',
      })
    )
    .catch((error) => {
      console.log(error);

      return res.status(400).json({ error });
    });
};

//!--------------------------------------------------------------

//? I) FIN ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION DATE DE DEMARRAGE CYCLE ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//? II) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES AIR ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//! Les variables.

let dateDuJourAir = moment().add(1, 'days').format('YYYY-MM-DD');
// console.log('Date du jour du cycle ==============> ', dateDuJourAir);
// console.log('Type Date du jour du cycle =========> ', typeof dateDuJourAir);

// let dateDemarrageCycleAir = '2022-03-01';
let dateDuJourAir2 = '2022-03-19';
let dateDemarrageCycleAir = '2022-01-01';
//!--------------------------------------------------------------

//*! GET température air courbe.

exports.getTemperatureAirCourbe = (req, res) => {
  //
  // recuperationDateDebutCycleAir();

  setTimeout(() => {
    // console.log('Date de début du Cycle : ' + dateDemarrageCycle);

    gestionAirModels
      .findAll({
        raw: true,
        where: {
          createdAt: {
            [Op.between]: [dateDemarrageCycleAir, dateDuJourAir],
          },
        },
      })
      .then((temperatureAirCourbe) => {
        res.status(200).json({ temperatureAirCourbe });
      });
  }, 500);
};
//!--------------------------------------------------------------

//*! GET consigne air courbe.

exports.getConsigneAirCourbe = (req, res) => {
  //
  // recuperationDateDebutCycleAir();

  setTimeout(() => {
    // console.log('Date de début du Cycle : ' + dateDemarrageCycle);

    gestionAirsDataModels
      .findAll({
        raw: true,
        where: {
          createdAt: {
            [Op.between]: [dateDemarrageCycleAir, dateDuJourAir],
          },
        },
      })
      .then((consigneAirCourbe) => {
        res.status(200).json({ consigneAirCourbe });
      });
  }, 500);
};
//!--------------------------------------------------------------

//? II) FIN ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES AIR ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//? III) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES HUMIDITE ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//! Les variables.

let dateDuJour = moment().add(1, 'days').format('YYYY-MM-DD');
// console.log('Date du jour du cycle ==============> ', dateDuJour);
// console.log('Type Date du jour du cycle =========> ', typeof dateDuJour);

// let dateDemarrageCycle = '2022-03-01';
let dateDuJour2 = '2022-03-19';
let dateDemarrageCycle = '2022-01-01';
//!--------------------------------------------------------------

//*! GET taux humidité courbe.

exports.getTauxHumiditeCourbe = (req, res) => {
  //
  // recuperationDateDebutCycle();
  setTimeout(() => {
    // console.log('Date de début du Cycle : ' + dateDemarrageCycle);

    gestionHumModels
      .findAll({
        raw: true,
        where: {
          createdAt: {
            [Op.between]: [dateDemarrageCycle, dateDuJour],
          },
        },
      })
      .then((tauxHumiditeCourbe) => {
        res.status(200).json({ tauxHumiditeCourbe });
      });
  }, 500);
};
//!--------------------------------------------------------------

//*! GET Consigne humidité courbe.

exports.getConsigneHumiditeCourbe = (req, res) => {
  setTimeout(() => {
    // console.log('Date de début du Cycle : ' + dateDemarrageCycle);

    gestionHumDataModels
      .findAll({
        raw: true,
        where: {
          createdAt: {
            [Op.between]: [dateDemarrageCycle, dateDuJour],
          },
        },
      })
      .then((consigneHumiditeCourbe) => {
        res.status(200).json({ consigneHumiditeCourbe });
      });
  }, 500);
};
//!--------------------------------------------------------------

//? III) FIN ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES HUMIDITE ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//? IV) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES CO2 ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//! Les variables.

let dateDuJourCo2 = moment().add(1, 'days').format('YYYY-MM-DD');
// console.log('Date du jour du cycle ==============> ', dateDuJour);
// console.log('Type Date du jour du cycle =========> ', typeof dateDuJour);

// let dateDemarrageCycle = '2022-03-01';
let dateDuJourCO22 = '2022-03-19';
let dateDemarrageCycleCo2 = '2022-01-01';
//!--------------------------------------------------------------

//*! GET taux Co2 courbe.

exports.getTauxCo2Courbe = (req, res) => {
  //
  // recuperationDateDebutCycle();
  setTimeout(() => {
    // console.log('Date de début du Cycle : ' + dateDemarrageCycle);

    gestionCo2Models
      .findAll({
        raw: true,
        where: {
          createdAt: {
            [Op.between]: [dateDemarrageCycleCo2, dateDuJourCO22],
          },
        },
      })
      .then((tauxCo2Courbe) => {
        res.status(200).json({ tauxCo2Courbe });
      });
  }, 500);
};
//!--------------------------------------------------------------

//*! GET Consigne Co2 courbe.

exports.getConsigneCo2Courbe = (req, res) => {
  setTimeout(() => {
    // console.log('Date de début du Cycle : ' + dateDemarrageCycle);

    gestionCo2DataModels
      .findAll({
        raw: true,
        where: {
          createdAt: {
            [Op.between]: [dateDemarrageCycle, dateDuJour],
          },
        },
      })
      .then((consigneCo2Courbe) => {
        res.status(200).json({ consigneCo2Courbe });
      });
  }, 500);
};
//!--------------------------------------------------------------

//? III) FIN ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES HUMIDITE ➖➖➖➖➖➖➖➖➖➖➖➖➖➖
