//! Les constantes.

const Gpio = require('onoff').Gpio;
const sequelize = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../models');

//! -------------------------------------------------- !

//! variables pour tests.

// let etatRelay;

// let pas;
// let objectif;

// let etatVanneBDD;
// let deltaAirPrecedent;

// let temperatureCorrigee = 16.9
// let consigne = 16;
// let delta = temperatureCorrigee - consigne;
// console.log('🟢 TEST | Delta ==> ', delta);

// let difDelta = -0.3;

//! -------------------------------------------------- !

// ! Les fonctions appelées

//? Mise à jour de l'état des relay.

let etatRelay;

let miseAjourEtatRelay = () => {
  gestionAirModels
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);
      lastId = id.maxid;

      gestionAirModels
        .update(
          { actionRelay: actionRelay, etatRelay: etatRelay },
          { where: { id: lastId } }
        )

        .then(function (result) {
          // console.log('Nb mise à jour data =======> ' + result);
        })

        .catch((err) => console.log(err));
    });
};

//? --------------------------------------------------

//! --------------------------------------------------

//! Les fonctions asynchrones.

//? Récupération de la température Sec.

let getTemperatureSec;

const gestionHumsModels = db.gestionHum;

let recupérationTempératureSec = () => {
  return new Promise((resolve, reject) => {
    try {
      gestionHumsModels
        .findOne({
          attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
          raw: true,
        })
        .then((id) => {
          // console.log(id.maxid);

          gestionHumsModels
            .findOne({
              where: { id: id.maxid },
            })
            .then((result) => {
              //  console.log(result);

              getTemperatureSec = result['valeursMesureSec180'];

              // console.log(
              //   '✅ %c SUCCÈS ==> gestions Air ==> Récupération de la température ==> ',
              //   'color: green',
              //   getTemperatureSec
              // );

              // console.log(
              //   "✅ %c SUCCÈS ==> gestions Air ==> Récupération de la température Type ==> ",
              //   'color: green', typeof getTemperatureSec
              // );
            })
            .then(() => {
              resolve();
            });
        });
    } catch (error) {
      console.log(
        '❌ %c ERREUR ==> gestions Air ==> Récupération de la consigne',
        'color: orange',
        error
      );

      reject();
    }
  });
};

//? --------------------------------------------------

//? Récupération de la consigne.

let consigne;
let objectif;

const gestionAirsDataModels = db.gestionAirData;

let recupérationDeLaConsigne = () => {
  return new Promise((resolve, reject) => {
    try {
      gestionAirsDataModels
        .findOne({
          attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
          raw: true,
        })
        .then((id) => {
          // console.log(id.maxid);

          gestionAirsDataModels
            .findOne({
              where: { id: id.maxid },
            })
            .then((result) => {
              // console.log(result);

              lastId = result['id'];
              // console.log('LastId :   ', lastId);

              consigne = result['consigneAir'];

              // console.log(
              //     "✅ %c SUCCÈS ==> gestions Air ==> Récupération de la Consigne Air ==> ",
              //     'color: green', consigne
              // );

              objectif = result['objectifAir'];

              // console.log(
              //     "✅ %c SUCCÈS ==> gestions Air ==> Récupération de l'Objectif Air ===> ",
              //     'color: green', objectif
              // );
            })
            .then(() => {
              resolve();
            });
        });
    } catch (error) {
      console.log(
        '❌ %c ERREUR ==> gestions Air ==> Récupération de la consigne',
        'color: orange',
        error
      );

      reject();
    }
  });
};

//? --------------------------------------------------

//? Récupération de l'étalonnage.

const gestionAirEtalonnageModels = db.etalonnageAir;

let recuperationDeEtalonage = () => {
  return new Promise((resolve, reject) => {
    try {
      gestionAirEtalonnageModels
        .findOne({
          attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
          raw: true,
        })
        .then((id) => {
          // console.log(id.maxid);

          gestionAirEtalonnageModels
            .findOne({
              where: { id: id.maxid },
            })
            .then((result) => {
              // console.log(result);

              etalonnage = result['etalonnageAir'];

              // console.log(
              //   "✅ %c SUCCÈS ==> gestions Air ==> Récupération de l'étalonage",
              //   'color: green',
              //   etalonnage
              // );

              // console.log(
              //   "✅ %c SUCCÈS ==> gestions Air ==> Récupération de l'étalonage Type",
              //   'color: green',
              //   typeof etalonnage
              // );
            })
            .then(() => {
              resolve();
            });
        });
    } catch (error) {
      console.log(
        "❌ %c ERREUR ==> gestions Air ==> Récupération de l'étalonage",
        'color: orange',
        error
      );

      reject();
    }
  });
};

