//* Les constantes.

const jaune = '\x1b[33m';
require('dotenv').config();
const sequelize = require('sequelize');
const { log } = require('winston');
const db = require('../../models');
const gestionAirsDataModels = db.gestionAirData;

//*-------------------------------------

//* Les variables.

let lastId;
let consigne;
let objectifAir;
let pasAir;
let newConsigne;
let palier;

//*-------------------------------------

//! Gestion des promesses.

//? Récupération de la dernière consigne.

const recuperationDerniereConsigne = () => {
  return new Promise((resolve, reject) => {
    try {

      gestionAirsDataModels
        .findOne({
          attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
          raw: true,
        })
        .then((id) => {

          gestionAirsDataModels
            .findOne({
              where: { id: id.maxid },
            })
            .then((result) => {

              try {
                lastId = result['id'];
                consigne = result['consigneAir'];
                pasAir = result['pasAir'];
                objectifAir = result['objectifAir'];
                deltaAir = result['deltaAir'];

                // console.log('result Air :', result);

              } catch (error) {
                console.log("🔴 ERROR : Récupération des datas");
              }

            })
            .then(() => {
              console.log(
                jaune,
                "Ancienne consigne : ",
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

      pasAir == 0 ||
      pasAir == '' ||
      pasAir == null ||
      objectifAir == 0 ||
      objectifAir == '' ||
      objectifAir == null

    ) {
      console.log("Paramètre ===> Pas et Objectif non renseignés : GESTION CONSIGNE MANUELLE.");

      reject();

    } else if (pasAir !== 0 ||
      pasAir !== '' ||
      pasAir !== null ||
      objectifAir !== 0 ||
      objectifAir !== '' ||
      objectifAir !== null) {

      console.log("Paramètre ===> Pas et Objectif renseignés : GESTION CONSIGNE AUTOMATIQUE.");
      resolve();

    }

  });
}

//? ------------------------------------------------

//? //! Définition de la condition.

let DefinitionCondition = () => {

  palier = pasAir / 12;

  return new Promise((resolve, reject) => {

    //* Condition 1 ===> si consigne === objectifAir.
    if (consigne === objectifAir) {

      newConsigne = objectifAir;

      console.log(" Action ======> Consigne = ObjectifAir | On ne fait rien :", newConsigne);

      resolve();

      //* Condition 2 ===> si consigne <= objectifAir.
    } else if (consigne <= objectifAir) {

      newConsigne = parseFloat(consigne + palier).toFixed(2);

      console.log(" Action ======> consigne <= objectifAir | Nouvelle consigne ➕ :", newConsigne
      );

      resolve();

    }

    //* Condition 3 ===> si consigne <= objectifAir.
    else if (consigne > objectifAir) {

      newConsigne = parseFloat(consigne - palier).toFixed(2);

      console.log(" Action ======> consigne <= objectifAir | Nouvelle consigne ➖ :", newConsigne
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

    gestionAirsDataModels
      .update({ consigneAir: newConsigne }, { where: { id: lastId } })
      .then((result) =>
        console.log(" La consigne à été mis à jour :", result[0])
      )
      .then(() => {
        resolve();
      })
      .catch((error) => {
        console.log("🔴 ERROR : Mise à jour de la consigne", error);
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