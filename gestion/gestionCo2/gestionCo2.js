//! Les constantes.

require('dotenv').config();
const cyan = '\x1b[36m';
const http = require('http');
const { resolve } = require('path');
const sequelize = require('sequelize');
const db = require('../../models');
const gestionCo2Models = db.gestionCo2;
const gestionCo2DataModels = db.gestionCo2Data;
//! -----------------------------------------------------------

//! Les variables.

let data = '';
let consigne;
let deltaCo2;
let daysCo2;
let heuresCo2;
//! ----------------------------------

const getTauxCo2 = new Promise((resolve, reject) => {
  //! 2) Demande de mesure à la master.
  http
    .get('http://192.168.0.10:6000/getCO2/2', (resp) => {
      //
      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {});
    })

    .on('response', function (resp) {
      if (resp.statusCode === 200) {
        // console.log('OK OK');
        resolve();
      } else {
        reject();
        // console.log('PAS OK');
      }
    })

    .on('error', (err) => {
      console.log('Error: ' + err.message);
    });
});

let actionGetTauxCo2 = async () => {
  let go = await getTauxCo2;
  return go;
};

//!------------------------------------------------------------

actionGetTauxCo2(data)
  .then(() => {
    //! Récupération de la consigne

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
              // console.log('Récupération de la consigne =====> ' + result);

              lastId = result['id'];
              // console.log('LastId :   ', lastId);

              consigne = result['consigneCo2'];

              console.log(
                cyan,
                '[ GESTION CO2 CALCULES  ] La consigne est : ' + consigne
              );

              pas = result['pasCo2'];
              // console.log('Pas :      ', pas);

              pas = result['pasCo2'];
              // console.log('Pas :      ', pas);

              objectif = result['objectifCo2'];
              // console.log('Objectif : ', objectif);
            });
        })
        .then(() => {
          //* Calcule du delta.

          setTimeout(() => {
            let calcDelta = () => {
              deltaCo2 = data - consigne;

              console.log(
                cyan,
                '[ GESTION CO2 CALCULES  ] Le taux de Co2 est de :' +
                  data +
                  'ppm'
              );

              console.log(
                cyan,
                '[ GESTION CO2 CALCULES  ] Le delta de Co2 est de :',
                deltaCo2 + 'ppm'
              );
            };

            calcDelta();
          }, 1000);

          //*------------------------------------------------------------
        });
    };

    recuperationConsigneCo2();

    //!------------------------------------------------------------
  })

  .then(() => {
    //! 4) Enregistrement en base de donnes.

    setTimeout(() => {
      let enregistrement = () => {
        const newVal = gestionCo2Models
          .create({
            tauxCo2: data,
            deltaCo2: deltaCo2,
          })
          .then(() => {
            console.log(
              cyan,
              '[ GESTION CO2 CALCULES  ] Données transférées à la base de données gestion_co2s.'
            );
          })
          .catch((error) => {
            console.log(
              cyan,
              '[ GESTION CO2 CALCULES  ] Erreur dans le processus d’enregistrement dans la base gestion_co2s',
              error
            );
          });
      };

      enregistrement();
    }, 2000);

    //!----------------------------------------------
  })

  .catch(() => {
    console.log(cyan, '[ GESTION CO2 CALCULES  ] Erreur Co2', err);
  });