//? --------------------------------------------------

//? Récupération de l'état de la vanne froid.

let etatVanneBDD;
// let deltaAirPrecedent;

const gestionAirModels = db.gestionAir;

let recuperationEtatVanneFroid = () => {
  return new Promise((resolve, reject) => {
    try {
      gestionAirModels
        .findOne({
          attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
          raw: true,
        })
        .then((id) => {
          // console.log(id.maxid);

          gestionAirModels
            .findOne({
              where: { id: id.maxid },
            })
            .then((result) => {
              // console.log('⭐ Result gestionAirModels ====> ', result);

              etatVanneBDD = result['etatRelay'];

              // console.log(
              //     "✅ %c SUCCÈS ==> gestions Air ==> Récupération de l'état de la vanne froid",
              //     'color: green', etatVanneBDD
              // );

              deltaAirPrecedent = result['deltaAir'];

              // console.log(
              //     "✅ %c SUCCÈS ==> gestions Air ==> Récupération du delta air",
              //     'color: green', deltaAirPrecedent
              // );
            })
            .then(() => {
              resolve();
            });
        });
    } catch (error) {
      console.log(
        "❌ %c ERREUR ==> gestions Air ==> Récupération de l'état de la vanne froid",
        'color: orange',
        error
      );

      reject();
    }
  });
};

//? --------------------------------------------------

//? Construction de la valeur de l'axe x.

let dateDuJour;
let dateDemarrageCycle;
let jourDuCycle;
let heureDuCycle;
let minuteDuCycle;
let heureMinute;
let valeurAxeX;

const gestionCourbesModels = db.gestionCourbes;

let constructionAxeX = () => {
  return new Promise((resolve, reject) => {
    try {
      gestionCourbesModels
        .findOne({
          attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
          raw: true,
        })
        .then((id) => {
          // console.log('Le dernier id de gestionAir est : ', id);
          // console.log(id.maxid);

          gestionCourbesModels
            .findOne({
              where: { id: id.maxid },
            })
            .then((result) => {
              //* date démarrage du cycle.

              // dateDemarrageCycle = result['dateDemarrageCycle'];

              // console.log(
              //     "✅ %c SUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe X",
              //     'color: green', dateDemarrageCycle
              // );

              //* --------------------------------------------------

              //* Date de démarrage du cycle.

              dateDemarrageCycle = new Date(result['dateDemarrageCycle']);

              // console.log(
              //     "✅ %c SUCCÈS ==> gestions Air ==> Date de démarrage du cycle ===>",
              //     'color: green', dateDemarrageCycle
              // );

              //* --------------------------------------------------

              //* Date du jour.

              dateDuJour = new Date();

              // console.log(
              //     "✅ %c SUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe X ===> Date du jour",
              //     'color: green', dateDuJour
              // );

              //* --------------------------------------------------

              //* Calcul du nombre de jour du cycle.

              let nbJourBrut =
                dateDuJour.getTime() - dateDemarrageCycle.getTime();
              jourDuCycle = Math.round(nbJourBrut / (1000 * 3600 * 24)) + 1;

              // console.log(
              //     "✅ %c SUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe X ===> Calcul du nombre de jour du cycle",
              //     'color: green', jourDuCycle
              // );

              //* --------------------------------------------------

              //* Affichage de l'heure.

              heureDuCycle = new Date().getHours();
              minuteDuCycle = new Date().getMinutes();
              heureMinute = heureDuCycle + 'h' + minuteDuCycle;

              // console.log(
              //     "✅ %c SUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe x ===> Affichage de l'heure",
              //     'color: green', heureMinute
              // );

              //* --------------------------------------------------

              //* Valeure de l'axe x.

              valeurAxeX = 'Jour ' + jourDuCycle + ' - ' + heureMinute;

              // console.log(
              //     "✅ %c SUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe x ===> Valeure de l'axe X",
              //     'color: green', valeurAxeX
              // );

              //* --------------------------------------------------
            })

            .then(() => {
              resolve();
            });
        });
    } catch (error) {
      console.log(
        "❌ %c ERREUR ==> gestions Air ==> Construction de la valeur de l'axe X",
        'color: orange',
        error
      );

      reject();
    }
  });
};

