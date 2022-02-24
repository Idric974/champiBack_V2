//! Les constantes.

require('dotenv').config();
const cyan = '\x1b[36m';
const http = require('http');
const sequelize = require('sequelize');
const db = require('../../models');
const gestionCo2Models = db.gestionCo2;
const gestionCo2DataModels = db.gestionCo2Data;
//* -----------------------------------------------------------

//* Les variables.

let tauxCO2;
let consigne;
let deltaCo2;
let daysCo2;
let heuresCo2;
//* ----------------------------------

//! 2) Demande de mesure à la master.

async function updateTimeVariateur() {
  new Promise((resolve, reject) => {
    http
      .get('http://192.168.0.10:6000/getCO2/2', (resp) => {
        data = '';

        resp.on('data', (chunk) => {
          data += chunk;
          // console.log(
          //   cyan,
          //   '[ GESTION CO2 CALCULES  ] Valeur CO2 de la master',
          //   data
          // );

          // Taux de Co2.
          tauxCO2 = parseFloat(data).toFixed(2);
          // console.log(
          //   cyan,
          //   '[ GESTION CO2 CALCULES  ] Le taux de CO2 est de : ',
          //   tauxCO2
          // );
        });
      })

      .on('error', (err) => {
        console.log(cyan, '[ GESTION CO2 CALCULES  ] updateTimeVariateur', err);

        setTimeout(() => {
          updateTimeVariateur();
        }, 10000);

        reject(
          cyan,
          '[ GESTION CO2 CALCULES  ] Acces au Serveur Co2 Master impossible (Mesure Co2)'
        );
      });
  }).catch((err) => {
    console.log(cyan, '[ GESTION CO2 CALCULES  ] Erreur Co2', err);
  });
}

updateTimeVariateur()
  .then(() => {
    // Récupération de la consigne

    let recuperationConsigneCo2 = () => {
      gestionCo2DataModels
        .findOne({
          attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
          raw: true,
        })
        .then((id) => {
          // console.log(id.maxid);

          gestionCo2DataModels
            .findOne({
              where: { id: id.maxid },
            })
            .then((result) => {
              // console.log(result);

              lastId = result['id'];
              // console.log('LastId :   ', lastId);

              consigne = result['consigneCo2'];
              // console.log('Consigne : ', consigne);

              pas = result['pasCo2'];
              // console.log('Pas :      ', pas);

              objectif = result['objectifCo2'];
              // console.log('Objectif : ', objectif);
            });
        });
    };

    recuperationConsigneCo2();

    //------------------------------------------------------------
  })

  //! 3) Calcule du delta Co2.

  // .then(() => {
  //   let calcDelta = () => {
  //     deltaCo2 = parseFloat(tauxCO2 - consigne).toFixed(2);
  //     console.log(
  //       cyan,
  //       '[ GESTION CO2 CALCULES  ] Le delta de Co2 est de :',
  //       deltaCo2
  //     );
  //   };

  //   calcDelta();
  // })
  // ---------------------------------

  //! 4) Enregistrement en base de donnes.

  .then(() => {
    let enregistrament = () => {
      const newVal = gestionCo2Models
        .create({
          tauxCo2: tauxCO2,
          deltaCo2: deltaCo2,
        })
        .then(() => {
          // console.log(
          //   cyan,
          //   '[ GESTION CO2 CALCULES  ] Données transférées à la base de données gestion_co2s.'
          // );
        })
        .catch((error) => {
          console.log(
            cyan,
            '[ GESTION CO2 CALCULES  ] Erreur dans le processus d’enregistrement dans la base gestion_co2s',
            error
          );
        });
    };

    enregistrament();
  });
