// require('dotenv').config();
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
// const db = require('../../models');
// const tempAirModels = db.mesureAir;
// const moment = require('moment');

// let dateDeFin = moment().format('Y-M-D');
// console.log('date', dateDeFin);

// let dateDeDebut = moment().subtract(40, 'days').format('Y-M-D');
// console.log('dateAnt', dateDeDebut);

// // Les dates à 40 jours.
// let dateMoins1 = moment().subtract(1, 'days').format('Y-M-D');
// let dateMoins2 = moment().subtract(2, 'days').format('Y-M-D');
// let dateMoins3 = moment().subtract(3, 'days').format('Y-M-D');
// let dateMoins4 = moment().subtract(4, 'days').format('Y-M-D');
// let dateMoins5 = moment().subtract(5, 'days').format('Y-M-D');
// let dateMoins6 = moment().subtract(6, 'days').format('Y-M-D');
// let dateMoins7 = moment().subtract(7, 'days').format('Y-M-D');
// let dateMoins8 = moment().subtract(8, 'days').format('Y-M-D');
// let dateMoins9 = moment().subtract(9, 'days').format('Y-M-D');
// let dateMoins10 = moment().subtract(10, 'days').format('Y-M-D');
// let dateMoins11 = moment().subtract(11, 'days').format('Y-M-D');
// let dateMoins12 = moment().subtract(12, 'days').format('Y-M-D');
// let dateMoins13 = moment().subtract(13, 'days').format('Y-M-D');
// let dateMoins14 = moment().subtract(14, 'days').format('Y-M-D');
// let dateMoins15 = moment().subtract(15, 'days').format('Y-M-D');
// let dateMoins16 = moment().subtract(16, 'days').format('Y-M-D');
// let dateMoins17 = moment().subtract(17, 'days').format('Y-M-D');
// let dateMoins18 = moment().subtract(18, 'days').format('Y-M-D');
// let dateMoins19 = moment().subtract(19, 'days').format('Y-M-D');
// let dateMoins20 = moment().subtract(20, 'days').format('Y-M-D');
// let dateMoins21 = moment().subtract(21, 'days').format('Y-M-D');
// let dateMoins22 = moment().subtract(22, 'days').format('Y-M-D');
// let dateMoins23 = moment().subtract(23, 'days').format('Y-M-D');
// let dateMoins24 = moment().subtract(24, 'days').format('Y-M-D');
// let dateMoins25 = moment().subtract(25, 'days').format('Y-M-D');
// let dateMoins26 = moment().subtract(26, 'days').format('Y-M-D');
// let dateMoins27 = moment().subtract(27, 'days').format('Y-M-D');
// let dateMoins28 = moment().subtract(28, 'days').format('Y-M-D');
// let dateMoins29 = moment().subtract(29, 'days').format('Y-M-D');
// let dateMoins30 = moment().subtract(30, 'days').format('Y-M-D');
// let dateMoins31 = moment().subtract(31, 'days').format('Y-M-D');
// let dateMoins32 = moment().subtract(32, 'days').format('Y-M-D');
// let dateMoins33 = moment().subtract(33, 'days').format('Y-M-D');
// let dateMoins34 = moment().subtract(34, 'days').format('Y-M-D');
// let dateMoins35 = moment().subtract(35, 'days').format('Y-M-D');
// let dateMoins36 = moment().subtract(36, 'days').format('Y-M-D');
// let dateMoins37 = moment().subtract(37, 'days').format('Y-M-D');
// let dateMoins38 = moment().subtract(38, 'days').format('Y-M-D');
// let dateMoins39 = moment().subtract(39, 'days').format('Y-M-D');
// let dateMoins40 = moment().subtract(40, 'days').format('Y-M-D');