//? --------------------------------------------------

//? Mesure de la température Air.

let mcpBroche = 0;
const mcpadc = require('mcp-spi-adc');

let getTemperatures = () => {
  return new Promise((resolve, reject) => {
    try {
      let temps = 0;

      let count = () => {
        temps = temps++;

        //console.log(temps++);

        if (temps++ === 9) {
          clearInterval(conteur);
        }

        // console.log(jaune, '[ GESTION SUBSTRAT CALCULES  ] temps', temps);

        const tempSensor = mcpadc.open(mcpBroche, { speedHz: 20000 }, (err) => {
          if (err) throw err;

          tempSensor.read((err, reading) => {
            if (err) throw err;
            listValAir.push(reading.value * 40);

            // console.log(
            //   "✅ %c SUCCÈS ==> gestions Air ==> Mesure de la température Air",
            //   'color: green', listValAir
            // );

            if (listValAir.length >= 10) {
              // console.log('listValAir.length >=10');
              resolve();
            }
          });
        });
      };

      let conteur = setInterval(count, 1000);
    } catch (error) {
      console.log(
        '❌ %c ERREUR ==> gestions Air ==> Mesure de la température Air',
        'color: orange',
        error
      );

      reject();
    }
  });
};

//? --------------------------------------------------

//? Calcule de la température moyenne.

let listValAir = [];

let temperatureMoyenneAir;

let calculeDeLaTemperatureMoyenne = () => {
  return new Promise((resolve, reject) => {
    try {
      let arrayLength = listValAir.length;
      // console.log('Nb valeurs de listValAir :', arrayLength);

      const reducer = (accumulator, curr) => accumulator + curr;
      let sumlistValAir = listValAir.reduce(reducer);
      // console.log('Somme valeurs listValAir : ', sumlistValAir);

      temperatureMoyenneAir =
        Math.round((sumlistValAir / arrayLength) * 100) / 100;

      // console.log(
      //     "✅ %c SUCCÈS ==> gestions Air ==> Temperature air moyenne",
      //     'color: green ', temperatureMoyenneAir
      // );

      resolve();
    } catch (error) {
      console.log(
        '❌ %c ERREUR ==> gestions Air ==> Temperature air moyenne',
        'color: orange',
        error
      );

      reject();
    }
  });
};

//? --------------------------------------------------

//? Définition de la température air corrigée.

let temperatureCorrigee;

let definitionTemperatureAirCorrigee = () => {
  return new Promise((resolve, reject) => {
    try {
      temperatureCorrigee = getTemperatureSec + etalonnage;

      // console.log(
      //   '✅ %c SUCCÈS ==> gestions Air ==> Définition de la température air corrigée ===> ',
      //   'color: green',
      //   temperatureCorrigee
      // );

      resolve();
    } catch (error) {
      console.log(
        '❌ %c ERREUR ==> gestions Air ==> Définition de la température air corrigée',
        'color: orange',
        error
      );

      reject();
    }
  });
};

//? --------------------------------------------------

//? Calcul du delta.

// let delta = -0.4;

let definitionDuDelta = () => {
  return new Promise((resolve, reject) => {
    try {
      delta = parseFloat((getTemperatureSec - consigne).toFixed(1));

      // console.log(
      //     "✅ %c SUCCÈS ==> gestions Air ==> Définition du delta ===> ",
      //     'color: green', delta
      // );

      resolve();
    } catch (error) {
      console.log(
        '❌ %c ERREUR ==> gestions Air ==> Définition du delta',
        'color: orange'
      );

      reject();
    }
  });
};

//? --------------------------------------------------

//? Définition des actions.

const ouvertureRelay = 23; //* 22.
const fermetureRelay = 22; //* 23.

//! Variable de tests.
// let delta = 1.5; //* L559
// let deltaAirPrecedent = 0.5;
//! --------------------------------------------------

