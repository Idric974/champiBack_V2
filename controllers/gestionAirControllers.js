const Sequelize = require('sequelize');
const db = require('../models');
const gestionAirsDataModels = db.gestionAirData;
const gestionAirModels = db.gestionAir;
const gestionAirVannesModels = db.gestionAirVannes;

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

//* ➖ ➖ ➖ ➖ ➖ ➖ POST Consigne Air ➖ ➖ ➖ ➖ ➖ ➖ //

exports.postConsigneAir = (req, res) => {
  let data = req.body;

  // console.log('Les datas Air ', data);

  const newData = gestionAirsDataModels
    .create({
      consigneAir: req.body.consigneAir,
    })
    .then(() =>
      res.status(200).json({
        message: 'Consigne Air enregitres dans la base gestion_airs',
      })
    )
    .catch((error) => {
      console.log(error);

      return res.status(400).json({ error });
    });
};

//* ➖ ➖ ➖ ➖ ➖ ➖ POST Data Air ➖ ➖ ➖ ➖ ➖ ➖ //

exports.postDataAir = (req, res) => {
  let pasAir = req.body.pasAir;
  console.log('Le pas Air : ' + pasAir);

  let objectifAir = req.body.objectifAir;
  console.log('L objectif Air : ' + objectifAir);

  let lastId;

  gestionAirsDataModels
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);
      lastId = id.maxid;

      gestionAirsDataModels
        .update(
          { pasAir: pasAir, objectifAir: objectifAir },
          { where: { id: lastId } }
        )

        .then(() =>
          res.status(200).json({
            message: 'Data Air enregitrées dans la base gestion_airs_data',
          })
        )

        .catch((err) => console.log(err));
    });
};

//* ➖ ➖ ➖ ➖ ➖ ➖ POST Vanne active ➖ ➖ ➖ ➖ ➖ ➖ //

exports.postVanneActive = (req, res) => {
  let vanneActive = req.body.vanneActive;
  console.log('Vanne active : ' + vanneActive);

  let lastId;

  gestionAirVannesModels
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      //console.log('Le dernier id de gestionAir est : ', id);
     // console.log(id.maxid);
      lastId = id.maxid;

      gestionAirVannesModels
        .update(
          { vanneActive: vanneActive },
          { where: { id: lastId } }
        )

        .then(() =>
          res.status(200).json({
            message: 'Data Air enregitrées dans la base gestion_airs_data',
          })
        )

        .catch((err) => console.log(err));
    });
};