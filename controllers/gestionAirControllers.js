const Sequelize = require('sequelize');
const db = require('../models');
const gestionAirsDataModels = db.gestionAirData;
const gestionAirModels = db.gestionAir;

//* ➖ ➖ ➖ ➖ ➖ ➖ GET Température ➖ ➖ ➖ ➖ ➖ ➖ //
exports.getTemperatureAir = (req, res) => {
  let gestionAirTempId;
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
        .then((temperatureAir) => {
          res.status(200).json({ temperatureAir });
        });
    });
};

//* ➖ ➖ ➖ ➖ ➖ ➖ GET Data ➖ ➖ ➖ ➖ ➖ ➖ //

exports.getDataAir = (req, res) => {
  let gestionAirId;
  gestionAirsDataModels
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);

      gestionAirsDataModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((datatemperatureAir) => {
          res.status(200).json({ datatemperatureAir });
        });
    });
};

//* ➖ ➖ ➖ ➖ ➖ ➖ POST Data  Air ➖ ➖ ➖ ➖ ➖ ➖ //

exports.postDataAir = (req, res) => {
  let data = req.body;

  // console.log('Les datas Air ', data);

  const newData = gestionAirsDataModels
    .create({
      consigneAir: req.body.consigneAir,
      pasAir: req.body.pasAir,
      objectifAir: req.body.objectifAir,
    })
    .then(() =>
      res.status(200).json({
        message: 'Data Air enregitres dans la base gestion_airs_datas',
      })
    )
    .catch((error) => {
      console.log(error);

      return res.status(400).json({ error });
    });
};
