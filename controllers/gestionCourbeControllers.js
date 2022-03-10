const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../models');
const gestionAirsDataModels = db.gestionAirData;
const gestionAirModels = db.gestionAir;
const gestionHumModels = db.gestionHum;
const moment = require('moment');
require('dotenv').config();

let dateDeDebut = moment().subtract(13, 'days').format('YYYY-MM-DD');
// console.log('Date de début : ', dateDeDebut);

let dateDeFin = moment().format('YYYY-MM-DD');
// console.log('Date de fin : ', dateDeFin);

//* ➖ ➖ ➖ ➖ ➖ ➖ GET data courbe ➖ ➖ ➖ ➖ ➖ ➖ //
exports.getDataCourbe = (req, res) => {
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
    .then((dataHumidite) => {
      res.status(200).json({ dataHumidite });
    });
};
