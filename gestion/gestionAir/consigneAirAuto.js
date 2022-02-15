//* Les constantes.
const jaune = '\x1b[33m';
require('dotenv').config();
const sequelize = require('sequelize');
const db = require('../../models');
const gestionAirsDataModels = db.gestionAirData;
//*-------------------------------------

//* Les variables.

let lastId;
let consigne;
let objectifAir;
let pasAir;
let palier;
let newConsigne;
//*-------------------------------------

//! 1 ) ➖➖➖➖➖➖ Récupération de la dernière consigne➖➖➖➖➖➖

let derniereConsigne = () => {
  gestionAirsDataModels
    .findOne({
      attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log(id.maxid);

      gestionAirsDataModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((result) => {
          // console.log(result);

          lastId = result['id'];
          // console.log('Id : ', lastId);

          consigne = result['consigneAir'];

          // console.log(
          //   jaune,
          //   '[ GESTION AIR SOCKET IO ] Ancienne consigne : ',
          //   consigne
          // );

          pasAir = result['pasAir'];
          // console.log('pasAir : ', pasAir);

          objectifAir = result['objectifAir'];
          // console.log('objectifAir : ', objectifAir);

          deltaAir = result['deltaAir'];
          // console.log('deltaAir : ', deltaAir);
        });
    });
};
derniereConsigne();

//! 2 ) ➖➖➖➖➖➖ Calcule de la nouvelle consigne ➖➖➖➖➖➖

let gestionConsigne = () => {
  //
  //* Condition 1 ===> si consigne === objectifAir.

  if (consigne === objectifAir) {
    newConsigne = objectifAir;
    console.log(
      jaune,
      '[ GESTION AIR CONS AUTO ] Action ======> Consigne = ObjectifAir | On ne fait rien'
    );
  }

  //* Condition 2 ===> si consigne < objectifAir.

  if (consigne < objectifAir) {
    newConsigne = parseFloat(consigne + palier).toFixed(2);

    // console.log(
    //   jaune,
    //   '[ GESTION AIR CONS AUTO ] Nouvelle consigne : ',
    //   newConsigne
    // );

    let newConsigneValue = () => {
      gestionAirsDataModels
        .update({ consigneAir: newConsigne }, { where: { id: lastId } })
        // .then(() =>
        //   console.log(
        //     jaune,
        //     '[ GESTION AIR CONS AUTO ] La consigne à été mis à jour'
        //   )
        // )
        .catch((err) => console.log(err));
    };

    newConsigneValue();

    console.log(
      jaune,
      '[ GESTION AIR CONS AUTO ] Action ======> Gestion automatique de la consigne | On augmente la consigne à : ' +
        newConsigne +
        '°C'
    );
  }

  //* Condition 3 ===> si consigne > objectifAir.

  if (consigne > objectifAir) {
    newConsigne = parseFloat(consigne - palier).toFixed(2);

    // console.log(
    //   jaune,
    //   '[ GESTION AIR CONS AUTO ] Nouvelle consigne : ',
    //   newConsigne
    // );

    let newConsigneValue = () => {
      gestionAirsDataModels
        .update({ consigneAir: newConsigne }, { where: { id: lastId } })
        // .then(() =>
        //   console.log(
        //     jaune,
        //     '[ GESTION AIR CONS AUTO ] La consigne à été mis à jour'
        //   )
        // )
        .catch((err) => console.log(err));
    };

    newConsigneValue();

    console.log(
      jaune,
      '[ GESTION AIR CONS AUTO ] Action ======> Gestion automatique de la consigne | On diminue la consigne à : ' +
        newConsigne +
        '°C'
    );
  }
};
//-------------------------------------

//! 3) ➖➖➖➖➖➖ Fonction qui décide de la consigne automatique ou manuelle ➖➖➖➖➖➖

setTimeout(() => {
  palier = pasAir / 1440;

  if (
    pasAir == 0 ||
    pasAir == '' ||
    pasAir == null ||
    objectifAir == 0 ||
    objectifAir == '' ||
    objectifAir == null
  ) {
    // console.log(
    //   jaune,
    //   '[ GESTION AIR CONS AUTO ] Paramètre ===> (Pas et Objectif) non renseignés : GESTION CONSIGNE MANUELLE.'
    // );
    return;
  }
  if (pasAir !== 0 && objectifAir !== 0) {
    // console.log(
    //   jaune,
    //   '[ GESTION AIR CONS AUTO ] Paramètre ===> Pas et Objectif) renseignés : GESTION CONSIGNE AUTOMATIQUE.'
    // );
    gestionConsigne();
  }
}, 1000);

setTimeout(() => {}, 1500);
