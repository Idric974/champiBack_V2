require('dotenv').config();
const db = require('../../models');
const Sequelize = require('sequelize');

//! Gestion Air

//* Valeurs.

// const majGestionAirModels = db.gestionAir;

// const newEtatRelay = majGestionAirModels
//   .create({
//     temperatureAir: 0,
//     deltaAir: 0,
//     days: 0,
//     heures: 0,
//     actionRelay: 0,
//     etatRelay: 0,
//     consigne: '0',
//     valeurAxeX: '0',
//     jourDuCycle: '0',
//   })
//   .then((result) => {
//     console.log('Table mise à jour');
//   })
//   .catch((error) => {
//     console.log('Table non mise à jour', error);
//   });

//* -------------------------*

//* Data.

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

//* -------------------------*

//! --------------------------------------------------

//! Gestion Humidité

//* Valeurs.

// const majGestionAirModels = db.gestionHum;

// const newEtatRelay = majGestionAirModels
//   .create({
//     tauxHumidite: 0,
//     deltaHum: 0,
//     valeursMesureSec180: 0,
//     valeursMesureHum90: 0,
//     daysHum: 0,
//     heuresHum: 0,
//     consigne: '0',
//     valeurAxeX: '0',
//     jourDuCycle: '0',
//   })
//   .then((result) => {
//     console.log('Table mise à jour');
//   })
//   .catch((error) => {
//     console.log('Table non mise à jour', error);
//   });

//* -------------------------*

//* Data

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

//* -------------------------*

//! --------------------------------------------------

//! Gestion Co2

// Valeurs.

// Data.

// const miseAJourGestionCo2 = db.gestionCo2;

// const newDataCo2 = miseAJourGestionCo2
//   .create({
//     tauxCo2: 1300,
//     deltaCo2: 500,
//     daysCo2: 2,
//     heuresCo2: 40,
//     consigne: '1100',
//     valeurAxeX: 'jour 1 - 10h30',
//     jourDuCycle: '1',
//   })
//   .then((result) => {
//     console.log('Table mise à jour');
//   })
//   .catch((error) => {
//     console.log('Table non mise à jour', error);
//   });

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

//! --------------------------------------------------

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

//! --------------------------------------------------

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

//! --------------------------------------------------

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

//! --------------------------------------------------

//* Etat relay.

// const miseAJourEtatRelay = db.gestionAir;

// const newEtalAir = miseAJourEtatRelay
//   .findOne({
//     attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
//     raw: true,
//   })
//   .then((id) => {
//     // console.log('Le dernier id de gestionAir est : ', id);
//     // console.log(id.maxid);
//     lastId = id.maxid;

//     miseAJourEtatRelay
//       .update({ etatRelay: 0 }, { where: { id: lastId } })

//       .then(() => {
//         console.log('Data Air enregitrées dans la base gestion_airs');
//       })

//       .catch((err) => console.log(err));
//   });

//! --------------------------------------------------
