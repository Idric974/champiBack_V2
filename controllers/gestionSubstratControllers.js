const Sequelize = require('sequelize');
const db = require('../models');
const gestionSubstratModels = db.gestionSubstrat;
const gestionSubstratDataModels = db.gestionSubstratData;


//* ➖ ➖ ➖ ➖ ➖ ➖ GET Température Substrat➖ ➖ ➖ ➖ ➖ ➖ //

exports.getTemperatureSubstrat = (req, res) => {

  gestionSubstratModels
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);

      gestionSubstratModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((temperatureSubsrat) => {
          res.status(200).json({ temperatureSubsrat });
        });
    });
};

//* ➖ ➖ ➖ ➖ ➖ ➖ GET data Substrat➖ ➖ ➖ ➖ ➖ ➖ //

exports.getDataSubstrat = (req, res) => {

  gestionSubstratDataModels
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);

      gestionSubstratDataModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((dataSubstrat) => {
          res.status(200).json({ dataSubstrat });
        });
    });
};

//* ➖ ➖ ➖ ➖ ➖ ➖ POST Data Substrat ➖ ➖ ➖ ➖ ➖ ➖ //

exports.postConsigneSubstrat = (req, res) => {
  let consigneMaxDataSubstrat = req.body.consigneMaxDataSubstrat;
  console.log('Consigne Max Data Substrat: ' + consigneMaxDataSubstrat);

  let consigneMinDataSubstrat = req.body.consigneMinDataSubstrat;
  console.log('Consigne Min Data Substrat : ' + consigneMinDataSubstrat);

  const newData = gestionSubstratDataModels
    .create({
      consigneMaxDataSubstrat,
      consigneMinDataSubstrat
    })
    .then(() =>
      res.status(200).json({
        message: 'Consigne substrat enregitres dans la base gestion_airs',
      })
    )
    .catch((error) => {
      console.log(error);

      return res.status(400).json({ error });
    });
};
