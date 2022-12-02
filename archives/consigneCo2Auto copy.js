//* Les constantes.

const cyan = '\x1b[36m';
require('dotenv').config();
const sequelize = require('sequelize');
const db = require('../models');
const gestionCo2sDataModels = db.gestionCo2Data;
//*-------------------------------------

//* Les variables.

let lastId;
let consigne;
let objectifCo2;
let pasCo2;
let palier;
let newConsigne;
//*-------------------------------------

//! 1 ) ➖➖➖➖➖➖ Récupération de la dernière consigne➖➖➖➖➖➖

let derniereConsigne = () => {
  gestionCo2sDataModels
    .findOne({
      attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log(id.maxid);

      gestionCo2sDataModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((result) => {
          // console.log(result);

          lastId = result['id'];
          // console.log('Id : ', lastId);

          consigne = result['consigneCo2'];

          // console.log(
          //   cyan,
          //   '[ GESTION CO2 CONS AUTO ] Ancienne consigne : ',
          //   consigne
          // );

          pasCo2 = result['pasCo2'];
          // console.log('pasCo2 : ', pasCo2);

          objectifCo2 = result['objectifCo2'];
          // console.log('objectifCo2 : ', objectifCo2);

          deltaCo2 = result['deltaCo2'];
          // console.log('deltaCo2 : ', deltaCo2);
        });
    });
};
derniereConsigne();

//! 2 ) ➖➖➖➖➖➖ Calcule de la nouvelle consigne ➖➖➖➖➖➖

let gestionConsigne = () => {
  //
  //* Condition 1 ===> si consigne === objectifCo2.

  if (consigne === objectifCo2) {
    newConsigne = objectifCo2;
    // console.log(
    //   cyan,
    //   '[ GESTION CO2 CONS AUTO ] Action ======> Consigne = ObjectifCo2 | On ne fait rien'
    // );
  }

  //* Condition 2 ===> si consigne < objectifCo2.

  if (consigne < objectifCo2) {
    newConsigne = parseFloat(consigne + palier).toFixed(2);

    // console.log(
    //   cyan,
    //   '[ GESTION Co2 CONS AUTO ] Nouvelle consigne : ',
    //   newConsigne
    // );

    let newConsigneValue = () => {
      gestionCo2sDataModels
        .update({ consigneCo2: newConsigne }, { where: { id: lastId } })
        // .then(() =>
        //   console.log(
        //     cyan,
        //     '[ GESTION Co2 CONS AUTO ] La consigne à été mis à jour'
        //   )
        // )
        .catch((err) => console.log(err));
    };

    newConsigneValue();

    // console.log(
    //   cyan,
    //   '[ GESTION CO2 CONS AUTO ] Action ======> Gestion automatique de la consigne | On augmente la consigne à : ' +
    //     newConsigne +
    //     '°C'
    // );
  }

  //* Condition 3 ===> si consigne > objectifCo2.

  if (consigne > objectifCo2) {
    newConsigne = parseFloat(consigne - palier).toFixed(2);

    // console.log(
    //   cyan,
    //   '[ GESTION Co2 CONS AUTO ] Nouvelle consigne : ',
    //   newConsigne
    // );

    let newConsigneValue = () => {
      gestionCo2sDataModels
        .update({ consigneCo2: newConsigne }, { where: { id: lastId } })
        // .then(() =>
        //   console.log(
        //     cyan,
        //     '[ GESTION Co2 CONS AUTO ] La consigne à été mis à jour'
        //   )
        // )
        .catch((err) => console.log(err));
    };

    newConsigneValue();

    // console.log(
    //   cyan,
    //   '[ GESTION CO2 CONS AUTO ] Action ======> Gestion automatique de la consigne | On diminue la consigne à : ' +
    //     newConsigne +
    //     '°C'
    // );
  }
};
//-------------------------------------

//! 3) ➖➖➖➖➖➖ Fonction qui décide de la consigne automatique ou manuelle ➖➖➖➖➖➖

setTimeout(() => {
  palier = pasCo2 / 12;

  if (
    pasCo2 == 0 ||
    pasCo2 == '' ||
    pasCo2 == null ||
    objectifCo2 == 0 ||
    objectifCo2 == '' ||
    objectifCo2 == null
  ) {
    // console.log(
    //   cyan,
    //   '[ GESTION CO2 CONS AUTO ] Paramètre ===> (Pas et Objectif) non renseignés : GESTION CONSIGNE MANUELLE.'
    // );
    return;
  }
  if (pasCo2 !== 0 && objectifCo2 !== 0) {
    // console.log(
    //   cyan,
    //   '[ GESTION CO2 CONS AUTO ] Paramètre ===> Pas et Objectif) renseignés : GESTION CONSIGNE AUTOMATIQUE.'
    // );
    gestionConsigne();
  }
}, 1000);

setTimeout(() => { }, 1500);
