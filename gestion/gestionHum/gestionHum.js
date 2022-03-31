//! Les constantes.

require('dotenv').config();
const axios = require('axios');
const magenta = '\x1b[35m';
const mcpadc = require('mcp-spi-adc');
const Gpio = require('onoff').Gpio;
const sequelize = require('sequelize');
const db = require('../../models');
const gestionHumModels = db.gestionHum;
const gestionHumDataModels = db.gestionHumData;
const gestionHumEtallonnageModels = db.etalonnageHum;
const gestionSecEtallonnageModels = db.etalonnageSec;


//! -------------------------------------------------- !

//! Les variables.

let mcpBrocheSec = 0;
let mcpBrocheHum = 1;
let tauxHumidite;
let consigne;
let valeursMesureSec180;
let valeursMesureSec180Corrigee;
let valeursMesureHum90;
let valeursMesureHum90Corrigee;
let pas;
let objectif;
let days;
let heures;
let correspondancePressions;
let correspondancePressionsHum;
let lastId;
let valeurEtalonnageSec;
let valeurEtalonnageHum;
let dateDuJour;
let dateDemarrageCycle;
let difference;
let jourDuCycle;
let heureDuCycle;
let minuteDuCycle;
let heureMinute;
let valeurAxeX;

//! -------------------------------------------------- !

//! Les tableaux.

listValSec = [];
listValHum = [];

//! -------------------------------------------------- !

// Récupération de la consigne

let recuperationConsigneAir = () => {
  gestionHumDataModels
    .findOne({
      attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log(id.maxid);

      gestionHumDataModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((result) => {
          // console.log(result);

          lastId = result['id'];
          // console.log('LastId :   ', lastId);

          consigne = result['consigneHum'];
          // console.log('Consigne : ', consigne);

          pas = result['pasHum'];
          // console.log('Pas :      ', pas);

          objectif = result['objectifHum'];
          // console.log('Objectif : ', objectif);
        });
    });
};
recuperationConsigneAir();

//! -------------------------------------------------- !-

// Récupération de l'étalonage

let recuperationEtalonnageSec = () => {
  gestionSecEtallonnageModels
    .findOne({
      attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log(id.maxid);

      gestionSecEtallonnageModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((result) => {
          // console.log(result);

          valeurEtalonnageSec = result['etalonnageSec'];
          // console.log('========> Valeur etalonage Sec : ', valeurEtalonnageSec);
        });
    });
};
recuperationEtalonnageSec();

let recuperationEtalonnageHum = () => {
  gestionHumEtallonnageModels
    .findOne({
      attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log(id.maxid);

      gestionHumEtallonnageModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((result) => {
          // console.log(result);

          valeurEtalonnageHum = result['etalonnageHum'];
          // console.log('========> Valeur etalonage Hum : ', valeurEtalonnageHum);
        });
    });
};
recuperationEtalonnageHum();

//! -------------------------------------------------- !-

//! Construction de la valeur de l'axe x.

let getDateDemarrageCycle = () => {
  axios
    .get('http://localhost:3003/api/gestionCourbeRoutes/getDateDemarrageCycle')
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
      // console.log('La date de démarrage du cycle :----:', dateDemarrageCycle);
      //* --------------------------------------------------

      //* Affichage du nombre de jour du cycle.
      difference = Math.abs(dateDuJour - dateDemarrageCycle);
      jourDuCycle = Math.round(difference / (1000 * 3600 * 24)) + 1;
      console.log('Nombre de jour du cycle :----------:', jourDuCycle);
      //* --------------------------------------------------

      //* Affichage de l'heure.
      heureDuCycle = new Date().getHours();
      minuteDuCycle = new Date().getMinutes();
      heureMinute = heureDuCycle + 'h' + minuteDuCycle;
      // console.log("l'heure du cycle :-----------------:", heureMinute);
      //* --------------------------------------------------

      //* Valeure de l'axe x.
      valeurAxeX = 'Jour ' + jourDuCycle + ' - ' + heureMinute;
      // console.log("Valeure de l'axe x :---------------:", valeurAxeX);
      //* --------------------------------------------------
    })
    .catch((error) => {
      console.log(error);
    });
};
getDateDemarrageCycle();

//! -------------------------------------------------- !

//* ➖ ➖ ➖ ➖ ➖ ➖ LANCEMENT VENTILATEUR ➖ ➖ ➖ ➖ ➖ ➖ //
let ventilateur = () => {
  const realyOn = new Gpio(17, 'out');

  // console.log(magenta, '[ GESTION HUM CALCULES  ] Activation du ventilateur.');
};
ventilateur();

setTimeout((ventilateur) => {
  const realyOff = new Gpio(17, 'in');

  // console.log(
  //   magenta,
  //   '[ GESTION HUM CALCULES  ] Déactivation du ventilateur.'
  // );
}, 180000);

//*! ➖ ➖ ➖ ➖ ➖ ➖ MESURES SUR 180 SECONDES ➖ ➖ ➖ ➖ ➖ ➖ //

// Fonction moyenne
function ArrayAvg(listValSec) {
  let i = 0,
    summ = 0,
    ArrayLen = listValSec.length;
  while (i < ArrayLen) {
    summ = summ + listValSec[i++];
  }
  return summ / ArrayLen;
}
// FIN Fonction moyenne

let calculeTemperatureMoyenneSec = () => {
  return new Promise((resolve) => {
    // Compteur.
    let tempsSec = 0;

    let countSec = () => {
      tempsSec = tempsSec++;
      //console.log(temps++);
      if (tempsSec++ === 179) {
        clearInterval(compteur);
      }

      // console.log('tempsSec', tempsSec);
      // FIN Compteur.

      // Ma fonction.
      const tempSensor = mcpadc.open(
        mcpBrocheSec,
        { speedHz: 20000 },
        (err) => {
          if (err) throw err;

          if (tempsSec >= 0 && tempsSec <= 179) {
            tempSensor.read((err, reading) => {
              if (err) throw err;
              listValSec.push(reading.value * 40);
              // console.log('listValSec', listValSec);
            });
          }
        }
      );

      // FIN Ma fonction.
    };
    setTimeout(() => {
      resolve(ArrayAvg(listValSec));
    }, 180500);

    let compteur = setInterval(countSec, 1000);
  });
};

//! -------------------------------------------------- !-
let resultatsSec = async () => {
  let temperatureMoyenneAirSec = await calculeTemperatureMoyenneSec();

  return temperatureMoyenneAirSec;
};

