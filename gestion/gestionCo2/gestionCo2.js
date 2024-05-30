//! Les constantes.

require('dotenv').config();
const cyan = '\x1b[36m';
const http = require('http');
const { resolve } = require('path');
const sequelize = require('sequelize');
const db = require('../../models');
const gestionCo2Models = db.gestionCo2;
const gestionCo2DataModels = db.gestionCo2Data;
const axios = require('axios');
const numSalle = require('../../configNumSalle');

//! -----------------------------------------------------------

//! Les variables.

let data;
let tauxCo2;
let consigne;
let deltaCo2;
let daysCo2;
let heuresCo2;
let dateDuJour;
let dateDemarrageCycle;
let difference;
let jourDuCycle;
let heureDuCycle;
let minuteDuCycle;
let heureMinute;
let valeurAxeX;

//! -----------------------------------------------------------

//! Demande de mesure à la master.

const url = 'http://localhost:5000/getCo2/' + numSalle;
//const url = 'http://192.168.0.10:5000/getCO2/' + numSalle;
// console.log('url : ', url);

const getTauxCo2 = new Promise((resolve, reject) => {
  //

  http
    .get(url, (resp) => {
      //
      resp.on('data', (chunk) => {
        data += chunk;
        // console.log('data ============>', data);
      });

      resp.on('end', () => {
        // console.log(
        //   'data 2 ============>',
        //   parseFloat(data.split('undefined"')[1])
        // );

        tauxCo2 = parseFloat(data.split('undefined"')[1]);

        // console.log('*************** : ', tauxCo2);
      });
    })

    .on('response', function (resp) {
      if (resp.statusCode === 200) {
        // console.log('Status Code : ', resp.statusCode);
        resolve();
      } else {
        reject();
        console.log('PAS OK');
      }
    })

    .on('error', (err) => {
      console.log('Error: ' + err.message);
    });
});

//! -----------------------------------------------------------

//! Validation de la suite.

let actionGetTauxCo2 = async () => {
  let go = await getTauxCo2;
  return go;
};

//! ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//! Action après validation.

actionGetTauxCo2(tauxCo2)
  //
  //? Récupération de la consigne.

  .then(() => {
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
              // console.log(
              //   cyan,
              //   '[ GESTION CO2 CALCULES  ] La consigne est : ' + consigne
              // );
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
              deltaCo2 = tauxCo2 - consigne;
              console.log(
                cyan,
                '[ GESTION CO2 CALCULES  ] Le taux de Co2 est de :' +
                tauxCo2 +
                ' ppm'
              );
              // console.log(
              //   cyan,
              //   '[ GESTION CO2 CALCULES  ] Le delta de Co2 est de :',
              //   deltaCo2 + ' ppm'
              // );
            };
            calcDelta();
          }, 1000);
          //*------------------------------------------------------------
        });
    };
    recuperationConsigneCo2();
  })

  //? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //? Construction de la valeur de l'axe x.
  .then(() => {
    let getDateDemarrageCycle = () => {
      axios
        .get(
          'http://localhost:3003/api/gestionCourbeRoutes/getDateDemarrageCycle'
        )
        .then((response) => {
          //   console.log(
          //     'Date démarrage du cycle :---:',
          //     response.data.dateDemarrageCycle.dateDemarrageCycle
          //   );
          //* Date du jour.
          dateDuJour = new Date();
          // console.log('Date du Jour :---------------------:', dateDuJour);
          //* --------------------------------------------------
          //* Date de demarrage du cycle
          dateDemarrageCycle = new Date(
            response.data.dateDemarrageCycle.dateDemarrageCycle
          );
          // console.log(
          //   'La date de démarrage du cycle :----:',
          //   dateDemarrageCycle
          // );
          //* --------------------------------------------------
          //* Calcul du nombre de jour du cycle.
          let nbJourBrut = dateDuJour.getTime() - dateDemarrageCycle.getTime();
          jourDuCycle = Math.round(nbJourBrut / (1000 * 3600 * 24)) + 1;
          // console.log('Le jour du cycle  ', jourDuCycle, ' jours');
          //* --------------------------------------------------
          //* Affichage de l'heure.
          heureDuCycle = new Date().getHours();
          minuteDuCycle = new Date().getMinutes();
          heureMinute = heureDuCycle + 'h' + minuteDuCycle;
          // console.log("l'heure du cycle :-----------------:", heureMinute);
          //* --------------------------------------------------
          //* Valeure de l'axe x.
          valeurAxeX = 'Jour ' + jourDuCycle + ' - ' + heureMinute;
          // console.log(
          //   cyan,
          //   "[ GESTION CO2 CALCULES  ] Valeure de l'axe x : ",
          //   valeurAxeX
          // );
          //* --------------------------------------------------
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getDateDemarrageCycle();
  })

  //? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //? Enregistrement en base de donnes.

  .then(() => {
    setTimeout(() => {
      let enregistrement = () => {
        const newVal = gestionCo2Models
          .create({
            tauxCo2: tauxCo2,
            deltaCo2: deltaCo2,
            daysCo2: daysCo2,
            heuresCo2: heuresCo2,
            consigne: consigne,
            valeurAxeX: valeurAxeX,
            jourDuCycle: jourDuCycle,
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
      enregistrement();
    }, 2000);
  })

  //? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //? Catch des erreurs.

  .catch((error) => {
    console.log(cyan, '[ GESTION CO2 CALCULES  ] Erreur Co2', error);
  });

//! ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