let definitionDesActions = () => {
  return new Promise((resolve, reject) => {
    try {
      if (delta <= -0.3) {
        //! 1 ) Delta :  <= -0.3

        console.log(
          '🔺 Action sélectionnée ==> gestions Air ==> Delta :  <= -0.3'
        );

        let fermetureTotalVanne = () => {
          return new Promise((resolve, reject) => {
            if (delta) {
              //
              const relay = new Gpio(fermetureRelay, 'out');
              // const relay = new Gpio(27, 'in');

              console.log(
                '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (<= -0.3) | Fermeture vanne pour 40 secondes.',
                'color: green'
              );

              actionRelay = 1;
              etatRelay = etatRelay;
              miseAjourEtatRelay();

              resolve();
            } else {
              console.log(
                '❌ %c ERREUR ==> gestions Air ==> Actions delta (<= -0.3) | Fermeture vanne pour 40 secondes.',
                'color: orange'
              );

              reject();
            }
          });
        };

        let stopFermetureTotalVanne = () => {
          return new Promise((resolve, reject) => {
            if (delta) {
              setTimeout(() => {
                const relay = new Gpio(fermetureRelay, 'in');
                //const relay = new Gpio(27, 'in');

                console.log(
                  '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (<= -0.3) | Stope fermeture vanne pour 40 secondes.',
                  'color: green'
                );

                actionRelay = 0;
                etatRelay = 0;
                miseAjourEtatRelay();

                resolve();
              }, 40000);
            } else {
              console.log(
                '❌ %c ERREUR ==> gestions Air ==> Actions delta (<= -0.3) | Stope fermeture vanne pour 40 secondes.',
                'color: orange'
              );

              reject();
            }
          });
        };

        let resolveAction = async () => {
          console.log(
            '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (<= -0.3) | Fin des actions.',
            'color: green'
          );

          resolve();
        };

        let handleMyPromise = async () => {
          try {
            await fermetureTotalVanne();
            await stopFermetureTotalVanne();
            await resolveAction();
          } catch (err) {
            console.log(
              '🔺 %c ERREUR ==> gestions Air ==> | delta (<= -0.3):',
              err,
              'color: orange'
            );
          }
        };

        handleMyPromise();
      } else if (delta > -0.3 && delta <= 0) {
        //! 2 ) Delta: > -0.3 & <= 0

        console.log(
          '🔺 Action sélectionnée ==> gestions Air ==> Delta: > -0.3 & <= 0'
        );

        let fermetureTotalVanne = () => {
          return new Promise((resolve, reject) => {
            if (delta) {
              //
              const relay = new Gpio(fermetureRelay, 'out');

              console.log(
                '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Fermeture vanne pour 40 secondes.',
                'color: green'
              );

              actionRelay = 1;
              etatRelay = etatRelay;
              miseAjourEtatRelay();

              resolve();
            } else {
              console.log(
                '❌ %c ERREUR ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Fermeture vanne pour 40 secondes.',
                'color: orange'
              );

              reject();
            }
          });
        };

        let stopFermetureTotalVanne = () => {
          return new Promise((resolve, reject) => {
            if (delta) {
              setTimeout(() => {
                const relay = new Gpio(fermetureRelay, 'in');

                console.log(
                  '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Stope fermeture vanne pour 40 secondes.',
                  'color: green'
                );

                actionRelay = 0;
                etatRelay = 0;
                miseAjourEtatRelay();

                resolve();
              }, 40000);
            } else {
              console.log(
                '❌ %c ERREUR ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Stope fermeture vanne pour 40 secondes.',
                'color: orange'
              );

              reject();
            }
          });
        };

        let ouvertureVanne = () => {
          return new Promise((resolve, reject) => {
            if (delta) {
              //
              const relay = new Gpio(ouvertureRelay, 'out');

              console.log(
                '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Ouverture vanne pour 15 secondes.',
                'color: green'
              );

              actionRelay = 1;
              etatRelay = etatRelay;
              miseAjourEtatRelay();

              resolve();
            } else {
              console.log(
                '❌ %c ERREUR ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Ouverture vanne pour 15 secondes.',
                'color: orange'
              );

              reject();
            }
          });
        };

        let stopOuvertureVanne = () => {
          return new Promise((resolve, reject) => {
            if (delta) {
              setTimeout(() => {
                const relay = new Gpio(ouvertureRelay, 'in');

                console.log(
                  '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Stope fermeture vanne pour 15 secondes.',
                  'color: green'
                );

                actionRelay = 0;
                etatRelay = 37.5;
                miseAjourEtatRelay();

                resolve();
              }, 15000);
            } else {
              console.log(
                '❌ %c ERREUR ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Stope fermeture vanne pour 15 secondes.',
                'color: orange'
              );

              reject();
            }
          });
        };

        let resolveAction = async () => {
          console.log(
            '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Fin des actions.',
            'color: green'
          );

          resolve();
        };

        let handleMyPromise = async () => {
          try {
            await fermetureTotalVanne();
            await stopFermetureTotalVanne();
            // await ouvertureVanne();
            // await stopOuvertureVanne();
            await resolveAction();
          } catch (err) {
            console.log(
              '🔺 %c ERREUR ==> gestions Air ==> | delta (-0.3 & <= 0)',
              err,
              'color: orange'
            );
          }
        };

        handleMyPromise();
      } else if (delta > 0 && delta <= 0.3) {
        //! 3 ) Delta : > 0 & <= 0.3

        console.log(
          '🔺 Action sélectionnée ==> gestions Air ==> Delta : > 0 & <= 0.3'
        );

        let fermetureTotalVanne = () => {
          return new Promise((resolve, reject) => {
            if (delta) {
              //
              const relay = new Gpio(fermetureRelay, 'out');

              console.log(
                '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Fermeture vanne pour 40 secondes.',
                'color: green'
              );

              actionRelay = 1;
              etatRelay = etatRelay;
              miseAjourEtatRelay();

              resolve();
            } else {
              console.log(
                '❌ %c ERREUR ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Fermeture vanne pour 40 secondes.',
                'color: orange'
              );

              reject();
            }
          });
        };

        let stopFermetureTotalVanne = () => {
          return new Promise((resolve, reject) => {
            if (delta) {
              setTimeout(() => {
                const relay = new Gpio(fermetureRelay, 'in');

                console.log(
                  '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Stope fermeture vanne pour 40 secondes.',
                  'color: green'
                );

                actionRelay = 0;
                etatRelay = 0;
                miseAjourEtatRelay();

                resolve();
              }, 40000);
            } else {
              console.log(
                '❌ %c ERREUR ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Stope fermeture vanne pour 40 secondes.',
                'color: orange'
              );

              reject();
            }
          });
        };

        let ouvertureVanne = () => {
          return new Promise((resolve, reject) => {
            if (delta) {
              //
              const relay = new Gpio(ouvertureRelay, 'out');

              console.log(
                '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Ouverture vanne pour 15 secondes.',
                'color: green'
              );

              actionRelay = 1;
              etatRelay = etatRelay;
              miseAjourEtatRelay();

              resolve();
            } else {
              console.log(
                '❌ %c ERREUR ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Ouverture vanne pour 15 secondes.',
                'color: orange'
              );

              reject();
            }
          });
        };

        let stopOuvertureVanne = () => {
          return new Promise((resolve, reject) => {
            if (delta) {
              setTimeout(() => {
                const relay = new Gpio(ouvertureRelay, 'in');

                console.log(
                  '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Stope fermeture vanne pour 15 secondes.',
                  'color: green'
                );

                actionRelay = 0;
                etatRelay = 50;
                miseAjourEtatRelay();

                resolve();
              }, 20000);
            } else {
              console.log(
                '❌ %c ERREUR ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Stope fermeture vanne pour 20 secondes.',
                'color: orange'
              );

              reject();
            }
          });
        };

        let resolveAction = async () => {
          console.log(
            '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (-0.3 & <= 0) | Fin des actions.',
            'color: green'
          );

          resolve();
        };

        let handleMyPromise = async () => {
          try {
            await fermetureTotalVanne();
            await stopFermetureTotalVanne();
            // await ouvertureVanne();
            // await stopOuvertureVanne();
            await resolveAction();
          } catch (err) {
            console.log(
              '🔺 %c ERREUR ==> gestions Air ==> | delta (-0.3 & <= 0)',
              err,
              'color: orange'
            );
          }
        };

        handleMyPromise();
      } else if (delta > 0.3 && delta < 1.5) {
        //! 4 ) Delta : > 0.3 & < 1.5

        console.log(
          '🔺 Action sélectionnée ==> gestions Air ==> Delta : > 0.3 & < 1.5 '
        );

        let difDelta = deltaAirPrecedent - delta;
        console.log('difDelta :', difDelta);

        try {
          if (difDelta >= 0) {
            console.log('=============> difDelta >= 0');

            let preconisation;
            let preconisationBrut = (difDelta / 0.05) * 1000;
            //console.log('preconisationBrut :', preconisationBrut);

            let fermetureTotalVanne = () => {
              return new Promise((resolve, reject) => {
                if (delta) {
                  //
                  const relay = new Gpio(fermetureRelay, 'out');

                  console.log(
                    '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (> 0.3 & < 1.5) | Fermeture vanne'
                  );

                  actionRelay = 1;
                  etatRelay = etatRelay;
                  miseAjourEtatRelay();

                  resolve();
                } else {
                  console.log(
                    '❌ %c ERREUR ==> gestions Air ==> Actions delta (> 0.3 & < 1.5) | Fermeture vanne',
                    'color: orange'
                  );

                  reject();
                }
              });
            };

            let stopFermetureTotalVanne = () => {
              return new Promise((resolve, reject) => {
                if (delta) {
                  if (preconisationBrut >= 0) {
                    preconisation = preconisationBrut;
                    // console.log('⭐ gestions Air ==> preconisation : ', preconisation);
                  } else {
                    preconisation = preconisationBrut * -1;
                    //  console.log('⭐ gestions Air ==> preconisation : ', preconisation);
                  }

                  setTimeout(() => {
                    //
                    const relay = new Gpio(fermetureRelay, 'in');

                    console.log(
                      '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (> 0.3 & < 1.5) | Fin fermeture du froid',
                      'color: green'
                    );

                    actionRelay = 0;
                    etatRelay = (preconisation / 40000) * 100;
                    miseAjourEtatRelay();

                    resolve();
                    //
                  }, preconisation);
                } else {
                  console.log(
                    '❌ %c ERREUR ==> gestions Air ==> Actions delta (> 0.3 & < 1.5) | Fin fermeture du froid',
                    'color: orange'
                  );

                  reject();
                }
              });
            };

            let resolveAction = async () => {
              console.log(
                '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (> 0.3 & < 1.5) | Fin des actions.',
                'color: green'
              );

              resolve();
            };

            let handleMyPromise = async () => {
              try {
                await fermetureTotalVanne();
                await stopFermetureTotalVanne();
                await resolveAction();
              } catch (err) {
                console.log(
                  '🔺 %c ERREUR ==> gestions Air ==> | delta (-0.3 & <= 0)',
                  err,
                  'color: orange'
                );
              }
            };

            handleMyPromise();
          } else {
            console.log('=============> difDelta < 0');

            let preconisation;
            let preconisationBrut = (difDelta / 0.05) * 1000;
            //console.log('preconisationBrut :', preconisationBrut * -1);

            let ouvertureVanne = () => {
              return new Promise((resolve, reject) => {
                if (delta) {
                  const relay = new Gpio(ouvertureRelay, 'out');

                  console.log(
                    '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (> 0.3 & < 1.5) | Début ouverture du froid',
                    'color: green'
                  );

                  actionRelay = 1;
                  etatRelay = etatRelay;
                  miseAjourEtatRelay();

                  resolve();
                } else {
                  console.log(
                    '❌ %c ERREUR ==> gestions Air ==> Actions delta (> 0.3 & < 1.5) | Début ouverture du froid',
                    'color: orange'
                  );

                  reject();
                }
              });
            };

            let arretOuvertureVanne = () => {
              return new Promise((resolve, reject) => {
                if (delta) {
                  //

                  if (preconisationBrut >= 0) {
                    preconisation = preconisationBrut;
                    //   console.log('⭐ gestions Air ==> preconisation : ', preconisation);
                  } else {
                    preconisation = preconisationBrut * -1;
                    // console.log('⭐ gestions Air ==> preconisation : ', preconisation);
                  }

                  setTimeout(() => {
                    //
                    const relay_23_OFF = new Gpio(ouvertureRelay, 'in');

                    console.log(
                      '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (> 0.3 & < 1.5) | Fin ouverture du froid',
                      'color: green'
                    );

                    actionRelay = 0;
                    etatRelay = (preconisation / 40000) * 100;
                    miseAjourEtatRelay();

                    resolve();
                    //
                  }, preconisation);
                } else {
                  console.log(
                    '❌ %c ERREUR ==> gestions Air ==> Actions delta (> 0.3 & < 1.5) | Fin ouverture du froid',
                    'color: orange'
                  );

                  reject();
                }
              });
            };

            let resolveAction = async () => {
              console.log(
                '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (> 0.3 & < 1.5) | Fin des actions.',
                'color: green'
              );

              resolve();
            };

            let handleMyPromise = async () => {
              try {
                await ouvertureVanne();
                await arretOuvertureVanne();
                await resolveAction();
              } catch (err) {
                console.log('🔺 Erreur (> 0.3 & < 1.5) :', err);
              }
            };

            handleMyPromise();
          }
        } catch (error) {
          console.log(
            '🔺 %c ERREUR ==> gestions Air ==> | delta (> 0.3 & < 1.5 )',
            err,
            'color: orange'
          );
        }
      } else if (delta >= 1.5) {
        //! 5 ) Delta : >=  1.5

        console.log(
          '🔺 Action sélectionnée ==> gestions Air ==> Delta : >=  1.5'
        );

        let ouvertureVanne = () => {
          return new Promise((resolve, reject) => {
            if (delta) {
              //
              const relay = new Gpio(ouvertureRelay, 'out');
              //const relay = new Gpio(27, 'in');

              console.log(
                '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (>=  1.5) | Ouverture vanne pour 40 secondes.',
                'color: green'
              );

              actionRelay = 1;
              etatRelay = etatRelay;
              miseAjourEtatRelay();

              resolve();
            } else {
              console.log(
                '❌ %c ERREUR ==> gestions Air ==> Actions delta (>=  1.5) | Ouverture vanne pour 40 secondes.',
                'color: orange'
              );

              reject();
            }
          });
        };

        let stopOuvertureVanne = () => {
          return new Promise((resolve, reject) => {
            if (delta) {
              setTimeout(() => {
                const relay = new Gpio(ouvertureRelay, 'in');
                // const relay = new Gpio(27, 'in');

                console.log(
                  '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (>=  1.5) | Stope fermeture vanne pour 40 secondes.',
                  'color: green'
                );

                actionRelay = 0;
                etatRelay = 100;
                miseAjourEtatRelay();

                resolve();
              }, 40000);
            } else {
              console.log(
                '❌ %c ERREUR ==> gestions Air ==> Actions delta (>=  1.5) | Stope fermeture vanne pour 40 secondes.',
                'color: orange'
              );

              reject();
            }
          });
        };

        let resolveAction = async () => {
          console.log(
            '✅ %c SUCCÈS ==> gestions Air ==> Actions delta (>=  1.5) | Fin des actions.',
            'color: green'
          );

          resolve();
        };

        let handleMyPromise = async () => {
          try {
            await ouvertureVanne();
            await stopOuvertureVanne();
            await resolveAction();
          } catch (err) {
            console.log(
              '🔺 %c ERREUR ==> gestions Air ==> | delta (>=  1.5)',
              err,
              'color: orange'
            );
          }
        };

        handleMyPromise();
      }
    } catch (error) {
      console.log(
        '❌ %c ERREUR ==> gestions Air ==> Définition des actions',
        'color: orange',
        error
      );

      reject();
    }
  });
};

