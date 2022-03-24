//! Les constantes.

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../models');
const gestionAirsDataModels = db.gestionAirData;
const gestionHumDataModels = db.gestionHumData;
const gestionHumModels = db.gestionHum;
const gestionCourbesModels = db.gestionCourbes;
const moment = require('moment');
require('dotenv').config();
//!--------------------------------------------------------------

//! Les variables.

let dateDuJour = moment().add(1, 'days').format('YYYY-MM-DD');
console.log('Date du jour du cycle ==============> ', dateDuJour);
console.log('Type Date du jour du cycle =========> ', typeof dateDuJour);

// let dateDemarrageCycle = '2022-03-01';
let dateDuJour2 = '2022-03-19';
let dateDemarrageCycle = '2022-03-14';
//!--------------------------------------------------------------

//! Les fonctions.

// recuperationDateDebutCycle = () => {
//   gestionCourbesModels
//     .findOne({
//       attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
//       raw: true,
//     })
//     .then((id) => {
//       // console.log('Le dernier id de gestionAir est : ', id);
//       // console.log(id.maxid);

//       gestionCourbesModels
//         .findOne({
//           where: { id: id.maxid },
//         })
//         .then((result) => {
//           dateDemarrageCycle = result['dateDemarrageCycle'];

//           // console.log('Date de début du Cycle : ' + dateDemarrageCycle);
//           // console.log('Date de début du Cycle : ' + typeof dateDemarrageCycle);
//         });
//     });
// };
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
  // console.log('Responce back');
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
