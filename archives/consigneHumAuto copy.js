//! Les constantes.

const magenta = '\x1b[35m';
require('dotenv').config();
const sequelize = require('sequelize');
const db = require('../models');
const gestionHumsDataModels = db.gestionHumData;

//!-------------------------------------

//* Les variables.

let lastId;
let consigne;
let objectifHum;
let pasHum;
let palier;
let newConsigne;
//*-------------------------------------

//! 1 ) ➖➖➖➖➖➖ Récupération de la dernière consigne➖➖➖➖➖➖

let derniereConsigne = () => {
  gestionHumsDataModels
    .findOne({
      attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log(id.maxid);

      gestionHumsDataModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((result) => {
          // console.log(result);

          lastId = result['id'];
          // console.log('Id : ', lastId);

          consigne = result['consigneHum'];

          // console.log(
          //   magenta,
          //   '[ GESTION HUM CONS AUTO ] Ancienne consigne : ',
          //   consigne
          // );

          pasHum = result['pasHum'];
          // console.log('pasHum : ', pasHum);

          objectifHum = result['objectifHum'];
          // console.log('objectifHum : ', objectifHum);

          deltaHum = result['deltaHum'];
          // console.log('deltaHum : ', deltaHum);
        });
    });
};
derniereConsigne();

//! 2 ) ➖➖➖➖➖➖ Calcule de la nouvelle consigne ➖➖➖➖➖➖

let gestionConsigne = () => {
  //
  //* Condition 1 ===> si consigne === objectifHum.

  if (consigne === objectifHum) {
    newConsigne = objectifHum;
    // console.log(
    //   magenta,
    //   '[ GESTION HUM CONS AUTO ] Action ======> Consigne = ObjectifHum | On ne fait rien'
    // );
  }

  //* Condition 2 ===> si consigne < objectifHum.

  if (consigne < objectifHum) {
    newConsigne = parseFloat(consigne + palier).toFixed(2);

    // console.log(
    //   magenta,
    //   '[ GESTION Hum CONS AUTO ] Nouvelle consigne : ',
    //   newConsigne
    // );

    let newConsigneValue = () => {
      gestionHumsDataModels
        .update({ consigneHum: newConsigne }, { where: { id: lastId } })
        // .then(() =>
        //   console.log(
        //     magenta,
        //     '[ GESTION Hum CONS AUTO ] La consigne à été mis à jour'
        //   )
        // )
        .catch((err) => console.log(err));
    };

    newConsigneValue();

    // console.log(
    //   magenta,
    //   '[ GESTION HUM CONS AUTO ] Action ======> Gestion automatique de la consigne | On augmente la consigne à : ' +
    //     newConsigne +
    //     '°C'
    // );
  }

  //* Condition 3 ===> si consigne > objectifHum.

  if (consigne > objectifHum) {
    newConsigne = parseFloat(consigne - palier).toFixed(2);

    // console.log(
    //   magenta,
    //   '[ GESTION Hum CONS AUTO ] Nouvelle consigne : ',
    //   newConsigne
    // );

    let newConsigneValue = () => {
      gestionHumsDataModels
        .update({ consigneHum: newConsigne }, { where: { id: lastId } })
        // .then(() =>
        //   console.log(
        //     magenta,
        //     '[ GESTION Hum CONS AUTO ] La consigne à été mis à jour'
        //   )
        // )
        .catch((err) => console.log(err));
    };

    newConsigneValue();

    // console.log(
    //   magenta,
    //   '[ GESTION HUM CONS AUTO ] Action ======> Gestion automatique de la consigne | On diminue la consigne à : ' +
    //     newConsigne +
    //     '°C'
    // );
  }
};
//-------------------------------------

//! 3) ➖➖➖➖➖➖ Fonction qui décide de la consigne automatique ou manuelle ➖➖➖➖➖➖

setTimeout(() => {
  palier = pasHum / 12;

  if (
    pasHum == 0 ||
    pasHum == '' ||
    pasHum == null ||
    objectifHum == 0 ||
    objectifHum == '' ||
    objectifHum == null
  ) {
    // console.log(
    //   magenta,
    //   '[ GESTION HUM CONS AUTO ] Paramètre ===> (Pas et Objectif) non renseignés : GESTION CONSIGNE MANUELLE.'
    // );
    return;
  }
  if (pasHum !== 0 && objectifHum !== 0) {
    // console.log(
    //   magenta,
    //   '[ GESTION HUM CONS AUTO ] Paramètre ===> Pas et Objectif) renseignés : GESTION CONSIGNE AUTOMATIQUE.'
    // );
    gestionConsigne();
  }
}, 1000);

setTimeout(() => { }, 1500);
