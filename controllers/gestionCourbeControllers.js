//! Les Dépendances.
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../models');
require('dotenv').config();
//! ---------------------------------------------

//! Gestion Air.
const gestionAirModels = db.gestionAir;
const gestionAirsDataModels = db.gestionAirData;
//! ---------------------------------------------

//! Gestion Humidité.
const gestionHumModels = db.gestionHum;
const gestionHumDataModels = db.gestionHumData;
//! ---------------------------------------------

//! Gestion Co2.
const gestionCo2Models = db.gestionCo2;
const gestionCo2DataModels = db.gestionCo2Data;
//! ---------------------------------------------

const gestionCourbesModels = db.gestionCourbes;
//! ---------------------------------------------

//! Le variables
let dateDuJour = new Date();
let dateDemarrageCycle;
// let dateDemarrageCycle2 = '2022-03-20';
//! --------------------------------------------------

//! Les fonctions.

recuperationDateDemarrageCycle = () => {
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
        .then((result) => {
          dateDemarrageCycle = result['dateDemarrageCycle'];

          // console.log('Date de début du Cycle : ' + dateDemarrageCycle);
          // console.log('Date de début du Cycle : ' + typeof dateDemarrageCycle);
        });
    });
};

//!--------------------------------------------------------------

//? I) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION DATE DE DÉMARRAGE CYCLE ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//! POST Date de démarrage du Cycle.

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
          // console.log(
          //   'Date de démarrage du cycle =========> ' +
          //     JSON.stringify(dateDemarrageCycle.dateDemarrageCycle)
          // );

          res.status(200).json({ dateDemarrageCycle });
        });
    });
};

//!--------------------------------------------------------------

//! GET Jour du Cycle.

exports.getJourDuCycle = (req, res) => {
  //
  gestionAirModels
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);

      gestionAirModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((jourDuCycle) => {
          // console.log('Date de démarrage du cycle =======> : ', jourDuCycle);

          res.status(200).json({ jourDuCycle });
        });
    });
};

//!--------------------------------------------------------------

//? II) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES AIR ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//*! GET température air courbe.

exports.getTemperatureAirCourbe = (req, res) => {
  //
  recuperationDateDemarrageCycle();

  setTimeout(() => {
    // console.log('Date de début du Cycle : ' + dateDemarrageCycle);

    gestionAirModels
      .findAll({
        raw: true,
        where: {
          createdAt: {
            [Op.between]: [dateDemarrageCycle, dateDuJour],
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
  recuperationDateDemarrageCycle();

  setTimeout(() => {
    // console.log('Date de début du Cycle : ' + dateDemarrageCycle);

    gestionAirsDataModels
      .findAll({
        raw: true,
        where: {
          createdAt: {
            [Op.between]: [dateDemarrageCycle, dateDuJour],
          },
        },
      })
      .then((consigneAirCourbe) => {
        res.status(200).json({ consigneAirCourbe });
      });
  }, 500);
};
//!--------------------------------------------------------------

//? III) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES HUMIDITE ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//*! GET taux humidité courbe.

exports.getTauxHumiditeCourbe = (req, res) => {
  //
  recuperationDateDemarrageCycle();
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

//? IV) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES CO2 ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//*! GET taux Co2 courbe.

exports.getTauxCo2Courbe = (req, res) => {
  //
  recuperationDateDemarrageCycle();
  setTimeout(() => {
    // console.log('Date de début du Cycle : ' + dateDemarrageCycle);

    gestionCo2Models
      .findAll({
        raw: true,
        where: {
          createdAt: {
            [Op.between]: [dateDemarrageCycle, dateDuJour],
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
  //
  recuperationDateDemarrageCycle();
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
