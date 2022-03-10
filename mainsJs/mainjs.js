require('dotenv').config();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../../models');
const gestionHumModels = db.gestionHum;
const moment = require('moment');

let dateDeDebut = moment().subtract(10, 'days').format('YYYY-MM-DD');
console.log('Date de début : ', dateDeDebut);

let dateDeFin = moment().format('YYYY-MM-DD');
console.log('Date de fin : ', dateDeFin);

let info = [];

let selectData = () => {
  gestionHumModels
    .findAll({
      raw: true,
      where: {
        createdAt: {
          [Op.between]: [dateDeDebut, dateDeFin],
        },
      },
    })
    .then((result) => {
      const list = result;

      list.forEach((item) => {
        info.push(item['tauxHumidite']);
        console.log('info', info);
      });
    });
};

selectData();
