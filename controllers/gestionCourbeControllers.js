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

//? I) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES AIR ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//! Les variables.

let dateDuJourAir = moment().add(1, 'days').format('YYYY-MM-DD');
console.log('Date du jour du cycle ==============> ', dateDuJourAir);
console.log('Type Date du jour du cycle =========> ', typeof dateDuJourAir);

// let dateDemarrageCycleAir = '2022-03-01';
let dateDuJourAir2 = '2022-03-19';
let dateDemarrageCycleAir = '2022-01-01';
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

//? I) FIN ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES AIR ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//? II) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES HUMIDITE ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//! Les variables.

let dateDuJour = moment().add(1, 'days').format('YYYY-MM-DD');
console.log('Date du jour du cycle ==============> ', dateDuJour);
console.log('Type Date du jour du cycle =========> ', typeof dateDuJour);

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

exports.getconsigneHumiditeCourbe = (req, res) => {
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

//? II) FIN ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES HUMIDITE ➖➖➖➖➖➖➖➖➖➖➖➖➖➖
