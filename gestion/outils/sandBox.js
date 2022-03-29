//! Les Dépendances.
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../../models');

require('dotenv').config();
//! ---------------------------------------------

//! Gestion Air.
const gestionAirModels = db.gestionAir;
const gestionAirsDataModels = db.gestionAirData;
//! ---------------------------------------------

//! Gestion Humidité.
const gestionHumModels = db.gestionHum;
const gestionHumDataModels = db.gestionHumData;
//! ---------------------------------------------

//! Gestion Co2.
const gestionCo2Models = db.gestionCo2;
const gestionCo2DataModels = db.gestionCo2Data;
//! ---------------------------------------------

const gestionCourbesModels = db.gestionCourbes;
//! ---------------------------------------------

//! Le variables
let dateDuJour = new Date();

let dateDemarrageCycle;
let dateDemarrageCycle2 = '2022-03-21';
//! --------------------------------------------------

recuperationDateDemarrageCycle = () => {
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
        .then((result) => {
          dateDemarrageCycle = result['dateDemarrageCycle'];

          console.log('Date de début du Cycle : ' + dateDemarrageCycle);
          console.log('Date de début du Cycle : ' + typeof dateDemarrageCycle);
        })
        .then(() => {
          let getTemperatureAirCourbe = () => {
            //
            // recuperationDateDemarrageCycle();

            setTimeout(() => {
              // console.log('Date de début du Cycle : ' + dateDemarrageCycle);

              gestionAirModels
                .findAll({
                  raw: true,
                  where: {
                    createdAt: {
                      [Op.between]: [dateDemarrageCycle2, dateDuJour],
                    },
                  },
                })
                .then((temperatureAirCourbe) => {
                  console.log('temperatureAirCourbe : ', temperatureAirCourbe);
                });
            }, 500);
          };
          getTemperatureAirCourbe();
        });
    });
};

recuperationDateDemarrageCycle();

//!--------------------------------------------------------------
