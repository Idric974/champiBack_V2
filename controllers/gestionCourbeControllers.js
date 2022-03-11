const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../models');
const gestionAirsDataModels = db.gestionAirData;
const gestionHumDataModels = db.gestionHumData;
const gestionHumModels = db.gestionHum;
const moment = require('moment');
require('dotenv').config();

let dateDeDebut = moment().subtract(40, 'days').format('YYYY-MM-DD');
// console.log('Date de début : ', dateDeDebut);

let dateDeFin = moment().format('YYYY-MM-DD');
// console.log('Date de fin : ', dateDeFin);

//* ➖ ➖ ➖ ➖ ➖ ➖ GET taux humidité courbe ➖ ➖ ➖ ➖ ➖ ➖ //
exports.getTauxHumiditeCourbe = (req, res) => {
  // console.log('Responce back');

  gestionHumModels
    .findAll({
      raw: true,
      where: {
        createdAt: {
          [Op.between]: [dateDeDebut, dateDeFin],
        },
      },
    })
    .then((tauxHumiditeCourbe) => {
      res.status(200).json({ tauxHumiditeCourbe });
    });
};

//* ➖ ➖ ➖ ➖ ➖ ➖ GET Consigne humidité courbe ➖ ➖ ➖ ➖ ➖ ➖ //
exports.getconsigneHumiditeCourbe = (req, res) => {
  // console.log('Responce back');

  gestionHumDataModels
    .findAll({
      raw: true,
      where: {
        createdAt: {
          [Op.between]: [dateDeDebut, dateDeFin],
        },
      },
    })
    .then((dataHumiditeCourbe) => {
      res.status(200).json({ dataHumiditeCourbe });
    });
};