// // Les tableaux.
// let dayTab1 = [];
// let dayTab2 = [];
// let dayTab3 = [];
// let dayTab4 = [];
// let dayTab5 = [];
// let dayTab6 = [];
// let dayTab7 = [];
// let dayTab8 = [];
// let dayTab9 = [];
// let dayTab10 = [];
// let dayTab11 = [];
// let dayTab12 = [];
// let dayTab13 = [];
// let dayTab14 = [];
// let dayTab15 = [];
// let dayTab16 = [];
// let dayTab17 = [];
// let dayTab18 = [];
// let dayTab19 = [];
// let dayTab20 = [];
// let dayTab21 = [];
// let dayTab22 = [];
// let dayTab23 = [];
// let dayTab24 = [];
// let dayTab25 = [];
// let dayTab26 = [];
// let dayTab27 = [];
// let dayTab28 = [];
// let dayTab29 = [];
// let dayTab30 = [];
// let dayTab31 = [];
// let dayTab32 = [];
// let dayTab33 = [];
// let dayTab34 = [];
// let dayTab35 = [];
// let dayTab36 = [];
// let dayTab37 = [];
// let dayTab38 = [];
// let dayTab39 = [];
// let dayTab40 = [];

// let selectionDate = () => {
//   tempAirModels
//     .findAll({
//       raw: true,
//       where: {
//         createdAt: {
//           [Op.between]: [dateDeDebut, dateDeFin],
//         },
//       },
//     })
//     .then((result) => {
//       const list = result;
//       list.forEach((item) => {
//         if (item['createdAt'] === dateMoins1) {
//           dayTab1.push(item['mesureAir']);
//           // console.log('dayTab1', dayTab1);
//         }
//         if (item['createdAt'] === dateMoins2) {
//           dayTab2.push(item['mesureAir']);
//           // console.log('dayTab2', dayTab2);
//         }
//         if (item['createdAt'] === dateMoins3) {
//           dayTab3.push(item['mesureAir']);
//           // console.log('dayTab3', dayTab3);
//         }
//         if (item['createdAt'] === dateMoins4) {
//           dayTab4.push(item['mesureAir']);
//           // console.log('dayTab4', dayTab4);
//         }
//         if (item['createdAt'] === dateMoins5) {
//           dayTab5.push(item['mesureAir']);
//           console.log('dayTab5', dayTab5);
//         }
//         if (item['createdAt'] === dateMoins6) {
//           dayTab6.push(item['mesureAir']);
//           console.log('dayTab6', dayTab6);
//         }
//         if (item['createdAt'] === dateMoins7) {
//           dayTab7.push(item['mesureAir']);
//           console.log('dayTab7', dayTab7);
//         }
//         if (item['createdAt'] === dateMoins8) {
//           dayTab8.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins9) {
//           dayTab9.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins10) {
//           dayTab10.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins11) {
//           dayTab11.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins12) {
//           dayTab12.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins13) {
//           dayTab13.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins14) {
//           dayTab14.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins15) {
//           dayTab15.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins16) {
//           dayTab16.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins17) {
//           dayTab17.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins18) {
//           dayTab18.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins19) {
//           dayTab19.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins20) {
//           dayTab20.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins21) {
//           dayTab21.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins22) {
//           dayTab22.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins23) {
//           dayTab23.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins24) {
//           dayTab24.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins25) {
//           dayTab25.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins26) {
//           dayTab26.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins27) {
//           dayTab27.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins28) {
//           dayTab28.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins29) {
//           dayTab29.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins30) {
//           dayTab30.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins31) {
//           dayTab31.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins32) {
//           dayTab32.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins33) {
//           dayTab33.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins34) {
//           dayTab34.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins35) {
//           dayTab35.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins36) {
//           dayTab36.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins37) {
//           dayTab37.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins38) {
//           dayTab38.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins39) {
//           dayTab39.push(item['mesureAir']);
//         }
//         if (item['createdAt'] === dateMoins40) {
//           dayTab40.push(item['mesureAir']);
//         }
//       });
//     });
// };
// selectionDate();

console.log('\x1b[34m', '[ GESTION HUMIDITÉ ] Activation du ventilateur.');