resultatsSec()
  .then((temperatureMoyenneAirSec) => {
    // Calcule de la température.

    valeursMesureSec180 = parseFloat(temperatureMoyenneAirSec.toFixed(1));
    // console.log(
    //   magenta,
    //   "[ GESTION HUM CALCULES  ] Temperature Moyenne de l'air Sec: ",
    //   valeursMesureSec180
    // );

    valeursMesureSec180Corrigee = parseFloat(
      valeursMesureSec180 + valeurEtalonnageSec
    ).toFixed(1);

    // console.log(
    //   magenta,
    //   "[ GESTION HUM CALCULES  ] Temperature Moyenne de l'air Sec corrigée: ",
    //   valeursMesureSec180Corrigee
    // );

    // Calcule du delta.

    // delta = parseFloat((consigne - valeursMesureSec180Corrigee).toFixed(1));
    // console.log(magenta, '[ GESTION HUM CALCULES  ] Le delta est de : ', delta);
  })

  //! Tableau de correspondance sec.
  .then(() => {
    let temp = valeursMesureSec180Corrigee;

    let CorrespondanceHum = () => {
      if (temp == 10) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   12.28
        // );
        correspondancePressions = 12.28;
      } else if (temp == 10.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   12.364
        // );
        correspondancePressions = 12.364;
      } else if (temp == 10.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   12.448
        // );
        correspondancePressions = 12.448;
      } else if (temp == 10.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   12.532
        // );
        correspondancePressions = 12.532;
      } else if (temp == 10.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   12.616
        // );
        correspondancePressions = 12.616;
      } else if (temp == 10.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   12.7
        // );
        correspondancePressions = 12.7;
      } else if (temp == 10.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   12.784
        // );
        correspondancePressions = 12.784;
      } else if (temp == 10.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   12.868
        // );
        correspondancePressions = 12.868;
      } else if (temp == 10.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   12.952
        // );
        correspondancePressions = 12.952;
      } else if (temp == 10.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   13.036
        // );
        correspondancePressions = 13.036;
      } else if (temp == 11) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   13.12
        // );
        correspondancePressions = 13.12;
      } else if (temp == 11.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   13.21
        // );
        correspondancePressions = 13.21;
      } else if (temp == 11.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   13.3
        // );
        correspondancePressions = 13.3;
      } else if (temp == 11.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   13.39
        // );
        correspondancePressions = 13.39;
      } else if (temp == 11.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   13.48
        // );
        correspondancePressions = 13.48;
      } else if (temp == 11.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   13.57
        // );
        correspondancePressions = 13.57;
      } else if (temp == 11.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   13.66
        // );
        correspondancePressions = 13.66;
      } else if (temp == 11.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   13.75
        // );
        correspondancePressions = 13.75;
      } else if (temp == 11.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   13.84
        // );
        correspondancePressions = 13.84;
      } else if (temp == 11.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   13.93
        // );
        correspondancePressions = 13.93;
      } else if (temp == 12) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   14.02
        // );
        correspondancePressions = 14.02;
      } else if (temp == 12.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   14.115
        // );
        correspondancePressions = 14.115;
      } else if (temp == 12.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   14.21
        // );
        correspondancePressions = 14.21;
      } else if (temp == 12.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   14.305
        // );
        correspondancePressions = 14.305;
      } else if (temp == 12.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   14.4
        // );
        correspondancePressions = 14.4;
      } else if (temp == 12.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   14.495
        // );
        correspondancePressions = 14.495;
      } else if (temp == 12.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   14.59
        // );
        correspondancePressions = 14.59;
      } else if (temp == 12.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   14.685
        // );
        correspondancePressions = 14.685;
      } else if (temp == 12.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   14.78
        // );
        correspondancePressions = 14.78;
      } else if (temp == 12.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   14.875
        // );
        correspondancePressions = 14.875;
      } else if (temp == 13) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   14.97
        // );
        correspondancePressions = 14.97;
      } else if (temp == 13.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   15.071
        // );
        correspondancePressions = 15.071;
      } else if (temp == 13.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   15.172
        // );
        correspondancePressions = 15.172;
      } else if (temp == 13.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   15.273
        // );
        correspondancePressions = 15.273;
      } else if (temp == 13.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   15.374
        // );
        correspondancePressions = 15.374;
      } else if (temp == 13.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   15.475
        // );
        correspondancePressions = 15.475;
      } else if (temp == 13.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   15.576
        // );
        correspondancePressions = 15.576;
      } else if (temp == 13.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   15.677
        // );
        correspondancePressions = 15.677;
      } else if (temp == 13.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   15.778
        // );
        correspondancePressions = 15.778;
      } else if (temp == 13.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   15.879
        // );
        correspondancePressions = 15.879;
      } else if (temp == 14) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   15.98
        // );
        correspondancePressions = 15.98;
      } else if (temp == 14.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   16.087
        // );
        correspondancePressions = 16.087;
      } else if (temp == 14.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   16.194
        // );
        correspondancePressions = 16.194;
      } else if (temp == 14.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   16.301
        // );
        correspondancePressions = 16.301;
      } else if (temp == 14.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   16.408
        // );
        correspondancePressions = 16.408;
      } else if (temp == 14.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   16.515
        // );
        correspondancePressions = 16.515;
      } else if (temp == 14.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   16.622
        // );
        correspondancePressions = 16.622;
      } else if (temp == 14.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   16.729
        // );
        correspondancePressions = 16.729;
      } else if (temp == 14.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   16.836
        // );
        correspondancePressions = 16.836;
      } else if (temp == 14.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   16.943
        // );
        correspondancePressions = 16.943;
      } else if (temp == 15) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   17.05
        // );
        correspondancePressions = 17.05;
      } else if (temp == 15.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   17.163
        // );
        correspondancePressions = 17.163;
      } else if (temp == 15.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   17.276
        // );
        correspondancePressions = 17.276;
      } else if (temp == 15.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   17.389
        // );
        correspondancePressions = 17.389;
      } else if (temp == 15.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   17.502
        // );
        correspondancePressions = 17.502;
      } else if (temp == 15.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   17.615
        // );
        correspondancePressions = 17.615;
      } else if (temp == 15.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   17.728
        // );
        correspondancePressions = 17.728;
      } else if (temp == 15.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   17.841
        // );
        correspondancePressions = 17.841;
      } else if (temp == 15.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   17.954
        // );
        correspondancePressions = 17.954;
      } else if (temp == 15.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   18.067
        // );
        correspondancePressions = 18.067;
      } else if (temp == 16) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   18.18
        // );
        correspondancePressions = 18.18;
      } else if (temp == 16.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   18.299
        // );
        correspondancePressions = 18.299;
      } else if (temp == 16.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   18.418
        // );
        correspondancePressions = 18.418;
      } else if (temp == 16.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   18.537
        // );
        correspondancePressions = 18.537;
      } else if (temp == 16.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   18.656
        // );
        correspondancePressions = 18.656;
      } else if (temp == 16.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   18.775
        // );
        correspondancePressions = 18.775;
      } else if (temp == 16.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   18.894
        // );
        correspondancePressions = 18.894;
      } else if (temp == 16.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   19.013
        // );
        correspondancePressions = 19.013;
      } else if (temp == 16.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   19.132
        // );
        correspondancePressions = 19.132;
      } else if (temp == 16.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   19.251
        // );
        correspondancePressions = 19.251;
      } else if (temp == 17) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   19.37
        // );
        correspondancePressions = 19.37;
      } else if (temp == 17.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   19.496
        // );
        correspondancePressions = 19.496;
      } else if (temp == 17.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   19.622
        // );
        correspondancePressions = 19.622;
      } else if (temp == 17.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   19.748
        // );
        correspondancePressions = 19.748;
      } else if (temp == 17.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   19.874
        // );
        correspondancePressions = 19.874;
      } else if (temp == 17.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   20
        // );
        correspondancePressions = 20;
      } else if (temp == 17.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   20.126
        // );
        correspondancePressions = 20.126;
      } else if (temp == 17.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   20.252
        // );
        correspondancePressions = 20.252;
      } else if (temp == 17.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   20.378
        // );
        correspondancePressions = 20.378;
      } else if (temp == 17.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   20.504
        // );
        correspondancePressions = 20.504;
      } else if (temp == 18) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   20.63
        // );
        correspondancePressions = 20.63;
      } else if (temp == 18.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   20.764
        // );
        correspondancePressions = 20.764;
      } else if (temp == 18.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   20.898
        // );
        correspondancePressions = 20.898;
      } else if (temp == 18.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   21.032
        // );
        correspondancePressions = 21.032;
      } else if (temp == 18.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   21.166
        // );
        correspondancePressions = 21.166;
      } else if (temp == 18.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   21.3
        // );
        correspondancePressions = 21.3;
      } else if (temp == 18.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   21.434
        // );
        correspondancePressions = 21.434;
      } else if (temp == 18.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   21.568
        // );
        correspondancePressions = 21.568;
      } else if (temp == 18.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   21.702
        // );
        correspondancePressions = 21.702;
      } else if (temp == 18.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   21.836
        // );
        correspondancePressions = 21.836;
      } else if (temp == 19) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   21.97
        // );
        correspondancePressions = 21.97;
      } else if (temp == 19.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   22.111
        // );
        correspondancePressions = 22.111;
      } else if (temp == 19.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   22.252
        // );
        correspondancePressions = 22.252;
      } else if (temp == 19.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   22.393
        // );
        correspondancePressions = 22.393;
      } else if (temp == 19.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   22.534
        // );
        correspondancePressions = 22.534;
      } else if (temp == 19.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   22.675
        // );
        correspondancePressions = 22.675;
      } else if (temp == 19.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   22.816
        // );
        correspondancePressions = 22.816;
      } else if (temp == 19.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   22.957
        // );
        correspondancePressions = 22.957;
      } else if (temp == 19.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   23.098
        // );
        correspondancePressions = 23.098;
      } else if (temp == 19.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   23.239
        // );
        correspondancePressions = 23.239;
      } else if (temp == 20) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   23.38
        // );
        correspondancePressions = 23.38;
      } else if (temp == 20.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   23.529
        // );
        correspondancePressions = 23.529;
      } else if (temp == 20.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   23.678
        // );
        correspondancePressions = 23.678;
      } else if (temp == 20.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   23.827
        // );
        correspondancePressions = 23.827;
      } else if (temp == 20.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   23.976
        // );
        correspondancePressions = 23.976;
      } else if (temp == 20.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   24.125
        // );
        correspondancePressions = 24.125;
      } else if (temp == 20.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   24.274
        // );
        correspondancePressions = 24.274;
      } else if (temp == 20.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   24.423
        // );
        correspondancePressions = 24.423;
      } else if (temp == 20.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   24.572
        // );
        correspondancePressions = 24.572;
      } else if (temp == 20.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   24.721
        // );
        correspondancePressions = 24.721;
      } else if (temp == 21) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   24.87
        // );
        correspondancePressions = 24.87;
      } else if (temp == 21.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   25.026
        // );
        correspondancePressions = 25.026;
      } else if (temp == 21.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   25.182
        // );
        correspondancePressions = 25.182;
      } else if (temp == 21.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   25.338
        // );
        correspondancePressions = 25.338;
      } else if (temp == 21.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   25.494
        // );
        correspondancePressions = 25.494;
      } else if (temp == 21.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   25.65
        // );
        correspondancePressions = 25.65;
      } else if (temp == 21.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   25.806
        // );
        correspondancePressions = 25.806;
      } else if (temp == 21.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   25.962
        // );
        correspondancePressions = 25.962;
      } else if (temp == 21.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   26.118
        // );
        correspondancePressions = 26.118;
      } else if (temp == 21.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   26.274
        // );
        correspondancePressions = 26.274;
      } else if (temp == 22) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   26.43
        // );
        correspondancePressions = 26.43;
      } else if (temp == 22.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   26.596
        // );
        correspondancePressions = 26.596;
      } else if (temp == 22.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   26.762
        // );
        correspondancePressions = 26.762;
      } else if (temp == 22.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   26.928
        // );
        correspondancePressions = 26.928;
      } else if (temp == 22.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   27.094
        // );
        correspondancePressions = 27.094;
      } else if (temp == 22.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   27.26
        // );
        correspondancePressions = 27.26;
      } else if (temp == 22.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   27.426
        // );
        correspondancePressions = 27.426;
      } else if (temp == 22.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   27.592
        // );
        correspondancePressions = 27.592;
      } else if (temp == 22.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   27.758
        // );
        correspondancePressions = 27.758;
      } else if (temp == 22.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   27.924
        // );
        correspondancePressions = 27.924;
      } else if (temp == 23) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   28.09
        // );
        correspondancePressions = 28.09;
      } else if (temp == 23.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   28.264
        // );
        correspondancePressions = 28.264;
      } else if (temp == 23.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   28.438
        // );
        correspondancePressions = 28.438;
      } else if (temp == 23.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   28.612
        // );
        correspondancePressions = 28.612;
      } else if (temp == 23.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   28.786
        // );
        correspondancePressions = 28.786;
      } else if (temp == 23.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   28.96
        // );
        correspondancePressions = 28.96;
      } else if (temp == 23.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   29.134
        // );
        correspondancePressions = 29.134;
      } else if (temp == 23.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   29.308
        // );
        correspondancePressions = 29.308;
      } else if (temp == 23.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   29.482
        // );
        correspondancePressions = 29.482;
      } else if (temp == 23.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   29.656
        // );
        correspondancePressions = 29.656;
      } else if (temp == 24) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   29.83
        // );
        correspondancePressions = 29.83;
      } else if (temp == 24.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   30.014
        // );
        correspondancePressions = 30.014;
      } else if (temp == 24.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   30.198
        // );
        correspondancePressions = 30.198;
      } else if (temp == 24.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   30.382
        // );
        correspondancePressions = 30.382;
      } else if (temp == 24.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   30.566
        // );
        correspondancePressions = 30.566;
      } else if (temp == 24.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   30.75
        // );
        correspondancePressions = 30.75;
      } else if (temp == 24.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   30.934
        // );
        correspondancePressions = 30.934;
      } else if (temp == 24.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   31.118
        // );
        correspondancePressions = 31.118;
      } else if (temp == 24.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   31.302
        // );
        correspondancePressions = 31.302;
      } else if (temp == 24.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   31.486
        // );
        correspondancePressions = 31.486;
      } else if (temp == 25) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   31.67
        // );
        correspondancePressions = 31.67;
      } else if (temp == 25.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   31.863
        // );
        correspondancePressions = 31.863;
      } else if (temp == 25.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   32.056
        // );
        correspondancePressions = 32.056;
      } else if (temp == 25.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   32.249
        // );
        correspondancePressions = 32.249;
      } else if (temp == 25.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   32.442
        // );
        correspondancePressions = 32.442;
      } else if (temp == 25.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   32.635
        // );
        correspondancePressions = 32.635;
      } else if (temp == 25.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   32.828
        // );
        correspondancePressions = 32.828;
      } else if (temp == 25.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   33.021
        // );
        correspondancePressions = 33.021;
      } else if (temp == 25.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   33.214
        // );
        correspondancePressions = 33.214;
      } else if (temp == 25.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   33.407
        // );
        correspondancePressions = 33.407;
      } else if (temp == 26) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   33.6
        // );
        correspondancePressions = 33.6;
      } else if (temp == 26.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   33.804
        // );
        correspondancePressions = 33.804;
      } else if (temp == 26.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   34.008
        // );
        correspondancePressions = 34.008;
      } else if (temp == 26.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   34.212
        // );
        correspondancePressions = 34.212;
      } else if (temp == 26.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   34.416
        // );
        correspondancePressions = 34.416;
      } else if (temp == 26.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   34.62
        // );
        correspondancePressions = 34.62;
      } else if (temp == 26.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   34.824
        // );
        correspondancePressions = 34.824;
      } else if (temp == 26.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   35.028
        // );
        correspondancePressions = 35.028;
      } else if (temp == 26.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   35.232
        // );
        correspondancePressions = 35.232;
      } else if (temp == 26.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   35.436
        // );
        correspondancePressions = 35.436;
      } else if (temp == 27) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   35.64
        // );
        correspondancePressions = 35.64;
      } else if (temp == 27.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   35.856
        // );
        correspondancePressions = 35.856;
      } else if (temp == 27.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   36.072
        // );
        correspondancePressions = 36.072;
      } else if (temp == 27.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   36.288
        // );
        correspondancePressions = 36.288;
      } else if (temp == 27.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   36.504
        // );
        correspondancePressions = 36.504;
      } else if (temp == 27.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   36.72
        // );
        correspondancePressions = 36.72;
      } else if (temp == 27.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   36.936
        // );
        correspondancePressions = 36.936;
      } else if (temp == 27.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   37.152
        // );
        correspondancePressions = 37.152;
      } else if (temp == 27.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   37.368
        // );
        correspondancePressions = 37.368;
      } else if (temp == 27.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   37.584
        // );
        correspondancePressions = 37.584;
      } else if (temp == 28) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   37.8
        // );
        correspondancePressions = 37.8;
      } else if (temp == 28.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   38.025
        // );
        correspondancePressions = 38.025;
      } else if (temp == 28.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   38.25
        // );
        correspondancePressions = 38.25;
      } else if (temp == 28.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   38.475
        // );
        correspondancePressions = 38.475;
      } else if (temp == 28.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   38.7
        // );
        correspondancePressions = 38.7;
      } else if (temp == 28.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   38.925
        // );
        correspondancePressions = 38.925;
      } else if (temp == 28.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   39.15
        // );
        correspondancePressions = 39.15;
      } else if (temp == 28.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   39.375
        // );
        correspondancePressions = 39.375;
      } else if (temp == 28.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   39.6
        // );
        correspondancePressions = 39.6;
      } else if (temp == 28.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   39.825
        // );
        correspondancePressions = 39.825;
      } else if (temp == 29) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   40.05
        // );
        correspondancePressions = 40.05;
      } else if (temp == 29.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   40.288
        // );
        correspondancePressions = 40.288;
      } else if (temp == 29.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   40.526
        // );
        correspondancePressions = 40.526;
      } else if (temp == 29.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   40.764
        // );
        correspondancePressions = 40.764;
      } else if (temp == 29.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   41.002
        // );
        correspondancePressions = 41.002;
      } else if (temp == 29.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   41.24
        // );
        correspondancePressions = 41.24;
      } else if (temp == 29.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   41.478
        // );
        correspondancePressions = 41.478;
      } else if (temp == 29.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   41.716
        // );
        correspondancePressions = 41.716;
      } else if (temp == 29.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   41.954
        // );
        correspondancePressions = 41.954;
      } else if (temp == 29.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   42.192
        // );
        correspondancePressions = 42.192;
      } else if (temp == 30) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   42.43
        // );
        correspondancePressions = 42.43;
      } else if (temp == 30.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   42.679
        // );
        correspondancePressions = 42.679;
      } else if (temp == 30.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   42.928
        // );
        correspondancePressions = 42.928;
      } else if (temp == 30.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   43.177
        // );
        correspondancePressions = 43.177;
      } else if (temp == 30.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   43.426
        // );
        correspondancePressions = 43.426;
      } else if (temp == 30.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   43.675
        // );
        correspondancePressions = 43.675;
      } else if (temp == 30.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   43.924
        // );
        correspondancePressions = 43.924;
      } else if (temp == 30.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   44.173
        // );
        correspondancePressions = 44.173;
      } else if (temp == 30.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   44.422
        // );
        correspondancePressions = 44.422;
      } else if (temp == 30.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   44.671
        // );
        correspondancePressions = 44.671;
      } else if (temp == 31) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   44.92
        // );
        correspondancePressions = 44.92;
      } else if (temp == 31.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   45.183
        // );
        correspondancePressions = 45.183;
      } else if (temp == 31.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   45.446
        // );
        correspondancePressions = 45.446;
      } else if (temp == 31.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   45.709
        // );
        correspondancePressions = 45.709;
      } else if (temp == 31.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   45.972
        // );
        correspondancePressions = 45.972;
      } else if (temp == 31.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   46.235
        // );
        correspondancePressions = 46.235;
      } else if (temp == 31.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   46.498
        // );
        correspondancePressions = 46.498;
      } else if (temp == 31.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   46.761
        // );
        correspondancePressions = 46.761;
      } else if (temp == 31.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   47.024
        // );
        correspondancePressions = 47.024;
      } else if (temp == 31.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   47.287
        // );
        correspondancePressions = 47.287;
      } else if (temp == 32) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   47.55
        // );
        correspondancePressions = 47.55;
      } else if (temp == 32.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   47.825
        // );
        correspondancePressions = 47.825;
      } else if (temp == 32.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   48.1
        // );
        correspondancePressions = 48.1;
      } else if (temp == 32.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   48.375
        // );
        correspondancePressions = 48.375;
      } else if (temp == 32.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   48.65
        // );
        correspondancePressions = 48.65;
      } else if (temp == 32.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   48.925
        // );
        correspondancePressions = 48.925;
      } else if (temp == 32.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   49.2
        // );
        correspondancePressions = 49.2;
      } else if (temp == 32.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   49.475
        // );
        correspondancePressions = 49.475;
      } else if (temp == 32.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   49.75
        // );
        correspondancePressions = 49.75;
      } else if (temp == 32.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   50.025
        // );
        correspondancePressions = 50.025;
      } else if (temp == 33) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   50.3
        // );
        correspondancePressions = 50.3;
      } else if (temp == 33.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   50.589
        // );
        correspondancePressions = 50.589;
      } else if (temp == 33.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   50.878
        // );
        correspondancePressions = 50.878;
      } else if (temp == 33.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   51.167
        // );
        correspondancePressions = 51.167;
      } else if (temp == 33.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   51.456
        // );
        correspondancePressions = 51.456;
      } else if (temp == 33.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   51.745
        // );
        correspondancePressions = 51.745;
      } else if (temp == 33.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   52.034
        // );
        correspondancePressions = 52.034;
      } else if (temp == 33.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   52.323
        // );
        correspondancePressions = 52.323;
      } else if (temp == 33.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   52.612
        // );
        correspondancePressions = 52.612;
      } else if (temp == 33.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   52.901
        // );
        correspondancePressions = 52.901;
      } else if (temp == 34) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   53.19
        // );
        correspondancePressions = 53.19;
      } else if (temp == 34.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   53.494
        // );
        correspondancePressions = 53.494;
      } else if (temp == 34.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   53.798
        // );
        correspondancePressions = 53.798;
      } else if (temp == 34.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   54.102
        // );
        correspondancePressions = 54.102;
      } else if (temp == 34.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   54.406
        // );
        correspondancePressions = 54.406;
      } else if (temp == 34.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   54.71
        // );
        correspondancePressions = 54.71;
      } else if (temp == 34.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   55.014
        // );
        correspondancePressions = 55.014;
      } else if (temp == 34.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   55.318
        // );
        correspondancePressions = 55.318;
      } else if (temp == 34.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   55.622
        // );
        correspondancePressions = 55.622;
      } else if (temp == 34.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   55.926
        // );
        correspondancePressions = 55.926;
      } else if (temp == 35) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Sec :  ',
        //   56.23
        // );
        correspondancePressions = 56.23;
      }
    };

    CorrespondanceHum();
    //  FIN TABLEAU CORRESPONDANCES SEC //
  });

