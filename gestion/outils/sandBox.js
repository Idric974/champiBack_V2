//! Les constantes.

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../../models');
const gestionAirsDataModels = db.gestionAirData;
const gestionHumDataModels = db.gestionHumData;
const gestionHumModels = db.gestionHum;
const gestionCourbesModels = db.gestionCourbes;
const moment = require('moment');
require('dotenv').config();
//!--------------------------------------------------------------

//! Les variables.

let dateDuJour = moment().add(1, 'days').format('YYYY-MM-DD');

console.log('Date du jour du cycle ==============> ', dateDuJour);
console.log('Type Date du jour du cycle =========> ', typeof dateDuJour);
//!--------------------------------------------------------------

//! GET Date de dmarrage du Cycle.

let getDateDemarrageCycle = () => {
  //
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
        .then((dateDemarrageCycle) => {
          console.log(
            'Date de démarrage du cycle =========> ' +
              JSON.stringify(dateDemarrageCycle.dateDemarrageCycle)
          );
          console.log(
            'Type Date de démarrage du cycle ====> ' +
              typeof JSON.stringify(dateDemarrageCycle)
          );
        });
    });
};

getDateDemarrageCycle();
//!--------------------------------------------------------------
