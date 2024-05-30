//! Les constantes.

const magenta = '\x1b[35m';
require('dotenv').config();
const sequelize = require('sequelize');
const db = require('../../models');
const gestionHumsDataModels = db.gestionHumData;

//!-------------------------------------

//* Les variables.

let lastId;
let consigne;
let objectifHum;
let pasHum;
let newConsigne;
let palier;

//*-------------------------------------

//! Gestion des promesses.

//? Récupération de la dernière consigne.

const recuperationDerniereConsigne = () => {
  return new Promise((resolve, reject) => {
    try {

      gestionHumsDataModels
        .findOne({
          attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
          raw: true,
        })
        .then((id) => {

          gestionHumsDataModels
            .findOne({
              where: { id: id.maxid },
            })
            .then((result) => {

              try {
                lastId = result['id'];
                consigne = result['consigneHum'];
                pasHum = result['pasHum'];
                objectifHum = result['objectifHum'];
                deltaHum = result['deltaHum'];

                // console.log('result Hum :',result);

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

      pasHum == 0 ||
      pasHum == '' ||
      pasHum == null ||
      objectifHum == 0 ||
      objectifHum == '' ||
      objectifHum == null

    ) {
      console.log("Paramètre ===> Pas et Objectif non renseignés : GESTION CONSIGNE MANUELLE.");

      reject();

    } else if (

      pasHum == 0 ||
      pasHum == '' ||
      pasHum == null ||
      objectifHum == 0 ||
      objectifHum == '' ||
      objectifHum == null

    ) {

      console.log("Paramètre ===> Pas et Objectif renseignés : GESTION CONSIGNE AUTOMATIQUE.");
      resolve();

    }

  });
}

//? ------------------------------------------------

//? //! Définition de la condition.

let DefinitionCondition = () => {

  palier = pasHum / 12;

  return new Promise((resolve, reject) => {

    //* Condition 1 ===> si consigne === objectifHum.
    if (consigne === objectifHum) {

      newConsigne = objectifHum;

      console.log(" Action ======> Consigne = ObjectifHum | On ne fait rien :", newConsigne);

      resolve();

      //* Condition 2 ===> si consigne <= objectifHum.
    } else if (consigne <= objectifHum) {

      newConsigne = parseFloat(consigne + palier).toFixed(2);

      console.log(" Action ======> consigne <= objectifHum | Nouvelle consigne ➕ :", newConsigne
      );

      resolve();

    }

    //* Condition 3 ===> si consigne <= objectifHum.
    else if (consigne > objectifHum) {

      newConsigne = parseFloat(consigne - palier).toFixed(2);

      console.log(" Action ======> consigne <= objectifHum | Nouvelle consigne ➖ :", newConsigne
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

    gestionHumsDataModels
      .update({ consigneHum: newConsigne }, { where: { id: lastId } })
      .then((result) =>
        console.log(" La consigne à été mis à jour Hum :", result[0])
      )
      .then(() => {
        resolve();
      })
      .catch((error) => {
        console.log("🔴 ERROR : Mise à jour de la consigne Hum", error);
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