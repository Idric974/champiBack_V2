require('dotenv').config();
const Sequelize = require('sequelize');
const db = require('../../models');

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

const miseAJourGestionAirEtatRelay = db.gestionAirEtatRelay;

const newEtatRelay = miseAJourGestionAirEtatRelay
  .create({
    etatRelay: 0,
  })
  .then((result) => {
    console.log('Table mise à jour');
  })
  .catch((error) => {
    console.log('Table non mise à jour', error);
  });

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
