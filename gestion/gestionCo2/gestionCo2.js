//* Les constantes.

require('dotenv').config();
const cyan = '\x1b[36m';

const http = require('http');
const sequelize = require('sequelize');
const db = require('../../models');
const gestionCo2Models = db.gestionCo2;
const gestionCo2DataModels = db.gestionCo2Data;
const io = require('socket.io-client');
//* -----------------------------------------------------------

//* Les variables.

let tauxCO2 = 2500;
let consigne;
let deltaCo2 = 1000;
let daysCo2;
let heuresCo2;
//* ----------------------------------

//* 1) Initialisation socket.io Client

const socket = io('http://localhost:3001', {
  reconnection: true,
});

socket.on('connect', () => {
  // console.log(cyan,
  //   '[ GESTION CO2 SOCKET IO ] Client gestion Co2 connecté',
  //   socket.id
  // );
});

//* -----------------------------------------------------------

//* 2) Demande de mesure à la master.

async function updateTimeVariateur() {
  new Promise((resolve, reject) => {
    http
      .get('http://192.168.0.10:6000/getCO2/2', (resp) => {
        data = '';

        resp.on('data', (chunk) => {
          data += chunk;
          console.log(
            cyan,
            '[ GESTION CO2 CALCULES  ] Valeur CO2 de la master',
            data
          );

          // Taux de Co2.
          tauxCO2 = parseFloat(data).toFixed(2);
          console.log(
            cyan,
            '[ GESTION CO2 CALCULES  ] Le taux de CO2 est de : ',
            tauxCO2
          );
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
              console.log('LastId :   ', lastId);

              consigne = result['consigneCo2'];
              console.log('Consigne : ', consigne);

              pas = result['pasCo2'];
              console.log('Pas :      ', pas);

              objectif = result['objectifCo2'];
              console.log('Objectif : ', objectif);
            })
            .then(() => {
              // Calcule des jours et des heures

              let CalculeNombreJour = () => {
                if (
                  consigne == 0 ||
                  consigne == '' ||
                  consigne == null ||
                  objectif == 0 ||
                  objectif == '' ||
                  objectif == null ||
                  pas == 0 ||
                  pas == '' ||
                  pas == null
                ) {
                  console.log(
                    cyan,
                    '[ GESTION CO2 CALCULES  ] Pas de paramètre pas de calcule des jours'
                  );
                  return;
                } else {
                  let dureeDescenteAir = ((consigne - objectif) / pas) * 12;

                  // console.log('Durée Descente Air', dureeDescenteAir);

                  let totalHeures = dureeDescenteAir;

                  daysCo2 = Math.floor(totalHeures / 24);

                  totalHeures %= 360;

                  heuresCo2 = Math.floor(totalHeures / 36);

                  console.log(
                    'La durée de la descente est de :  ',
                    daysCo2 + ' Jours ' + heuresCo2 + ' Heures '
                  );
                }
              };

              CalculeNombreJour();

              //------------------------------------------------------------
            });
        });
    };

    recuperationConsigneCo2();

    //------------------------------------------------------------
  })

  //* 3) Calcule du delta Co2

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

  //* 4) Enregistrement en basez de donnes.

  .then(() => {
    let enregistrament = () => {
      const newVal = gestionCo2Models
        .create({
          tauxCo2: tauxCO2,
          deltaCo2: deltaCo2,
          daysCo2: daysCo2,
          heuresCo2: heuresCo2,
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

    enregistrament();
  })

  //* 5) Transmission des données par Socket IO.

  .then(() => {
    socket.emit('affichageTauxCo2', {
      valeureTauxCo2: tauxCO2,
      valeureConsigneCo2: consigne,
      valeureDeltaCo2: deltaCo2,
      valeureDaysCo2: daysCo2,
      valeureHeuresCo2: heuresCo2,
    });
  });
