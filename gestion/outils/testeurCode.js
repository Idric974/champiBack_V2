require('dotenv').config();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../../models');
const gestionHumModels = db.gestionHum;
const moment = require('moment');

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
