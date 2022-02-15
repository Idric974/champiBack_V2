const Sequelize = require('sequelize');
const db = require('../models');
const gestionHumDataModels = db.gestionHumData;
const gestionHumModels = db.gestionHum;

//* ➖ ➖ ➖ ➖ ➖ ➖ GET Taux Humidité ➖ ➖ ➖ ➖ ➖ ➖ //

exports.getTauxHumidite = (req, res) => {
  // console.log('Resquete Gestion humidité OK');

  gestionHumModels
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);

      gestionHumModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((gestionTauxHum) => {
          res.status(200).json({ gestionTauxHum });
        });
    });
};

//* ➖ ➖ ➖ ➖ ➖ ➖ Gestion Consigne Humidité ➖ ➖ ➖ ➖ ➖ ➖ //
exports.getConsigneHumidite = (req, res, next) => {
  // console.log('requete consignePasObjectifHum ok');

  gestionHumDataModels
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);

      gestionHumDataModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((dataGestionHum) => {
          res.status(200).json({ dataGestionHum });
        });
    });
};

//* ⭐➖➖➖➖➖➖➖➖➖➖➖➖⭐ POST data Humidité ⭐➖➖➖➖➖➖➖➖➖➖➖➖⭐

exports.postDataHum = (req, res, next) => {
  let data = req.body;

  // console.log('Les datas Humidité ', data);

  const newData = gestionHumDataModels
    .create({
      consigneHum: req.body.consigneHum,
      pasHum: req.body.pasHum,
      objectifHum: req.body.objectifHum,
    })
    .then(() =>
      res.status(200).json({
        message: 'Data humidité enregitres dans la base gestion_hums_datas',
      })
    )
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ error });
    });
};
