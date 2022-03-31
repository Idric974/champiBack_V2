require('dotenv').config();
const db = require('../../models');
const Sequelize = require('sequelize');

//* Gestion Air

// const miseAJourGestionAirData = db.gestionAirData;

// const newDataCo2 = miseAJourGestionAirData
//   .create({
//     consigneAir: 0,
//     pasAir: 0,
//     objectifAir: 0,
//   })
//   .then((result) => {
//     console.log('Table mise à jour');
//   })
//   .catch((error) => {
//     console.log('Table non mise à jour', error);
//   });

// const majGestionAirModels = db.gestionAir;

// const newEtatRelay = majGestionAirModels
//   .create({
//     etatRelay: 0,
//     temperatureAir: 0,
//     deltaAir: 0,
//     days: 0,
//     heures: 0,
//     actionRelay: 0,
//   })
//   .then((result) => {
//     console.log('Table mise à jour');
//   })
//   .catch((error) => {
//     console.log('Table non mise à jour', error);
//   });

//* -----------------------------------------------------------------

//* Gestion Humidité

// const miseAJourGestionHumDataModels = db.gestionHumData;

// const newDataAir = miseAJourGestionHumDataModels
//   .create({
//     consigneHum: 0,
//     pasHum: 0,
//     objectifHum: 0,
//   })
//   .then(() => {
//     console.log('Table mise à jour');
//   })
//   .catch((error) => {
//     console.log('Table non mise à jour', error);
//   });

//* -----------------------------------------------------------------

//* Gestion Co2

// Valeurs.

// Data.

const miseAJourGestionCo2 = db.gestionCo2;

const newDataCo2 = miseAJourGestionCo2
  .create({
    tauxCo2: 1300,
    deltaCo2: 500,
    daysCo2: 2,
    heuresCo2: 40,
    consigne: '1100',
    valeurAxeX: 'jour 1 - 10h30',
    jourDuCycle: '1',
  })
  .then((result) => {
    console.log('Table mise à jour');
  })
  .catch((error) => {
    console.log('Table non mise à jour', error);
  });

// -------------------------

// Data.
// const miseAJourGestionCo2Data = db.gestionCo2Data;

// const newDataCo2 = miseAJourGestionCo2Data
//   .create({
//     consigneCo2: 0,
//     pasCo2: 0,
//     objectifCo2: 0,
//   })
//   .then((result) => {
//     console.log('Table mise à jour');
//   })
//   .catch((error) => {
//     console.log('Table non mise à jour', error);
//   });

//* -----------------------------------------------------------------

//* Etalonnage Air.

// const miseAJourEtalonnageAir = db.etalonnageAir;

// const newEtalAir = miseAJourEtalonnageAir
//   .create({
//     etalonnageAir: 0,
//   })
//   .then((result) => {
//     console.log('Table mise à jour');
//   })
//   .catch((error) => {
//     console.log('Table non mise à jour', error);
//   });

//* -----------------------------------------------------------------

//* Etalonnage Hum Sec.

// const miseAJourEtalonnageHumSec = db.etalonnageSec;

// const newEtalAir = miseAJourEtalonnageHumSec
//   .create({
//     etalonnageSec: 0,
//   })
//   .then((result) => {
//     console.log('Table mise à jour');
//   })
//   .catch((error) => {
//     console.log('Table non mise à jour', error);
//   });

//* -----------------------------------------------------------------

//* Etalonnage Hum Hum.

// const miseAJourEtalonnageHumHum = db.etalonnageHum;

// const newEtalAir = miseAJourEtalonnageHumHum
//   .create({
//     etalonnageHum: 0,
//   })
//   .then((result) => {
//     console.log('Table mise à jour');
//   })
//   .catch((error) => {
//     console.log('Table non mise à jour', error);
//   });

//* -----------------------------------------------------------------