//*! ➖ ➖ ➖ ➖ ➖ ➖ MESURES SUR 90 SECONDES ➖ ➖ ➖ ➖ ➖ ➖ //

// Fonction moyenne
function ArrayAvg(listValHum) {
  let i = 0,
    summ = 0,
    ArrayLen = listValHum.length;
  while (i < ArrayLen) {
    summ = summ + listValHum[i++];
  }
  return summ / ArrayLen;
}
// FIN Fonction moyenne

let calculeTemperatureMoyenneHum = () => {
  return new Promise((resolve) => {
    // Compteur.

    let tempsHum = 0;

    let countHum = () => {
      tempsHum = tempsHum++;
      //console.log(temps++);
      if (tempsHum++ === 179) {
        clearInterval(compteur);
      }

      // console.log('tempsHum', tempsHum);
      // FIN Compteur.

      // Ma fonction.
      const tempSensor = mcpadc.open(
        mcpBrocheHum,
        { speedHz: 20000 },
        (err) => {
          if (err) throw err;

          if (tempsHum >= 89 && tempsHum <= 179) {
            tempSensor.read((err, reading) => {
              if (err) throw err;
              listValHum.push(reading.value * 40);
              // console.log('listValHum', listValHum);
            });
          }
        }
      );
      // FIN Ma fonction.
    };

    setTimeout(() => {
      resolve(ArrayAvg(listValHum));
    }, 180500);

    let compteur = setInterval(countHum, 1000);
  });
};

