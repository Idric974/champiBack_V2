const Sequelize = require('sequelize');
const db = require('../models');
const gestionCo2Models = db.gestionCo2;
const gestionCo2DataModels = db.gestionCo2Data;

//* ➖ ➖ ➖ ➖ ➖ ➖ GET Taux Co2 ➖ ➖ ➖ ➖ ➖ ➖ //
exports.getTauxC2o = (req, res) => {
  let gestionAirTempId;
  gestionCo2Models
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);

      gestionCo2Models
        .findOne({
          where: { id: id.maxid },
        })
        .then((tauxCo2) => {
          res.status(200).json({ tauxCo2 });
        });
    });
};

//* ➖ ➖ ➖ ➖ ➖ ➖ GET Data ➖ ➖ ➖ ➖ ➖ ➖ //

exports.getDataCo2 = (req, res) => {
  let gestionAirId;
  gestionCo2DataModels
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);

      gestionCo2DataModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((dataTauxCo2) => {
          res.status(200).json({ dataTauxCo2 });
        });
    });
};

//* ➖ ➖ ➖ ➖ ➖ ➖ POST Data ➖ ➖ ➖ ➖ ➖ ➖ //
exports.postDataCo2 = (req, res) => {
  let data = req.body;

  // console.log('Les datas de postDataCo2 ', data);

  const newData = gestionCo2DataModels
    .create({
      consigneCo2: req.body.consigneCo2,
      pasCo2: req.body.pasCo2,
      objectifCo2: req.body.objectifCo2,
    })
    .then(() =>
      res
        .status(200)
        .json({ message: 'Data enregitres dans la base data_gestion_co2s' })
    )
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ error });
    });
};
