const Gpio = require('onoff').Gpio;
const jaune = '\x1b[33m';
const sequelize = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../../models');


//! Les fonctions asynchrones.

//? Récupération de la consigne.

let consigne;
let pas;
let objectif;

const gestionHumDataModels = db.gestionHumData;

let recupérationDeLaConsigne = () => {
  return new Promise((resolve, reject) => {

    try {
      gestionHumDataModels
        .findOne({
          attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
          raw: true,
        })
        .then((id) => {
          // console.log(id.maxid);

          gestionHumDataModels
            .findOne({
              where: { id: id.maxid },
            })
            .then((result) => {
              // console.log(result);

              lastId = result['id'];
              // console.log('LastId :   ', lastId);

              consigne = result['consigneAir'];

              // console.log(
              //     "✅ %c SUCCÈS ==> gestions Air ==> Récupération de la Consigne Air ==> ",
              //     'color: green', consigne
              // );

              // pas = result['pasAir'];

              // console.log(
              //     "✅ %c SUCCÈS ==> gestions Air ==> Récupération du Pas Air ==========> ",
              //     'color: green', pas
              // );

              objectif = result['objectifAir'];

              // console.log(
              //     "✅ %c SUCCÈS ==> gestions Air ==> Récupération de l'Objectif Air ===> ",
              //     'color: green', objectif
              // );
            })
            .then(() => {

              resolve();

            });
        });
    } catch (error) {

      console.log('❌ %c ERREUR ==> gestions Air ==> Récupération de la consigne',
        'color: orange', error);

      reject();
    }

  });
}

//? --------------------------------------------------

//! -------------------------------------------------- !

//! Exécution des fonctions asynchrones.

let handleMyPromise = async () => {

  try {

    await recupérationDeLaConsigne();



  }
  catch (err) {
    console.log('err finale :', err);
  }
};

handleMyPromise();

//! -------------------------------------------------- !