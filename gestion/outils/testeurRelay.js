// Tester un relay

// let relay = 27;

// const Gpio = require('onoff').Gpio;

// const realy15On = new Gpio(relay, 'out');

// setTimeout(() => {
//   const realy15Off = new Gpio(relay, 'in');
// }, 2000);

//****************************************************************************** */
// require('dotenv').config();
// const jaune = '\x1b[33m';
// const sequelize = require('sequelize');
// const db = require('../../models');
// const dataAirModels = db.gestionAir;

// // Récupération de la consigne

// const connexionBaseDonnee = new Promise((resolve, reject) => {
//   dataAirModels.findOne({
//     attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
//     raw: true,
//   });

//   if (dataAirModels) {
//     resolve(dataAirModels);
//   } else {
//     reject();
//   }
// });

// // Utilisation.
// dataAirModels
//   .then((id) => {
//     newConnect
//       .findOne({
//         where: { id: id.maxid },
//       })
//       .then((result) => {
//         // console.log(result);

//         lastId = result['id'];
//         // console.log('===========> lastId : ', lastId);

//         consigne = result['consigneAir'];
//         // console.log('consigne : ', consigne);

//         deltaAir = result['deltaAir'];
//         // console.log('===========> deltaAir : ', deltaAir);
//       });
//   })
//   .catch(() => {
//     console.log('erreur');
//   });

//****************************************************************************** */