//! -------------------------------------------------- !-
let resultatsHum = async () => {
  let temperatureMoyenneAirHum = await calculeTemperatureMoyenneHum();

  return temperatureMoyenneAirHum;
};

resultatsHum()
  .then((temperatureMoyenneAirHum) => {
    // Calcule de la température.

    valeursMesureHum90 = parseFloat(temperatureMoyenneAirHum.toFixed(1));
    // console.log(
    //   magenta,
    //   "[ GESTION HUM CALCULES  ] Temperature Moyenne de l'air Hum: ",
    //   valeursMesureHum90
    // );

    valeursMesureHum90Corrigee = parseFloat(
      valeurEtalonnageHum + valeursMesureHum90
    ).toFixed(1);

    // console.log(
    //   magenta,
    //   "[ GESTION HUM CALCULES  ] Temperature Moyenne de l'air Hum corrigée: ",
    //   valeursMesureHum90Corrigee
    // );

    // Calcule du delta.

    // delta = parseFloat((consigne - valeursMesureHum90Corrigee).toFixed(1));
    // console.log(magenta, '[ GESTION HUM CALCULES  ] Le delta est de : ', delta);
  })

  //! Tableau de correspondance humidité.
  .then(() => {
    let tempHum = valeursMesureHum90Corrigee;

    let CorrespondanceHum = () => {
      if (tempHum == 10) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   12.28
        // );
        correspondancePressionsHum = 12.28;
      } else if (tempHum == 10.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   12.364
        // );
        correspondancePressionsHum = 12.364;
      } else if (tempHum == 10.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   12.448
        // );
        correspondancePressionsHum = 12.448;
      } else if (tempHum == 10.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   12.532
        // );
        correspondancePressionsHum = 12.532;
      } else if (tempHum == 10.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   12.616
        // );
        correspondancePressionsHum = 12.616;
      } else if (tempHum == 10.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   12.7
        // );
        correspondancePressionsHum = 12.7;
      } else if (tempHum == 10.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   12.784
        // );
        correspondancePressionsHum = 12.784;
      } else if (tempHum == 10.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   12.868
        // );
        correspondancePressionsHum = 12.868;
      } else if (tempHum == 10.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   12.952
        // );
        correspondancePressionsHum = 12.952;
      } else if (tempHum == 10.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   13.036
        // );
        correspondancePressionsHum = 13.036;
      } else if (tempHum == 11) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   13.12
        // );
        correspondancePressionsHum = 13.12;
      } else if (tempHum == 11.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   13.21
        // );
        correspondancePressionsHum = 13.21;
      } else if (tempHum == 11.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   13.3
        // );
        correspondancePressionsHum = 13.3;
      } else if (tempHum == 11.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   13.39
        // );
        correspondancePressionsHum = 13.39;
      } else if (tempHum == 11.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   13.48
        // );
        correspondancePressionsHum = 13.48;
      } else if (tempHum == 11.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   13.57
        // );
        correspondancePressionsHum = 13.57;
      } else if (tempHum == 11.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   13.66
        // );
        correspondancePressionsHum = 13.66;
      } else if (tempHum == 11.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   13.75
        // );
        correspondancePressionsHum = 13.75;
      } else if (tempHum == 11.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   13.84
        // );
        correspondancePressionsHum = 13.84;
      } else if (tempHum == 11.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   13.93
        // );
        correspondancePressionsHum = 13.93;
      } else if (tempHum == 12) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   14.02
        // );
        correspondancePressionsHum = 14.02;
      } else if (tempHum == 12.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   14.115
        // );
        correspondancePressionsHum = 14.115;
      } else if (tempHum == 12.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   14.21
        // );
        correspondancePressionsHum = 14.21;
      } else if (tempHum == 12.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   14.305
        // );
        correspondancePressionsHum = 14.305;
      } else if (tempHum == 12.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   14.4
        // );
        correspondancePressionsHum = 14.4;
      } else if (tempHum == 12.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   14.495
        // );
        correspondancePressionsHum = 14.495;
      } else if (tempHum == 12.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   14.59
        // );
        correspondancePressionsHum = 14.59;
      } else if (tempHum == 12.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   14.685
        // );
        correspondancePressionsHum = 14.685;
      } else if (tempHum == 12.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   14.78
        // );
        correspondancePressionsHum = 14.78;
      } else if (tempHum == 12.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   14.875
        // );
        correspondancePressionsHum = 14.875;
      } else if (tempHum == 13) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   14.97
        // );
        correspondancePressionsHum = 14.97;
      } else if (tempHum == 13.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   15.071
        // );
        correspondancePressionsHum = 15.071;
      } else if (tempHum == 13.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   15.172
        // );
        correspondancePressionsHum = 15.172;
      } else if (tempHum == 13.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   15.273
        // );
        correspondancePressionsHum = 15.273;
      } else if (tempHum == 13.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   15.374
        // );
        correspondancePressionsHum = 15.374;
      } else if (tempHum == 13.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   15.475
        // );
        correspondancePressionsHum = 15.475;
      } else if (tempHum == 13.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   15.576
        // );
        correspondancePressionsHum = 15.576;
      } else if (tempHum == 13.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   15.677
        // );
        correspondancePressionsHum = 15.677;
      } else if (tempHum == 13.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   15.778
        // );
        correspondancePressionsHum = 15.778;
      } else if (tempHum == 13.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   15.879
        // );
        correspondancePressionsHum = 15.879;
      } else if (tempHum == 14) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   15.98
        // );
        correspondancePressionsHum = 15.98;
      } else if (tempHum == 14.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   16.087
        // );
        correspondancePressionsHum = 16.087;
      } else if (tempHum == 14.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   16.194
        // );
        correspondancePressionsHum = 16.194;
      } else if (tempHum == 14.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   16.301
        // );
        correspondancePressionsHum = 16.301;
      } else if (tempHum == 14.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   16.408
        // );
        correspondancePressionsHum = 16.408;
      } else if (tempHum == 14.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   16.515
        // );
        correspondancePressionsHum = 16.515;
      } else if (tempHum == 14.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   16.622
        // );
        correspondancePressionsHum = 16.622;
      } else if (tempHum == 14.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   16.729
        // );
        correspondancePressionsHum = 16.729;
      } else if (tempHum == 14.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   16.836
        // );
        correspondancePressionsHum = 16.836;
      } else if (tempHum == 14.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   16.943
        // );
        correspondancePressionsHum = 16.943;
      } else if (tempHum == 15) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   17.05
        // );
        correspondancePressionsHum = 17.05;
      } else if (tempHum == 15.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   17.163
        // );
        correspondancePressionsHum = 17.163;
      } else if (tempHum == 15.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   17.276
        // );
        correspondancePressionsHum = 17.276;
      } else if (tempHum == 15.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   17.389
        // );
        correspondancePressionsHum = 17.389;
      } else if (tempHum == 15.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   17.502
        // );
        correspondancePressionsHum = 17.502;
      } else if (tempHum == 15.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   17.615
        // );
        correspondancePressionsHum = 17.615;
      } else if (tempHum == 15.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   17.728
        // );
        correspondancePressionsHum = 17.728;
      } else if (tempHum == 15.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   17.841
        // );
        correspondancePressionsHum = 17.841;
      } else if (tempHum == 15.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   17.954
        // );
        correspondancePressionsHum = 17.954;
      } else if (tempHum == 15.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   18.067
        // );
        correspondancePressionsHum = 18.067;
      } else if (tempHum == 16) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   18.18
        // );
        correspondancePressionsHum = 18.18;
      } else if (tempHum == 16.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   18.299
        // );
        correspondancePressionsHum = 18.299;
      } else if (tempHum == 16.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   18.418
        // );
        correspondancePressionsHum = 18.418;
      } else if (tempHum == 16.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   18.537
        // );
        correspondancePressionsHum = 18.537;
      } else if (tempHum == 16.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   18.656
        // );
        correspondancePressionsHum = 18.656;
      } else if (tempHum == 16.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   18.775
        // );
        correspondancePressionsHum = 18.775;
      } else if (tempHum == 16.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   18.894
        // );
        correspondancePressionsHum = 18.894;
      } else if (tempHum == 16.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   19.013
        // );
        correspondancePressionsHum = 19.013;
      } else if (tempHum == 16.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   19.132
        // );
        correspondancePressionsHum = 19.132;
      } else if (tempHum == 16.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   19.251
        // );
        correspondancePressionsHum = 19.251;
      } else if (tempHum == 17) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   19.37
        // );
        correspondancePressionsHum = 19.37;
      } else if (tempHum == 17.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   19.496
        // );
        correspondancePressionsHum = 19.496;
      } else if (tempHum == 17.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   19.622
        // );
        correspondancePressionsHum = 19.622;
      } else if (tempHum == 17.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   19.748
        // );
        correspondancePressionsHum = 19.748;
      } else if (tempHum == 17.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   19.874
        // );
        correspondancePressionsHum = 19.874;
      } else if (tempHum == 17.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   20
        // );
        correspondancePressionsHum = 20;
      } else if (tempHum == 17.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   20.126
        // );
        correspondancePressionsHum = 20.126;
      } else if (tempHum == 17.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   20.252
        // );
        correspondancePressionsHum = 20.252;
      } else if (tempHum == 17.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   20.378
        // );
        correspondancePressionsHum = 20.378;
      } else if (tempHum == 17.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   20.504
        // );
        correspondancePressionsHum = 20.504;
      } else if (tempHum == 18) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   20.63
        // );
        correspondancePressionsHum = 20.63;
      } else if (tempHum == 18.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   20.764
        // );
        correspondancePressionsHum = 20.764;
      } else if (tempHum == 18.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   20.898
        // );
        correspondancePressionsHum = 20.898;
      } else if (tempHum == 18.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   21.032
        // );
        correspondancePressionsHum = 21.032;
      } else if (tempHum == 18.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   21.166
        // );
        correspondancePressionsHum = 21.166;
      } else if (tempHum == 18.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   21.3
        // );
        correspondancePressionsHum = 21.3;
      } else if (tempHum == 18.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   21.434
        // );
        correspondancePressionsHum = 21.434;
      } else if (tempHum == 18.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   21.568
        // );
        correspondancePressionsHum = 21.568;
      } else if (tempHum == 18.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   21.702
        // );
        correspondancePressionsHum = 21.702;
      } else if (tempHum == 18.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   21.836
        // );
        correspondancePressionsHum = 21.836;
      } else if (tempHum == 19) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   21.97
        // );
        correspondancePressionsHum = 21.97;
      } else if (tempHum == 19.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   22.111
        // );
        correspondancePressionsHum = 22.111;
      } else if (tempHum == 19.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   22.252
        // );
        correspondancePressionsHum = 22.252;
      } else if (tempHum == 19.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   22.393
        // );
        correspondancePressionsHum = 22.393;
      } else if (tempHum == 19.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   22.534
        // );
        correspondancePressionsHum = 22.534;
      } else if (tempHum == 19.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   22.675
        // );
        correspondancePressionsHum = 22.675;
      } else if (tempHum == 19.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   22.816
        // );
        correspondancePressionsHum = 22.816;
      } else if (tempHum == 19.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   22.957
        // );
        correspondancePressionsHum = 22.957;
      } else if (tempHum == 19.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   23.098
        // );
        correspondancePressionsHum = 23.098;
      } else if (tempHum == 19.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   23.239
        // );
        correspondancePressionsHum = 23.239;
      } else if (tempHum == 20) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   23.38
        // );
        correspondancePressionsHum = 23.38;
      } else if (tempHum == 20.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   23.529
        // );
        correspondancePressionsHum = 23.529;
      } else if (tempHum == 20.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   23.678
        // );
        correspondancePressionsHum = 23.678;
      } else if (tempHum == 20.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   23.827
        // );
        correspondancePressionsHum = 23.827;
      } else if (tempHum == 20.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   23.976
        // );
        correspondancePressionsHum = 23.976;
      } else if (tempHum == 20.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   24.125
        // );
        correspondancePressionsHum = 24.125;
      } else if (tempHum == 20.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   24.274
        // );
        correspondancePressionsHum = 24.274;
      } else if (tempHum == 20.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   24.423
        // );
        correspondancePressionsHum = 24.423;
      } else if (tempHum == 20.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   24.572
        // );
        correspondancePressionsHum = 24.572;
      } else if (tempHum == 20.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   24.721
        // );
        correspondancePressionsHum = 24.721;
      } else if (tempHum == 21) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   24.87
        // );
        correspondancePressionsHum = 24.87;
      } else if (tempHum == 21.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   25.026
        // );
        correspondancePressionsHum = 25.026;
      } else if (tempHum == 21.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   25.182
        // );
        correspondancePressionsHum = 25.182;
      } else if (tempHum == 21.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   25.338
        // );
        correspondancePressionsHum = 25.338;
      } else if (tempHum == 21.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   25.494
        // );
        correspondancePressionsHum = 25.494;
      } else if (tempHum == 21.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   25.65
        // );
        correspondancePressionsHum = 25.65;
      } else if (tempHum == 21.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   25.806
        // );
        correspondancePressionsHum = 25.806;
      } else if (tempHum == 21.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   25.962
        // );
        correspondancePressionsHum = 25.962;
      } else if (tempHum == 21.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   26.118
        // );
        correspondancePressionsHum = 26.118;
      } else if (tempHum == 21.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   26.274
        // );
        correspondancePressionsHum = 26.274;
      } else if (tempHum == 22) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   26.43
        // );
        correspondancePressionsHum = 26.43;
      } else if (tempHum == 22.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   26.596
        // );
        correspondancePressionsHum = 26.596;
      } else if (tempHum == 22.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   26.762
        // );
        correspondancePressionsHum = 26.762;
      } else if (tempHum == 22.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   26.928
        // );
        correspondancePressionsHum = 26.928;
      } else if (tempHum == 22.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   27.094
        // );
        correspondancePressionsHum = 27.094;
      } else if (tempHum == 22.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   27.26
        // );
        correspondancePressionsHum = 27.26;
      } else if (tempHum == 22.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   27.426
        // );
        correspondancePressionsHum = 27.426;
      } else if (tempHum == 22.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   27.592
        // );
        correspondancePressionsHum = 27.592;
      } else if (tempHum == 22.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   27.758
        // );
        correspondancePressionsHum = 27.758;
      } else if (tempHum == 22.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   27.924
        // );
        correspondancePressionsHum = 27.924;
      } else if (tempHum == 23) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   28.09
        // );
        correspondancePressionsHum = 28.09;
      } else if (tempHum == 23.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   28.264
        // );
        correspondancePressionsHum = 28.264;
      } else if (tempHum == 23.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   28.438
        // );
        correspondancePressionsHum = 28.438;
      } else if (tempHum == 23.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   28.612
        // );
        correspondancePressionsHum = 28.612;
      } else if (tempHum == 23.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   28.786
        // );
        correspondancePressionsHum = 28.786;
      } else if (tempHum == 23.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   28.96
        // );
        correspondancePressionsHum = 28.96;
      } else if (tempHum == 23.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   29.134
        // );
        correspondancePressionsHum = 29.134;
      } else if (tempHum == 23.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   29.308
        // );
        correspondancePressionsHum = 29.308;
      } else if (tempHum == 23.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   29.482
        // );
        correspondancePressionsHum = 29.482;
      } else if (tempHum == 23.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   29.656
        // );
        correspondancePressionsHum = 29.656;
      } else if (tempHum == 24) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   29.83
        // );
        correspondancePressionsHum = 29.83;
      } else if (tempHum == 24.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   30.014
        // );
        correspondancePressionsHum = 30.014;
      } else if (tempHum == 24.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   30.198
        // );
        correspondancePressionsHum = 30.198;
      } else if (tempHum == 24.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   30.382
        // );
        correspondancePressionsHum = 30.382;
      } else if (tempHum == 24.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   30.566
        // );
        correspondancePressionsHum = 30.566;
      } else if (tempHum == 24.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   30.75
        // );
        correspondancePressionsHum = 30.75;
      } else if (tempHum == 24.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   30.934
        // );
        correspondancePressionsHum = 30.934;
      } else if (tempHum == 24.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   31.118
        // );
        correspondancePressionsHum = 31.118;
      } else if (tempHum == 24.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   31.302
        // );
        correspondancePressionsHum = 31.302;
      } else if (tempHum == 24.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   31.486
        // );
        correspondancePressionsHum = 31.486;
      } else if (tempHum == 25) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   31.67
        // );
        correspondancePressionsHum = 31.67;
      } else if (tempHum == 25.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   31.863
        // );
        correspondancePressionsHum = 31.863;
      } else if (tempHum == 25.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   32.056
        // );
        correspondancePressionsHum = 32.056;
      } else if (tempHum == 25.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   32.249
        // );
        correspondancePressionsHum = 32.249;
      } else if (tempHum == 25.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   32.442
        // );
        correspondancePressionsHum = 32.442;
      } else if (tempHum == 25.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   32.635
        // );
        correspondancePressionsHum = 32.635;
      } else if (tempHum == 25.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   32.828
        // );
        correspondancePressionsHum = 32.828;
      } else if (tempHum == 25.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   33.021
        // );
        correspondancePressionsHum = 33.021;
      } else if (tempHum == 25.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   33.214
        // );
        correspondancePressionsHum = 33.214;
      } else if (tempHum == 25.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   33.407
        // );
        correspondancePressionsHum = 33.407;
      } else if (tempHum == 26) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   33.6
        // );
        correspondancePressionsHum = 33.6;
      } else if (tempHum == 26.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   33.804
        // );
        correspondancePressionsHum = 33.804;
      } else if (tempHum == 26.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   34.008
        // );
        correspondancePressionsHum = 34.008;
      } else if (tempHum == 26.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   34.212
        // );
        correspondancePressionsHum = 34.212;
      } else if (tempHum == 26.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   34.416
        // );
        correspondancePressionsHum = 34.416;
      } else if (tempHum == 26.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   34.62
        // );
        correspondancePressionsHum = 34.62;
      } else if (tempHum == 26.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   34.824
        // );
        correspondancePressionsHum = 34.824;
      } else if (tempHum == 26.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   35.028
        // );
        correspondancePressionsHum = 35.028;
      } else if (tempHum == 26.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   35.232
        // );
        correspondancePressionsHum = 35.232;
      } else if (tempHum == 26.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   35.436
        // );
        correspondancePressionsHum = 35.436;
      } else if (tempHum == 27) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   35.64
        // );
        correspondancePressionsHum = 35.64;
      } else if (tempHum == 27.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   35.856
        // );
        correspondancePressionsHum = 35.856;
      } else if (tempHum == 27.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   36.072
        // );
        correspondancePressionsHum = 36.072;
      } else if (tempHum == 27.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   36.288
        // );
        correspondancePressionsHum = 36.288;
      } else if (tempHum == 27.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   36.504
        // );
        correspondancePressionsHum = 36.504;
      } else if (tempHum == 27.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   36.72
        // );
        correspondancePressionsHum = 36.72;
      } else if (tempHum == 27.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   36.936
        // );
        correspondancePressionsHum = 36.936;
      } else if (tempHum == 27.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   37.152
        // );
        correspondancePressionsHum = 37.152;
      } else if (tempHum == 27.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   37.368
        // );
        correspondancePressionsHum = 37.368;
      } else if (tempHum == 27.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   37.584
        // );
        correspondancePressionsHum = 37.584;
      } else if (tempHum == 28) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   37.8
        // );
        correspondancePressionsHum = 37.8;
      } else if (tempHum == 28.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   38.025
        // );
        correspondancePressionsHum = 38.025;
      } else if (tempHum == 28.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   38.25
        // );
        correspondancePressionsHum = 38.25;
      } else if (tempHum == 28.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   38.475
        // );
        correspondancePressionsHum = 38.475;
      } else if (tempHum == 28.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   38.7
        // );
        correspondancePressionsHum = 38.7;
      } else if (tempHum == 28.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   38.925
        // );
        correspondancePressionsHum = 38.925;
      } else if (tempHum == 28.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   39.15
        // );
        correspondancePressionsHum = 39.15;
      } else if (tempHum == 28.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   39.375
        // );
        correspondancePressionsHum = 39.375;
      } else if (tempHum == 28.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   39.6
        // );
        correspondancePressionsHum = 39.6;
      } else if (tempHum == 28.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   39.825
        // );
        correspondancePressionsHum = 39.825;
      } else if (tempHum == 29) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   40.05
        // );
        correspondancePressionsHum = 40.05;
      } else if (tempHum == 29.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   40.288
        // );
        correspondancePressionsHum = 40.288;
      } else if (tempHum == 29.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   40.526
        // );
        correspondancePressionsHum = 40.526;
      } else if (tempHum == 29.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   40.764
        // );
        correspondancePressionsHum = 40.764;
      } else if (tempHum == 29.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   41.002
        // );
        correspondancePressionsHum = 41.002;
      } else if (tempHum == 29.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   41.24
        // );
        correspondancePressionsHum = 41.24;
      } else if (tempHum == 29.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   41.478
        // );
        correspondancePressionsHum = 41.478;
      } else if (tempHum == 29.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   41.716
        // );
        correspondancePressionsHum = 41.716;
      } else if (tempHum == 29.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   41.954
        // );
        correspondancePressionsHum = 41.954;
      } else if (tempHum == 29.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   42.192
        // );
        correspondancePressionsHum = 42.192;
      } else if (tempHum == 30) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   42.43
        // );
        correspondancePressionsHum = 42.43;
      } else if (tempHum == 30.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   42.679
        // );
        correspondancePressionsHum = 42.679;
      } else if (tempHum == 30.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   42.928
        // );
        correspondancePressionsHum = 42.928;
      } else if (tempHum == 30.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   43.177
        // );
        correspondancePressionsHum = 43.177;
      } else if (tempHum == 30.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   43.426
        // );
        correspondancePressionsHum = 43.426;
      } else if (tempHum == 30.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   43.675
        // );
        correspondancePressionsHum = 43.675;
      } else if (tempHum == 30.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   43.924
        // );
        correspondancePressionsHum = 43.924;
      } else if (tempHum == 30.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   44.173
        // );
        correspondancePressionsHum = 44.173;
      } else if (tempHum == 30.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   44.422
        // );
        correspondancePressionsHum = 44.422;
      } else if (tempHum == 30.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   44.671
        // );
        correspondancePressionsHum = 44.671;
      } else if (tempHum == 31) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   44.92
        // );
        correspondancePressionsHum = 44.92;
      } else if (tempHum == 31.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   45.183
        // );
        correspondancePressionsHum = 45.183;
      } else if (tempHum == 31.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   45.446
        // );
        correspondancePressionsHum = 45.446;
      } else if (tempHum == 31.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   45.709
        // );
        correspondancePressionsHum = 45.709;
      } else if (tempHum == 31.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   45.972
        // );
        correspondancePressionsHum = 45.972;
      } else if (tempHum == 31.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   46.235
        // );
        correspondancePressionsHum = 46.235;
      } else if (tempHum == 31.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   46.498
        // );
        correspondancePressionsHum = 46.498;
      } else if (tempHum == 31.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   46.761
        // );
        correspondancePressionsHum = 46.761;
      } else if (tempHum == 31.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   47.024
        // );
        correspondancePressionsHum = 47.024;
      } else if (tempHum == 31.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   47.287
        // );
        correspondancePressionsHum = 47.287;
      } else if (tempHum == 32) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   47.55
        // );
        correspondancePressionsHum = 47.55;
      } else if (tempHum == 32.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   47.825
        // );
        correspondancePressionsHum = 47.825;
      } else if (tempHum == 32.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   48.1
        // );
        correspondancePressionsHum = 48.1;
      } else if (tempHum == 32.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   48.375
        // );
        correspondancePressionsHum = 48.375;
      } else if (tempHum == 32.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   48.65
        // );
        correspondancePressionsHum = 48.65;
      } else if (tempHum == 32.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   48.925
        // );
        correspondancePressionsHum = 48.925;
      } else if (tempHum == 32.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   49.2
        // );
        correspondancePressionsHum = 49.2;
      } else if (tempHum == 32.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   49.475
        // );
        correspondancePressionsHum = 49.475;
      } else if (tempHum == 32.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   49.75
        // );
        correspondancePressionsHum = 49.75;
      } else if (tempHum == 32.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   50.025
        // );
        correspondancePressionsHum = 50.025;
      } else if (tempHum == 33) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   50.3
        // );
        correspondancePressionsHum = 50.3;
      } else if (tempHum == 33.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   50.589
        // );
        correspondancePressionsHum = 50.589;
      } else if (tempHum == 33.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   50.878
        // );
        correspondancePressionsHum = 50.878;
      } else if (tempHum == 33.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   51.167
        // );
        correspondancePressionsHum = 51.167;
      } else if (tempHum == 33.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   51.456
        // );
        correspondancePressionsHum = 51.456;
      } else if (tempHum == 33.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   51.745
        // );
        correspondancePressionsHum = 51.745;
      } else if (tempHum == 33.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   52.034
        // );
        correspondancePressionsHum = 52.034;
      } else if (tempHum == 33.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   52.323
        // );
        correspondancePressionsHum = 52.323;
      } else if (tempHum == 33.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   52.612
        // );
        correspondancePressionsHum = 52.612;
      } else if (tempHum == 33.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   52.901
        // );
        correspondancePressionsHum = 52.901;
      } else if (tempHum == 34) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   53.19
        // );
        correspondancePressionsHum = 53.19;
      } else if (tempHum == 34.1) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   53.494
        // );
        correspondancePressionsHum = 53.494;
      } else if (tempHum == 34.2) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   53.798
        // );
        correspondancePressionsHum = 53.798;
      } else if (tempHum == 34.3) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   54.102
        // );
        correspondancePressionsHum = 54.102;
      } else if (tempHum == 34.4) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   54.406
        // );
        correspondancePressionsHum = 54.406;
      } else if (tempHum == 34.5) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   54.71
        // );
        correspondancePressionsHum = 54.71;
      } else if (tempHum == 34.6) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   55.014
        // );
        correspondancePressionsHum = 55.014;
      } else if (tempHum == 34.7) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   55.318
        // );
        correspondancePressionsHum = 55.318;
      } else if (tempHum == 34.8) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   55.622
        // );
        correspondancePressionsHum = 55.622;
      } else if (tempHum == 34.9) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   55.926
        // );
        correspondancePressionsHum = 55.926;
      } else if (tempHum == 35) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Correspondance des pressions Hum :  ',
        //   56.23
        // );
        correspondancePressionsHum = 56.23;
      }
    };

    CorrespondanceHum();
    // FIN TABLEAU CORRESPONDANCES HUM  //
  })

  //! Calcule du taux d'humidité.
  .then(() => {
    tauxHumidite = (
      ((correspondancePressionsHum -
        1013 *
          0.000662 *
          (valeursMesureSec180Corrigee - valeursMesureHum90Corrigee)) /
        correspondancePressions) *
      100
    ).toFixed(2);

    // console.log(
    //   magenta,
    //   '[ GESTION HUM CALCULES  ] Taux humidité',
    //   tauxHumidite
    // );

    // Calcule du delta entre la consigne et le taux d'humidité.

    deltaHum = parseFloat((tauxHumidite - consigne).toFixed(1));

    // console.log(
    //   magenta,
    //   '[ GESTION HUM CALCULES  ] Du delta humidité',
    //   tauxHumidite
    // );
  })

  //! Action après le calcule du delta
  .then(() => {
    let actionDelta = () => {
      if (deltaHum < 0) {
        let eau = () => {
          // Activation de l'eau au sol.

          const realyOn = new Gpio(16, 'out');

          // console.log(
          //   magenta,
          //   "[ GESTION HUM CALCULES  ] DeltaHum <  0 : Activation de l'eau au sol."
          // );
        };
        eau();

        // Déactivation de l'eau au sol.
        setTimeout((eau) => {
          const realyOff = new Gpio(16, 'in');

          // console.log(
          //   magenta,
          //   "[ GESTION HUM CALCULES  ] Déactivation de l'eau au sol."
          // );
        }, 120000);
      } else if (deltaHum > 0) {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] DeltaHum >  0 : On ne fait rien'
        // );
      }
    };

    actionDelta();
  })

  .then(() => {
    //! Transmission des données à la base.

    const newVal = gestionHumModels
      .create({
        tauxHumidite: tauxHumidite,
        deltaHum: deltaHum,
        valeursMesureSec180: valeursMesureSec180Corrigee,
        valeursMesureHum90: valeursMesureHum90Corrigee,
        consigne: consigne,
        valeurAxeX: valeurAxeX,
        jourDuCycle: jourDuCycle,
      })

      .then(() => {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Données transférées à la base de données gestion_hums'
        // );
      })
      .catch((error) => {
        // console.log(
        //   magenta,
        //   '[ GESTION HUM CALCULES  ] Erreur dans le processus d’enregistrement la base de données gestion_hums',
        //   error
        // );
      });
  })
  .then(() => {
    //! Mise à jour des Jours & Heures

    let newDelta = () => {
      gestionHumModels
        .update({ daysHum: days, heuresHum: heures }, { where: { id: lastId } })
        // .then((result) =>
        //   console.log(
        //     magenta,
        //     '[ GESTION HUM CALCULES  ] Le nombre de jours et d heures on té mis à jour'
        //   )
        // )
        .catch((err) => console.log(err));
    };

    newDelta();
  })

  .then(() => {
    listValSec = [];
    listValHum = [];
  });
