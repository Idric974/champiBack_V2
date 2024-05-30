//* Les constantes.

const cyan = '\x1b[36m';
require('dotenv').config();
const sequelize = require('sequelize');
const db = require('../../models');
const gestionCo2sDataModels = db.gestionCo2Data;

//*-------------------------------------

//* Les variables.

let lastId;
let consigne;
let objectifCo2;
let pasCo2;
let newConsigne;
let palier;

//*-------------------------------------

//! Gestion des promesses.

//? Récupération de la dernière consigne.

const recuperationDerniereConsigne = () => {
  return new Promise((resolve, reject) => {
    try {

      gestionCo2sDataModels
        .findOne({
          attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
          raw: true,
        })
        .then((id) => {

          gestionCo2sDataModels
            .findOne({
              where: { id: id.maxid },
            })
            .then((result) => {

              try {
                lastId = result['id'];
                consigne = result['consigneCo2'];
                pasCo2 = result['pasCo2'];
                objectifCo2 = result['objectifCo2'];
                deltaCo2 = result['deltaCo2'];

                // console.log('result Co2 :',result);

              } catch (error) {
                console.log("🔴 ERROR : Récupération des datas");
              }

            })
            .then(() => {
              console.log(
                jaune,
                'Ancienne consigne : ',
                consigne
              );

              if (lastId > 0) {
                resolve();
              }

            });
        });

    } catch (error) {
      console.log("🔴 ERROR : Récupération de la dernière consigne");
      reject();
    }
  });
}

//? ------------------------------------------------

//? Définition si consigne auto ou non.

let definitionConsigneAuto = () => {
  return new Promise((resolve, reject) => {
    if (

      pasCo2 == 0 ||
      pasCo2 == '' ||
      pasCo2 == null ||
      objectifCo2 == 0 ||
      objectifCo2 == '' ||
      objectifCo2 == null

    ) {
      console.log("Paramètre ===> Pas et Objectif non renseignés : GESTION CONSIGNE MANUELLE.");

      reject();

    } else if (

      pasCo2 == 0 ||
      pasCo2 == '' ||
      pasCo2 == null ||
      objectifCo2 == 0 ||
      objectifCo2 == '' ||
      objectifCo2 == null

    ) {

      console.log("Paramètre ===> Pas et Objectif renseignés : GESTION CONSIGNE AUTOMATIQUE.");
      resolve();

    }

  });
}

//? ------------------------------------------------

//? //! Définition de la condition.

let DefinitionCondition = () => {

  palier = pasCo2 / 12;

  return new Promise((resolve, reject) => {

    //* Condition 1 ===> si consigne === objectifCo2.
    if (consigne === objectifCo2) {

      newConsigne = objectifCo2;

      console.log(" Action ======> Consigne = ObjectifCo2 | On ne fait rien :", newConsigne);

      resolve();

      //* Condition 2 ===> si consigne <= objectifCo2.
    } else if (consigne <= objectifCo2) {

      newConsigne = parseFloat(consigne + palier).toFixed(2);

      console.log(" Action ======> consigne <= objectifCo2 | Nouvelle consigne ➕ :", newConsigne
      );

      resolve();

    }

    //* Condition 3 ===> si consigne <= objectifCo2.
    else if (consigne > objectifCo2) {

      newConsigne = parseFloat(consigne - palier).toFixed(2);

      console.log(" Action ======> consigne <= objectifCo2 | Nouvelle consigne ➖ :", newConsigne
      );

      resolve();
    }

    else {
      console.log("🔴 ERROR : Définition de la condition");
      reject();
    }

  });
}

//? ------------------------------------------------

// ? Mise à jour de la consigne.

const MiseAjourConsigne = () => {
  return new Promise((resolve, reject) => {

    gestionCo2sDataModels
      .update({ consigneCo2: newConsigne }, { where: { id: lastId } })
      .then((result) =>
        console.log(" La consigne à été mis à jour Co2 :", result[0])
      )
      .then(() => {
        resolve();
      })
      .catch((error) => {
        console.log("🔴 ERROR : Mise à jour de la consigne Co2", error);
        reject();
      });
  });
}

//? ------------------------------------------------

//! ------------------------------------------------

//! Exécution des promesses.

let handleMyPromise = async () => {

  try {
    await recuperationDerniereConsigne();
    await definitionConsigneAuto();
    await DefinitionCondition();
    await MiseAjourConsigne();
  }
  catch (err) {
    console.log("🔺 ERROR : Exécution des promesses :", err);
  }
};

handleMyPromise();

//! ------------------------------------------------