//? --------------------------------------------------

//? Enregistrement des datas dans la base.

let enregistrementDatas = () => {
  return new Promise((resolve, reject) => {
    try {
      gestionAirModels
        .create({
          temperatureAir: getTemperatureSec,
          deltaAir: delta,
          actionRelay: actionRelay,
          etatRelay: etatRelay,
          consigne: consigne,
          valeurAxeX: valeurAxeX,
          jourDuCycle: jourDuCycle,
        })

        .then(function (result) {

          // console.log(
          //   "✅ %c SUCCÈS ==> gestions Air ==> Enregistrement des datas dans la base de données sous l'id :",
          //   'color: green',
          //   result['dataValues'].id
          // );

        })

        .then(() => {
          resolve();
        });
    } catch (error) {
      console.log(
        '❌ %c ERREUR ==> gestions Air ==> Enregistrement des datas dans la base',
        'color: orange',
        error
      );

      reject();
    }
  });
};

//? --------------------------------------------------

//! -------------------------------------------------- !

//! Exécution des fonctions asynchrones.

let handleMyPromise = async () => {
  try {
    await recupérationTempératureSec();

    await recupérationDeLaConsigne();

    // await recuperationDeEtalonage();

    await recuperationEtatVanneFroid();

    await constructionAxeX();

    //// await getTemperatures();

    //// await calculeDeLaTemperatureMoyenne();

    //// await definitionTemperatureAirCorrigee();

    await definitionDuDelta();

    await definitionDesActions();

    await enregistrementDatas();
  } catch (err) {
    console.log('err finale :', err);
  }
};

handleMyPromise();

//! -------------------------------------------------- !
