const Gpio = require('onoff').Gpio;
const jaune = '\x1b[33m';
const magenta = '\x1b[35m';
const sequelize = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../../models');
const mcpadc = require('mcp-spi-adc');

//! Les fonctions asynchrones.

//? Récupération de la consigne.

let consigne;
let pas;
let objectif;

const gestionHumDataModels = db.gestionHumData;

let recuperationDeLaConsigne = () => {
  return new Promise((resolve, reject) => {

    try {
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

              // console.log(
              //   "✅ %c SUCCÈS ==> gestions Hum ==> Récupération de la Consigne Hum =================>",
              //   'color: green', consigne
              // );

              pas = result['pasHum'];

              // console.log(
              //   "✅ %c SUCCÈS ==> gestions Hum ==> Récupération du Pas Hum =========================>",
              //   'color: green', pas
              // );

              objectif = result['objectifHum'];

              // console.log(
              //   "✅ %c SUCCÈS ==> gestions Hum ==> Récupération de l'Objectif Hum ==================>",
              //   'color: green', objectif
              // );

            })
            .then(() => {

              resolve();

            });
        });
    } catch (error) {

      console.log('❌ %c ERREUR ==> gestions Hum ==> Récupération de la consigne',
        'color: orange', error);

      reject();
    }

  });
}

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

              //* dade démarrage du cycle.

              dateDemarrageCycle = result['dateDemarrageCycle'];

              // console.log(
              //   "✅ %c SUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe X",
              //   'color: green', dateDemarrageCycle
              // );

              //* --------------------------------------------------

              // console.log('Le dernier id de gestionAir est : ', id);
              // console.log(id.maxid);

              gestionCourbesModels
                .findOne({
                  where: { id: id.maxid },
                })
                .then((result) => {

                  //* Date de démarrage du cycle.

                  dateDemarrageCycle = new Date(result['dateDemarrageCycle']);

                  // console.log(
                  //   "✅ %c SUCCÈS ==> gestions Air ==> Date de démarrage du cycle ===>",
                  //   'color: green', dateDemarrageCycle
                  // );

                  //* --------------------------------------------------

                  //* Date du jour.

                  dateDuJour = new Date();

                  // console.log(
                  //   "✅ %c SUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe X ===> Date du jour",
                  //   'color: green', dateDuJour
                  // );

                  //* --------------------------------------------------

                  //* Calcul du nombre de jour du cycle.

                  let nbJourBrut = dateDuJour.getTime() - dateDemarrageCycle.getTime();
                  jourDuCycle = Math.round(nbJourBrut / (1000 * 3600 * 24)) + 1;

                  // console.log(
                  //   "✅ %c SUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe X ===> Calcul du nombre de jour du cycle",
                  //   'color: green', jourDuCycle
                  // );

                  //* --------------------------------------------------

                  //* Affichage de l'heure.
                  heureDuCycle = new Date().getHours();
                  minuteDuCycle = new Date().getMinutes();
                  heureMinute = heureDuCycle + 'h' + minuteDuCycle;

                  // console.log(
                  //   "✅ %c SUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe x ===> Affichage de l'heure",
                  //   'color: green', heureMinute
                  // );

                  //* --------------------------------------------------

                  //* Valeure de l'axe x.
                  valeurAxeX = 'Jour ' + jourDuCycle + ' - ' + heureMinute;

                  // console.log(
                  //   "✅ %c SUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe x ===> Valeure de l'axe X",
                  //   'color: green', valeurAxeX
                  // );

                  //* --------------------------------------------------

                })

            })

            .then(() => {

              resolve();

            });
        });

    } catch (error) {

      console.log("❌ %c ERREUR ==> gestions Air ==> Construction de la valeur de l'axe X",
        'color: orange', error);

      reject();

    }

  });
}

//? --------------------------------------------------

//? Récupération de l'étalonage Sec.

let etalonnageSec

const gestionSecEtallonnageModels = db.etalonnageSec;

let recuperationDeEtalonageSec = () => {
  return new Promise((resolve, reject) => {

    try {
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
              //console.log(result);

              etalonnageSec = result['etalonnageSec'];

              console.log(
                "✅ %c SUCCÈS ==> gestions Hum ==> 1️⃣  Récupération de l'étalonage Sec =========================>",
                'color: green', etalonnageSec
              );

            })
            .then(() => {

              resolve();

            });
        });
    } catch (error) {

      console.log("❌ %c ERREUR ==> gestions Hum ==> Récupération de l'étalonage Sec",
        'color: orange', error);

      reject();
    }

  });
}

//? --------------------------------------------------

//? Mesure de la température Sec.

let mcpBrocheSec = 0;
let listValSec = [];

let getTemperaturesSec = () => {
  return new Promise((resolve, reject) => {

    try {

      let temps = 0;

      let count = () => {
        temps = temps++;

        //console.log(temps++);

        if (temps++ === 39) {
          clearInterval(conteur);

        }

        // console.log(jaune, '[ GESTION SUBSTRAT CALCULES  ] temps', temps);

        const tempSensor = mcpadc.open(mcpBrocheSec, { speedHz: 20000 }, (err) => {
          if (err) throw err;

          tempSensor.read((err, reading) => {
            if (err) throw err;
            listValSec.push(reading.value * 40);

            // console.log(
            //   "✅ %c SUCCÈS ==> gestions Hum ==> Mesure de la température Sec",
            //   'color: green', listValSec
            // );

            if (listValSec.length >= 40) {
              // console.log('listValSec.length >=40');
              resolve()
            }
          });
        });

      };

      let conteur = setInterval(count, 1000);

    } catch (error) {

      console.log("❌ %c ERREUR ==> gestions Hum ==> Mesure de la température Sev",
        'color: orange', error);

      reject();

    }

  });
}

//? --------------------------------------------------

//? Calcule de la température moyenne Sec.

let temperatureMoyenneSec;

let calculeDeLaTemperatureMoyenneSec = () => {
  return new Promise((resolve, reject) => {

    try {

      let arrayLength = listValSec.length
      // console.log('Nb valeurs de listValSec :', arrayLength);

      const reducer = (accumulator, curr) => accumulator + curr;
      let sumlistVal = listValSec.reduce(reducer)
      // console.log('Somme valeurs listValSec : ', sumlistValHum);

      temperatureMoyenneSec = sumlistVal / arrayLength;

      console.log(
        "✅ %c SUCCÈS ==> gestions Hum ==> 1️⃣  Temperature moyenne Brute Sec ===========================>",
        'color: green ', temperatureMoyenneSec
      );

      resolve();

    } catch (error) {

      console.log("❌ %c ERREUR ==> gestions Hum ==> Temperature moyenne Hum",
        'color: orange', error);

      reject();

    }

  });
}

//? --------------------------------------------------

//? Définition de la température corrigée Sec.

let temperatureCorrigeeSec;

let definitionTemperatureSeccorrigee = () => {
  return new Promise((resolve, reject) => {

    try {

      temperatureCorrigeeSec =
        parseFloat((temperatureMoyenneSec + etalonnageSec).toFixed(1));

      console.log(
        "✅ %c SUCCÈS ==> gestions Hum ==> 1️⃣  Définition de la température corrigée Sec ===============>",
        'color: green', temperatureCorrigeeSec
      );

      resolve();

    } catch (error) {

      console.log("❌ %c ERREUR ==> gestions Hum ==> Définition de la température Hum corrigée Sec",
        'color: orange', error);

      reject();

    }

  });
}

//? --------------------------------------------------

//? Tableau de correspondance sec.

let correspondancePressions;

let tableauCorrespondanceSec = () => {
  return new Promise((resolve, reject) => {

    try {

      if (temperatureCorrigeeSec == 10) {
        console.log("==> Correspondance des pressions Sec :  ", 12.28); correspondancePressions = 12.28; resolve();
      } else if (temperatureCorrigeeSec == 10.1) {
        console.log("==> Correspondance des pressions Sec :  ", 12.364); correspondancePressions = 12.364; resolve();
      } else if (temperatureCorrigeeSec == 10.2) {
        console.log("==> Correspondance des pressions Sec :  ", 12.448); correspondancePressions = 12.448; resolve();
      } else if (temperatureCorrigeeSec == 10.3) {
        console.log("==> Correspondance des pressions Sec :  ", 12.532); correspondancePressions = 12.532; resolve();
      } else if (temperatureCorrigeeSec == 10.4) {
        console.log("==> Correspondance des pressions Sec :  ", 12.616); correspondancePressions = 12.616; resolve();
      } else if (temperatureCorrigeeSec == 10.5) {
        console.log("==> Correspondance des pressions Sec :  ", 12.7); correspondancePressions = 12.7; resolve();
      } else if (temperatureCorrigeeSec == 10.6) {
        console.log("==> Correspondance des pressions Sec :  ", 12.784); correspondancePressions = 12.784; resolve();
      } else if (temperatureCorrigeeSec == 10.7) {
        console.log("==> Correspondance des pressions Sec :  ", 12.868); correspondancePressions = 12.868; resolve();
      } else if (temperatureCorrigeeSec == 10.8) {
        console.log("==> Correspondance des pressions Sec :  ", 12.952); correspondancePressions = 12.952; resolve();
      } else if (temperatureCorrigeeSec == 10.9) {
        console.log("==> Correspondance des pressions Sec :  ", 13.036); correspondancePressions = 13.036; resolve();
      } else if (temperatureCorrigeeSec == 11) {
        console.log("==> Correspondance des pressions Sec :  ", 13.12); correspondancePressions = 13.12; resolve();
      } else if (temperatureCorrigeeSec == 11.1) {
        console.log("==> Correspondance des pressions Sec :  ", 13.21); correspondancePressions = 13.21; resolve();
      } else if (temperatureCorrigeeSec == 11.2) {
        console.log("==> Correspondance des pressions Sec :  ", 13.3); correspondancePressions = 13.3; resolve();
      } else if (temperatureCorrigeeSec == 11.3) {
        console.log("==> Correspondance des pressions Sec :  ", 13.39); correspondancePressions = 13.39; resolve();
      } else if (temperatureCorrigeeSec == 11.4) {
        console.log("==> Correspondance des pressions Sec :  ", 13.48); correspondancePressions = 13.48; resolve();
      } else if (temperatureCorrigeeSec == 11.5) {
        console.log("==> Correspondance des pressions Sec :  ", 13.57); correspondancePressions = 13.57; resolve();
      } else if (temperatureCorrigeeSec == 11.6) {
        console.log("==> Correspondance des pressions Sec :  ", 13.66); correspondancePressions = 13.66; resolve();
      } else if (temperatureCorrigeeSec == 11.7) {
        console.log("==> Correspondance des pressions Sec :  ", 13.75); correspondancePressions = 13.75; resolve();
      } else if (temperatureCorrigeeSec == 11.8) {
        console.log("==> Correspondance des pressions Sec :  ", 13.84); correspondancePressions = 13.84; resolve();
      } else if (temperatureCorrigeeSec == 11.9) {
        console.log("==> Correspondance des pressions Sec :  ", 13.93); correspondancePressions = 13.93; resolve();
      } else if (temperatureCorrigeeSec == 12) {
        console.log("==> Correspondance des pressions Sec :  ", 14.02); correspondancePressions = 14.02; resolve();
      } else if (temperatureCorrigeeSec == 12.1) {
        console.log("==> Correspondance des pressions Sec :  ", 14.115); correspondancePressions = 14.115; resolve();
      } else if (temperatureCorrigeeSec == 12.2) {
        console.log("==> Correspondance des pressions Sec :  ", 14.21); correspondancePressions = 14.21; resolve();
      } else if (temperatureCorrigeeSec == 12.3) {
        console.log("==> Correspondance des pressions Sec :  ", 14.305); correspondancePressions = 14.305; resolve();
      } else if (temperatureCorrigeeSec == 12.4) {
        console.log("==> Correspondance des pressions Sec :  ", 14.4); correspondancePressions = 14.4; resolve();
      } else if (temperatureCorrigeeSec == 12.5) {
        console.log("==> Correspondance des pressions Sec :  ", 14.495); correspondancePressions = 14.495; resolve();
      } else if (temperatureCorrigeeSec == 12.6) {
        console.log("==> Correspondance des pressions Sec :  ", 14.59); correspondancePressions = 14.59; resolve();
      } else if (temperatureCorrigeeSec == 12.7) {
        console.log("==> Correspondance des pressions Sec :  ", 14.685); correspondancePressions = 14.685; resolve();
      } else if (temperatureCorrigeeSec == 12.8) {
        console.log("==> Correspondance des pressions Sec :  ", 14.78); correspondancePressions = 14.78; resolve();
      } else if (temperatureCorrigeeSec == 12.9) {
        console.log("==> Correspondance des pressions Sec :  ", 14.875); correspondancePressions = 14.875; resolve();
      } else if (temperatureCorrigeeSec == 13) {
        console.log("==> Correspondance des pressions Sec :  ", 14.97); correspondancePressions = 14.97; resolve();
      } else if (temperatureCorrigeeSec == 13.1) {
        console.log("==> Correspondance des pressions Sec :  ", 15.071); correspondancePressions = 15.071; resolve();
      } else if (temperatureCorrigeeSec == 13.2) {
        console.log("==> Correspondance des pressions Sec :  ", 15.172); correspondancePressions = 15.172; resolve();
      } else if (temperatureCorrigeeSec == 13.3) {
        console.log("==> Correspondance des pressions Sec :  ", 15.273); correspondancePressions = 15.273; resolve();
      } else if (temperatureCorrigeeSec == 13.4) {
        console.log("==> Correspondance des pressions Sec :  ", 15.374); correspondancePressions = 15.374; resolve();
      } else if (temperatureCorrigeeSec == 13.5) {
        console.log("==> Correspondance des pressions Sec :  ", 15.475); correspondancePressions = 15.475; resolve();
      } else if (temperatureCorrigeeSec == 13.6) {
        console.log("==> Correspondance des pressions Sec :  ", 15.576); correspondancePressions = 15.576; resolve();
      } else if (temperatureCorrigeeSec == 13.7) {
        console.log("==> Correspondance des pressions Sec :  ", 15.677); correspondancePressions = 15.677; resolve();
      } else if (temperatureCorrigeeSec == 13.8) {
        console.log("==> Correspondance des pressions Sec :  ", 15.778); correspondancePressions = 15.778; resolve();
      } else if (temperatureCorrigeeSec == 13.9) {
        console.log("==> Correspondance des pressions Sec :  ", 15.879); correspondancePressions = 15.879; resolve();
      } else if (temperatureCorrigeeSec == 14) {
        console.log("==> Correspondance des pressions Sec :  ", 15.98); correspondancePressions = 15.98; resolve();
      } else if (temperatureCorrigeeSec == 14.1) {
        console.log("==> Correspondance des pressions Sec :  ", 16.087); correspondancePressions = 16.087; resolve();
      } else if (temperatureCorrigeeSec == 14.2) {
        console.log("==> Correspondance des pressions Sec :  ", 16.194); correspondancePressions = 16.194; resolve();
      } else if (temperatureCorrigeeSec == 14.3) {
        console.log("==> Correspondance des pressions Sec :  ", 16.301); correspondancePressions = 16.301; resolve();
      } else if (temperatureCorrigeeSec == 14.4) {
        console.log("==> Correspondance des pressions Sec :  ", 16.408); correspondancePressions = 16.408; resolve();
      } else if (temperatureCorrigeeSec == 14.5) {
        console.log("==> Correspondance des pressions Sec :  ", 16.515); correspondancePressions = 16.515; resolve();
      } else if (temperatureCorrigeeSec == 14.6) {
        console.log("==> Correspondance des pressions Sec :  ", 16.622); correspondancePressions = 16.622; resolve();
      } else if (temperatureCorrigeeSec == 14.7) {
        console.log("==> Correspondance des pressions Sec :  ", 16.729); correspondancePressions = 16.729; resolve();
      } else if (temperatureCorrigeeSec == 14.8) {
        console.log("==> Correspondance des pressions Sec :  ", 16.836); correspondancePressions = 16.836; resolve();
      } else if (temperatureCorrigeeSec == 14.9) {
        console.log("==> Correspondance des pressions Sec :  ", 16.943); correspondancePressions = 16.943; resolve();
      } else if (temperatureCorrigeeSec == 15) {
        console.log("==> Correspondance des pressions Sec :  ", 17.05); correspondancePressions = 17.05; resolve();
      } else if (temperatureCorrigeeSec == 15.1) {
        console.log("==> Correspondance des pressions Sec :  ", 17.163); correspondancePressions = 17.163; resolve();
      } else if (temperatureCorrigeeSec == 15.2) {
        console.log("==> Correspondance des pressions Sec :  ", 17.276); correspondancePressions = 17.276; resolve();
      } else if (temperatureCorrigeeSec == 15.3) {
        console.log("==> Correspondance des pressions Sec :  ", 17.389); correspondancePressions = 17.389; resolve();
      } else if (temperatureCorrigeeSec == 15.4) {
        console.log("==> Correspondance des pressions Sec :  ", 17.502); correspondancePressions = 17.502; resolve();
      } else if (temperatureCorrigeeSec == 15.5) {
        console.log("==> Correspondance des pressions Sec :  ", 17.615); correspondancePressions = 17.615; resolve();
      } else if (temperatureCorrigeeSec == 15.6) {
        console.log("==> Correspondance des pressions Sec :  ", 17.728); correspondancePressions = 17.728; resolve();
      } else if (temperatureCorrigeeSec == 15.7) {
        console.log("==> Correspondance des pressions Sec :  ", 17.841); correspondancePressions = 17.841; resolve();
      } else if (temperatureCorrigeeSec == 15.8) {
        console.log("==> Correspondance des pressions Sec :  ", 17.954); correspondancePressions = 17.954; resolve();
      } else if (temperatureCorrigeeSec == 15.9) {
        console.log("==> Correspondance des pressions Sec :  ", 18.067); correspondancePressions = 18.067; resolve();
      } else if (temperatureCorrigeeSec == 16) {
        console.log("==> Correspondance des pressions Sec :  ", 18.18); correspondancePressions = 18.18; resolve();
      } else if (temperatureCorrigeeSec == 16.1) {
        console.log("==> Correspondance des pressions Sec :  ", 18.299); correspondancePressions = 18.299; resolve();
      } else if (temperatureCorrigeeSec == 16.2) {
        console.log("==> Correspondance des pressions Sec :  ", 18.418); correspondancePressions = 18.418; resolve();
      } else if (temperatureCorrigeeSec == 16.3) {
        console.log("==> Correspondance des pressions Sec :  ", 18.537); correspondancePressions = 18.537; resolve();
      } else if (temperatureCorrigeeSec == 16.4) {
        console.log("==> Correspondance des pressions Sec :  ", 18.656); correspondancePressions = 18.656; resolve();
      } else if (temperatureCorrigeeSec == 16.5) {
        console.log("==> Correspondance des pressions Sec :  ", 18.775); correspondancePressions = 18.775; resolve();
      } else if (temperatureCorrigeeSec == 16.6) {
        console.log("==> Correspondance des pressions Sec :  ", 18.894); correspondancePressions = 18.894; resolve();
      } else if (temperatureCorrigeeSec == 16.7) {
        console.log("==> Correspondance des pressions Sec :  ", 19.013); correspondancePressions = 19.013; resolve();
      } else if (temperatureCorrigeeSec == 16.8) {
        console.log("==> Correspondance des pressions Sec :  ", 19.132); correspondancePressions = 19.132; resolve();
      } else if (temperatureCorrigeeSec == 16.9) {
        console.log("==> Correspondance des pressions Sec :  ", 19.251); correspondancePressions = 19.251; resolve();
      } else if (temperatureCorrigeeSec == 17) {
        console.log("==> Correspondance des pressions Sec :  ", 19.37); correspondancePressions = 19.37; resolve();
      } else if (temperatureCorrigeeSec == 17.1) {
        console.log("==> Correspondance des pressions Sec :  ", 19.496); correspondancePressions = 19.496; resolve();
      } else if (temperatureCorrigeeSec == 17.2) {
        console.log("==> Correspondance des pressions Sec :  ", 19.622); correspondancePressions = 19.622; resolve();
      } else if (temperatureCorrigeeSec == 17.3) {
        console.log("==> Correspondance des pressions Sec :  ", 19.748); correspondancePressions = 19.748; resolve();
      } else if (temperatureCorrigeeSec == 17.4) {
        console.log("==> Correspondance des pressions Sec :  ", 19.874); correspondancePressions = 19.874; resolve();
      } else if (temperatureCorrigeeSec == 17.5) {
        console.log("==> Correspondance des pressions Sec :  ", 20); correspondancePressions = 20; resolve();
      } else if (temperatureCorrigeeSec == 17.6) {
        console.log("==> Correspondance des pressions Sec :  ", 20.126); correspondancePressions = 20.126; resolve();
      } else if (temperatureCorrigeeSec == 17.7) {
        console.log("==> Correspondance des pressions Sec :  ", 20.252); correspondancePressions = 20.252; resolve();
      } else if (temperatureCorrigeeSec == 17.8) {
        console.log("==> Correspondance des pressions Sec :  ", 20.378); correspondancePressions = 20.378; resolve();
      } else if (temperatureCorrigeeSec == 17.9) {
        console.log("==> Correspondance des pressions Sec :  ", 20.504); correspondancePressions = 20.504; resolve();
      } else if (temperatureCorrigeeSec == 18) {
        console.log("==> Correspondance des pressions Sec :  ", 20.63); correspondancePressions = 20.63; resolve();
      } else if (temperatureCorrigeeSec == 18.1) {
        console.log("==> Correspondance des pressions Sec :  ", 20.764); correspondancePressions = 20.764; resolve();
      } else if (temperatureCorrigeeSec == 18.2) {
        console.log("==> Correspondance des pressions Sec :  ", 20.898); correspondancePressions = 20.898; resolve();
      } else if (temperatureCorrigeeSec == 18.3) {
        console.log("==> Correspondance des pressions Sec :  ", 21.032); correspondancePressions = 21.032; resolve();
      } else if (temperatureCorrigeeSec == 18.4) {
        console.log("==> Correspondance des pressions Sec :  ", 21.166); correspondancePressions = 21.166; resolve();
      } else if (temperatureCorrigeeSec == 18.5) {
        console.log("==> Correspondance des pressions Sec :  ", 21.3); correspondancePressions = 21.3; resolve();
      } else if (temperatureCorrigeeSec == 18.6) {
        console.log("==> Correspondance des pressions Sec :  ", 21.434); correspondancePressions = 21.434; resolve();
      } else if (temperatureCorrigeeSec == 18.7) {
        console.log("==> Correspondance des pressions Sec :  ", 21.568); correspondancePressions = 21.568; resolve();
      } else if (temperatureCorrigeeSec == 18.8) {
        console.log("==> Correspondance des pressions Sec :  ", 21.702); correspondancePressions = 21.702; resolve();
      } else if (temperatureCorrigeeSec == 18.9) {
        console.log("==> Correspondance des pressions Sec :  ", 21.836); correspondancePressions = 21.836; resolve();
      } else if (temperatureCorrigeeSec == 19) {
        console.log("==> Correspondance des pressions Sec :  ", 21.97); correspondancePressions = 21.97; resolve();
      } else if (temperatureCorrigeeSec == 19.1) {
        console.log("==> Correspondance des pressions Sec :  ", 22.111); correspondancePressions = 22.111; resolve();
      } else if (temperatureCorrigeeSec == 19.2) {
        console.log("==> Correspondance des pressions Sec :  ", 22.252); correspondancePressions = 22.252; resolve();
      } else if (temperatureCorrigeeSec == 19.3) {
        console.log("==> Correspondance des pressions Sec :  ", 22.393); correspondancePressions = 22.393; resolve();
      } else if (temperatureCorrigeeSec == 19.4) {
        console.log("==> Correspondance des pressions Sec :  ", 22.534); correspondancePressions = 22.534; resolve();
      } else if (temperatureCorrigeeSec == 19.5) {
        console.log("==> Correspondance des pressions Sec :  ", 22.675); correspondancePressions = 22.675; resolve();
      } else if (temperatureCorrigeeSec == 19.6) {
        console.log("==> Correspondance des pressions Sec :  ", 22.816); correspondancePressions = 22.816; resolve();
      } else if (temperatureCorrigeeSec == 19.7) {
        console.log("==> Correspondance des pressions Sec :  ", 22.957); correspondancePressions = 22.957; resolve();
      } else if (temperatureCorrigeeSec == 19.8) {
        console.log("==> Correspondance des pressions Sec :  ", 23.098); correspondancePressions = 23.098; resolve();
      } else if (temperatureCorrigeeSec == 19.9) {
        console.log("==> Correspondance des pressions Sec :  ", 23.239); correspondancePressions = 23.239; resolve();
      } else if (temperatureCorrigeeSec == 20) {
        console.log("==> Correspondance des pressions Sec :  ", 23.38); correspondancePressions = 23.38; resolve();
      } else if (temperatureCorrigeeSec == 20.1) {
        console.log("==> Correspondance des pressions Sec :  ", 23.529); correspondancePressions = 23.529; resolve();
      } else if (temperatureCorrigeeSec == 20.2) {
        console.log("==> Correspondance des pressions Sec :  ", 23.678); correspondancePressions = 23.678; resolve();
      } else if (temperatureCorrigeeSec == 20.3) {
        console.log("==> Correspondance des pressions Sec :  ", 23.827); correspondancePressions = 23.827; resolve();
      } else if (temperatureCorrigeeSec == 20.4) {
        console.log("==> Correspondance des pressions Sec :  ", 23.976); correspondancePressions = 23.976; resolve();
      } else if (temperatureCorrigeeSec == 20.5) {
        console.log("==> Correspondance des pressions Sec :  ", 24.125); correspondancePressions = 24.125; resolve();
      } else if (temperatureCorrigeeSec == 20.6) {
        console.log("==> Correspondance des pressions Sec :  ", 24.274); correspondancePressions = 24.274; resolve();
      } else if (temperatureCorrigeeSec == 20.7) {
        console.log("==> Correspondance des pressions Sec :  ", 24.423); correspondancePressions = 24.423; resolve();
      } else if (temperatureCorrigeeSec == 20.8) {
        console.log("==> Correspondance des pressions Sec :  ", 24.572); correspondancePressions = 24.572; resolve();
      } else if (temperatureCorrigeeSec == 20.9) {
        console.log("==> Correspondance des pressions Sec :  ", 24.721); correspondancePressions = 24.721; resolve();
      } else if (temperatureCorrigeeSec == 21) {
        console.log("==> Correspondance des pressions Sec :  ", 24.87); correspondancePressions = 24.87; resolve();
      } else if (temperatureCorrigeeSec == 21.1) {
        console.log("==> Correspondance des pressions Sec :  ", 25.026); correspondancePressions = 25.026; resolve();
      } else if (temperatureCorrigeeSec == 21.2) {
        console.log("==> Correspondance des pressions Sec :  ", 25.182); correspondancePressions = 25.182; resolve();
      } else if (temperatureCorrigeeSec == 21.3) {
        console.log("==> Correspondance des pressions Sec :  ", 25.338); correspondancePressions = 25.338; resolve();
      } else if (temperatureCorrigeeSec == 21.4) {
        console.log("==> Correspondance des pressions Sec :  ", 25.494); correspondancePressions = 25.494; resolve();
      } else if (temperatureCorrigeeSec == 21.5) {
        console.log("==> Correspondance des pressions Sec :  ", 25.65); correspondancePressions = 25.65; resolve();
      } else if (temperatureCorrigeeSec == 21.6) {
        console.log("==> Correspondance des pressions Sec :  ", 25.806); correspondancePressions = 25.806; resolve();
      } else if (temperatureCorrigeeSec == 21.7) {
        console.log("==> Correspondance des pressions Sec :  ", 25.962); correspondancePressions = 25.962; resolve();
      } else if (temperatureCorrigeeSec == 21.8) {
        console.log("==> Correspondance des pressions Sec :  ", 26.118); correspondancePressions = 26.118; resolve();
      } else if (temperatureCorrigeeSec == 21.9) {
        console.log("==> Correspondance des pressions Sec :  ", 26.274); correspondancePressions = 26.274; resolve();
      } else if (temperatureCorrigeeSec == 22) {
        console.log("==> Correspondance des pressions Sec :  ", 26.43); correspondancePressions = 26.43; resolve();
      } else if (temperatureCorrigeeSec == 22.1) {
        console.log("==> Correspondance des pressions Sec :  ", 26.596); correspondancePressions = 26.596; resolve();
      } else if (temperatureCorrigeeSec == 22.2) {
        console.log("==> Correspondance des pressions Sec :  ", 26.762); correspondancePressions = 26.762; resolve();
      } else if (temperatureCorrigeeSec == 22.3) {
        console.log("==> Correspondance des pressions Sec :  ", 26.928); correspondancePressions = 26.928; resolve();
      } else if (temperatureCorrigeeSec == 22.4) {
        console.log("==> Correspondance des pressions Sec :  ", 27.094); correspondancePressions = 27.094; resolve();
      } else if (temperatureCorrigeeSec == 22.5) {
        console.log("==> Correspondance des pressions Sec :  ", 27.26); correspondancePressions = 27.26; resolve();
      } else if (temperatureCorrigeeSec == 22.6) {
        console.log("==> Correspondance des pressions Sec :  ", 27.426); correspondancePressions = 27.426; resolve();
      } else if (temperatureCorrigeeSec == 22.7) {
        console.log("==> Correspondance des pressions Sec :  ", 27.592); correspondancePressions = 27.592; resolve();
      } else if (temperatureCorrigeeSec == 22.8) {
        console.log("==> Correspondance des pressions Sec :  ", 27.758); correspondancePressions = 27.758; resolve();
      } else if (temperatureCorrigeeSec == 22.9) {
        console.log("==> Correspondance des pressions Sec :  ", 27.924); correspondancePressions = 27.924; resolve();
      } else if (temperatureCorrigeeSec == 23) {
        console.log("==> Correspondance des pressions Sec :  ", 28.09); correspondancePressions = 28.09; resolve();
      } else if (temperatureCorrigeeSec == 23.1) {
        console.log("==> Correspondance des pressions Sec :  ", 28.264); correspondancePressions = 28.264; resolve();
      } else if (temperatureCorrigeeSec == 23.2) {
        console.log("==> Correspondance des pressions Sec :  ", 28.438); correspondancePressions = 28.438; resolve();
      } else if (temperatureCorrigeeSec == 23.3) {
        console.log("==> Correspondance des pressions Sec :  ", 28.612); correspondancePressions = 28.612; resolve();
      } else if (temperatureCorrigeeSec == 23.4) {
        console.log("==> Correspondance des pressions Sec :  ", 28.786); correspondancePressions = 28.786; resolve();
      } else if (temperatureCorrigeeSec == 23.5) {
        console.log("==> Correspondance des pressions Sec :  ", 28.96); correspondancePressions = 28.96; resolve();
      } else if (temperatureCorrigeeSec == 23.6) {
        console.log("==> Correspondance des pressions Sec :  ", 29.134); correspondancePressions = 29.134; resolve();
      } else if (temperatureCorrigeeSec == 23.7) {
        console.log("==> Correspondance des pressions Sec :  ", 29.308); correspondancePressions = 29.308; resolve();
      } else if (temperatureCorrigeeSec == 23.8) {
        console.log("==> Correspondance des pressions Sec :  ", 29.482); correspondancePressions = 29.482; resolve();
      } else if (temperatureCorrigeeSec == 23.9) {
        console.log("==> Correspondance des pressions Sec :  ", 29.656); correspondancePressions = 29.656; resolve();
      } else if (temperatureCorrigeeSec == 24) {
        console.log("==> Correspondance des pressions Sec :  ", 29.83); correspondancePressions = 29.83; resolve();
      } else if (temperatureCorrigeeSec == 24.1) {
        console.log("==> Correspondance des pressions Sec :  ", 30.014); correspondancePressions = 30.014; resolve();
      } else if (temperatureCorrigeeSec == 24.2) {
        console.log("==> Correspondance des pressions Sec :  ", 30.198); correspondancePressions = 30.198; resolve();
      } else if (temperatureCorrigeeSec == 24.3) {
        console.log("==> Correspondance des pressions Sec :  ", 30.382); correspondancePressions = 30.382; resolve();
      } else if (temperatureCorrigeeSec == 24.4) {
        console.log("==> Correspondance des pressions Sec :  ", 30.566); correspondancePressions = 30.566; resolve();
      } else if (temperatureCorrigeeSec == 24.5) {
        console.log("==> Correspondance des pressions Sec :  ", 30.75); correspondancePressions = 30.75; resolve();
      } else if (temperatureCorrigeeSec == 24.6) {
        console.log("==> Correspondance des pressions Sec :  ", 30.934); correspondancePressions = 30.934; resolve();
      } else if (temperatureCorrigeeSec == 24.7) {
        console.log("==> Correspondance des pressions Sec :  ", 31.118); correspondancePressions = 31.118; resolve();
      } else if (temperatureCorrigeeSec == 24.8) {
        console.log("==> Correspondance des pressions Sec :  ", 31.302); correspondancePressions = 31.302; resolve();
      } else if (temperatureCorrigeeSec == 24.9) {
        console.log("==> Correspondance des pressions Sec :  ", 31.486); correspondancePressions = 31.486; resolve();
      } else if (temperatureCorrigeeSec == 25) {
        console.log("==> Correspondance des pressions Sec :  ", 31.67); correspondancePressions = 31.67; resolve();
      } else if (temperatureCorrigeeSec == 25.1) {
        console.log("==> Correspondance des pressions Sec :  ", 31.863); correspondancePressions = 31.863; resolve();
      } else if (temperatureCorrigeeSec == 25.2) {
        console.log("==> Correspondance des pressions Sec :  ", 32.056); correspondancePressions = 32.056; resolve();
      } else if (temperatureCorrigeeSec == 25.3) {
        console.log("==> Correspondance des pressions Sec :  ", 32.249); correspondancePressions = 32.249; resolve();
      } else if (temperatureCorrigeeSec == 25.4) {
        console.log("==> Correspondance des pressions Sec :  ", 32.442); correspondancePressions = 32.442; resolve();
      } else if (temperatureCorrigeeSec == 25.5) {
        console.log("==> Correspondance des pressions Sec :  ", 32.635); correspondancePressions = 32.635; resolve();
      } else if (temperatureCorrigeeSec == 25.6) {
        console.log("==> Correspondance des pressions Sec :  ", 32.828); correspondancePressions = 32.828; resolve();
      } else if (temperatureCorrigeeSec == 25.7) {
        console.log("==> Correspondance des pressions Sec :  ", 33.021); correspondancePressions = 33.021; resolve();
      } else if (temperatureCorrigeeSec == 25.8) {
        console.log("==> Correspondance des pressions Sec :  ", 33.214); correspondancePressions = 33.214; resolve();
      } else if (temperatureCorrigeeSec == 25.9) {
        console.log("==> Correspondance des pressions Sec :  ", 33.407); correspondancePressions = 33.407; resolve();
      } else if (temperatureCorrigeeSec == 26) {
        console.log("==> Correspondance des pressions Sec :  ", 33.6); correspondancePressions = 33.6; resolve();
      } else if (temperatureCorrigeeSec == 26.1) {
        console.log("==> Correspondance des pressions Sec :  ", 33.804); correspondancePressions = 33.804; resolve();
      } else if (temperatureCorrigeeSec == 26.2) {
        console.log("==> Correspondance des pressions Sec :  ", 34.008); correspondancePressions = 34.008; resolve();
      } else if (temperatureCorrigeeSec == 26.3) {
        console.log("==> Correspondance des pressions Sec :  ", 34.212); correspondancePressions = 34.212; resolve();
      } else if (temperatureCorrigeeSec == 26.4) {
        console.log("==> Correspondance des pressions Sec :  ", 34.416); correspondancePressions = 34.416; resolve();
      } else if (temperatureCorrigeeSec == 26.5) {
        console.log("==> Correspondance des pressions Sec :  ", 34.62); correspondancePressions = 34.62; resolve();
      } else if (temperatureCorrigeeSec == 26.6) {
        console.log("==> Correspondance des pressions Sec :  ", 34.824); correspondancePressions = 34.824; resolve();
      } else if (temperatureCorrigeeSec == 26.7) {
        console.log("==> Correspondance des pressions Sec :  ", 35.028); correspondancePressions = 35.028; resolve();
      } else if (temperatureCorrigeeSec == 26.8) {
        console.log("==> Correspondance des pressions Sec :  ", 35.232); correspondancePressions = 35.232; resolve();
      } else if (temperatureCorrigeeSec == 26.9) {
        console.log("==> Correspondance des pressions Sec :  ", 35.436); correspondancePressions = 35.436; resolve();
      } else if (temperatureCorrigeeSec == 27) {
        console.log("==> Correspondance des pressions Sec :  ", 35.64); correspondancePressions = 35.64; resolve();
      } else if (temperatureCorrigeeSec == 27.1) {
        console.log("==> Correspondance des pressions Sec :  ", 35.856); correspondancePressions = 35.856; resolve();
      } else if (temperatureCorrigeeSec == 27.2) {
        console.log("==> Correspondance des pressions Sec :  ", 36.072); correspondancePressions = 36.072; resolve();
      } else if (temperatureCorrigeeSec == 27.3) {
        console.log("==> Correspondance des pressions Sec :  ", 36.288); correspondancePressions = 36.288; resolve();
      } else if (temperatureCorrigeeSec == 27.4) {
        console.log("==> Correspondance des pressions Sec :  ", 36.504); correspondancePressions = 36.504; resolve();
      } else if (temperatureCorrigeeSec == 27.5) {
        console.log("==> Correspondance des pressions Sec :  ", 36.72); correspondancePressions = 36.72; resolve();
      } else if (temperatureCorrigeeSec == 27.6) {
        console.log("==> Correspondance des pressions Sec :  ", 36.936); correspondancePressions = 36.936; resolve();
      } else if (temperatureCorrigeeSec == 27.7) {
        console.log("==> Correspondance des pressions Sec :  ", 37.152); correspondancePressions = 37.152; resolve();
      } else if (temperatureCorrigeeSec == 27.8) {
        console.log("==> Correspondance des pressions Sec :  ", 37.368); correspondancePressions = 37.368; resolve();
      } else if (temperatureCorrigeeSec == 27.9) {
        console.log("==> Correspondance des pressions Sec :  ", 37.584); correspondancePressions = 37.584; resolve();
      } else if (temperatureCorrigeeSec == 28) {
        console.log("==> Correspondance des pressions Sec :  ", 37.8); correspondancePressions = 37.8; resolve();
      } else if (temperatureCorrigeeSec == 28.1) {
        console.log("==> Correspondance des pressions Sec :  ", 38.025); correspondancePressions = 38.025; resolve();
      } else if (temperatureCorrigeeSec == 28.2) {
        console.log("==> Correspondance des pressions Sec :  ", 38.25); correspondancePressions = 38.25; resolve();
      } else if (temperatureCorrigeeSec == 28.3) {
        console.log("==> Correspondance des pressions Sec :  ", 38.475); correspondancePressions = 38.475; resolve();
      } else if (temperatureCorrigeeSec == 28.4) {
        console.log("==> Correspondance des pressions Sec :  ", 38.7); correspondancePressions = 38.7; resolve();
      } else if (temperatureCorrigeeSec == 28.5) {
        console.log("==> Correspondance des pressions Sec :  ", 38.925); correspondancePressions = 38.925; resolve();
      } else if (temperatureCorrigeeSec == 28.6) {
        console.log("==> Correspondance des pressions Sec :  ", 39.15); correspondancePressions = 39.15; resolve();
      } else if (temperatureCorrigeeSec == 28.7) {
        console.log("==> Correspondance des pressions Sec :  ", 39.375); correspondancePressions = 39.375; resolve();
      } else if (temperatureCorrigeeSec == 28.8) {
        console.log("==> Correspondance des pressions Sec :  ", 39.6); correspondancePressions = 39.6; resolve();
      } else if (temperatureCorrigeeSec == 28.9) {
        console.log("==> Correspondance des pressions Sec :  ", 39.825); correspondancePressions = 39.825; resolve();
      } else if (temperatureCorrigeeSec == 29) {
        console.log("==> Correspondance des pressions Sec :  ", 40.05); correspondancePressions = 40.05; resolve();
      } else if (temperatureCorrigeeSec == 29.1) {
        console.log("==> Correspondance des pressions Sec :  ", 40.288); correspondancePressions = 40.288; resolve();
      } else if (temperatureCorrigeeSec == 29.2) {
        console.log("==> Correspondance des pressions Sec :  ", 40.526); correspondancePressions = 40.526; resolve();
      } else if (temperatureCorrigeeSec == 29.3) {
        console.log("==> Correspondance des pressions Sec :  ", 40.764); correspondancePressions = 40.764; resolve();
      } else if (temperatureCorrigeeSec == 29.4) {
        console.log("==> Correspondance des pressions Sec :  ", 41.002); correspondancePressions = 41.002; resolve();
      } else if (temperatureCorrigeeSec == 29.5) {
        console.log("==> Correspondance des pressions Sec :  ", 41.24); correspondancePressions = 41.24; resolve();
      } else if (temperatureCorrigeeSec == 29.6) {
        console.log("==> Correspondance des pressions Sec :  ", 41.478); correspondancePressions = 41.478; resolve();
      } else if (temperatureCorrigeeSec == 29.7) {
        console.log("==> Correspondance des pressions Sec :  ", 41.716); correspondancePressions = 41.716; resolve();
      } else if (temperatureCorrigeeSec == 29.8) {
        console.log("==> Correspondance des pressions Sec :  ", 41.954); correspondancePressions = 41.954; resolve();
      } else if (temperatureCorrigeeSec == 29.9) {
        console.log("==> Correspondance des pressions Sec :  ", 42.192); correspondancePressions = 42.192; resolve();
      } else if (temperatureCorrigeeSec == 30) {
        console.log("==> Correspondance des pressions Sec :  ", 42.43); correspondancePressions = 42.43; resolve();
      } else if (temperatureCorrigeeSec == 30.1) {
        console.log("==> Correspondance des pressions Sec :  ", 42.679); correspondancePressions = 42.679; resolve();
      } else if (temperatureCorrigeeSec == 30.2) {
        console.log("==> Correspondance des pressions Sec :  ", 42.928); correspondancePressions = 42.928; resolve();
      } else if (temperatureCorrigeeSec == 30.3) {
        console.log("==> Correspondance des pressions Sec :  ", 43.177); correspondancePressions = 43.177; resolve();
      } else if (temperatureCorrigeeSec == 30.4) {
        console.log("==> Correspondance des pressions Sec :  ", 43.426); correspondancePressions = 43.426; resolve();
      } else if (temperatureCorrigeeSec == 30.5) {
        console.log("==> Correspondance des pressions Sec :  ", 43.675); correspondancePressions = 43.675; resolve();
      } else if (temperatureCorrigeeSec == 30.6) {
        console.log("==> Correspondance des pressions Sec :  ", 43.924); correspondancePressions = 43.924; resolve();
      } else if (temperatureCorrigeeSec == 30.7) {
        console.log("==> Correspondance des pressions Sec :  ", 44.173); correspondancePressions = 44.173; resolve();
      } else if (temperatureCorrigeeSec == 30.8) {
        console.log("==> Correspondance des pressions Sec :  ", 44.422); correspondancePressions = 44.422; resolve();
      } else if (temperatureCorrigeeSec == 30.9) {
        console.log("==> Correspondance des pressions Sec :  ", 44.671); correspondancePressions = 44.671; resolve();
      } else if (temperatureCorrigeeSec == 31) {
        console.log("==> Correspondance des pressions Sec :  ", 44.92); correspondancePressions = 44.92; resolve();
      } else if (temperatureCorrigeeSec == 31.1) {
        console.log("==> Correspondance des pressions Sec :  ", 45.183); correspondancePressions = 45.183; resolve();
      } else if (temperatureCorrigeeSec == 31.2) {
        console.log("==> Correspondance des pressions Sec :  ", 45.446); correspondancePressions = 45.446; resolve();
      } else if (temperatureCorrigeeSec == 31.3) {
        console.log("==> Correspondance des pressions Sec :  ", 45.709); correspondancePressions = 45.709; resolve();
      } else if (temperatureCorrigeeSec == 31.4) {
        console.log("==> Correspondance des pressions Sec :  ", 45.972); correspondancePressions = 45.972; resolve();
      } else if (temperatureCorrigeeSec == 31.5) {
        console.log("==> Correspondance des pressions Sec :  ", 46.235); correspondancePressions = 46.235; resolve();
      } else if (temperatureCorrigeeSec == 31.6) {
        console.log("==> Correspondance des pressions Sec :  ", 46.498); correspondancePressions = 46.498; resolve();
      } else if (temperatureCorrigeeSec == 31.7) {
        console.log("==> Correspondance des pressions Sec :  ", 46.761); correspondancePressions = 46.761; resolve();
      } else if (temperatureCorrigeeSec == 31.8) {
        console.log("==> Correspondance des pressions Sec :  ", 47.024); correspondancePressions = 47.024; resolve();
      } else if (temperatureCorrigeeSec == 31.9) {
        console.log("==> Correspondance des pressions Sec :  ", 47.287); correspondancePressions = 47.287; resolve();
      } else if (temperatureCorrigeeSec == 32) {
        console.log("==> Correspondance des pressions Sec :  ", 47.55); correspondancePressions = 47.55; resolve();
      } else if (temperatureCorrigeeSec == 32.1) {
        console.log("==> Correspondance des pressions Sec :  ", 47.825); correspondancePressions = 47.825; resolve();
      } else if (temperatureCorrigeeSec == 32.2) {
        console.log("==> Correspondance des pressions Sec :  ", 48.1); correspondancePressions = 48.1; resolve();
      } else if (temperatureCorrigeeSec == 32.3) {
        console.log("==> Correspondance des pressions Sec :  ", 48.375); correspondancePressions = 48.375; resolve();
      } else if (temperatureCorrigeeSec == 32.4) {
        console.log("==> Correspondance des pressions Sec :  ", 48.65); correspondancePressions = 48.65; resolve();
      } else if (temperatureCorrigeeSec == 32.5) {
        console.log("==> Correspondance des pressions Sec :  ", 48.925); correspondancePressions = 48.925; resolve();
      } else if (temperatureCorrigeeSec == 32.6) {
        console.log("==> Correspondance des pressions Sec :  ", 49.2); correspondancePressions = 49.2; resolve();
      } else if (temperatureCorrigeeSec == 32.7) {
        console.log("==> Correspondance des pressions Sec :  ", 49.475); correspondancePressions = 49.475; resolve();
      } else if (temperatureCorrigeeSec == 32.8) {
        console.log("==> Correspondance des pressions Sec :  ", 49.75); correspondancePressions = 49.75; resolve();
      } else if (temperatureCorrigeeSec == 32.9) {
        console.log("==> Correspondance des pressions Sec :  ", 50.025); correspondancePressions = 50.025; resolve();
      } else if (temperatureCorrigeeSec == 33) {
        console.log("==> Correspondance des pressions Sec :  ", 50.3); correspondancePressions = 50.3; resolve();
      } else if (temperatureCorrigeeSec == 33.1) {
        console.log("==> Correspondance des pressions Sec :  ", 50.589); correspondancePressions = 50.589; resolve();
      } else if (temperatureCorrigeeSec == 33.2) {
        console.log("==> Correspondance des pressions Sec :  ", 50.878); correspondancePressions = 50.878; resolve();
      } else if (temperatureCorrigeeSec == 33.3) {
        console.log("==> Correspondance des pressions Sec :  ", 51.167); correspondancePressions = 51.167; resolve();
      } else if (temperatureCorrigeeSec == 33.4) {
        console.log("==> Correspondance des pressions Sec :  ", 51.456); correspondancePressions = 51.456; resolve();
      } else if (temperatureCorrigeeSec == 33.5) {
        console.log("==> Correspondance des pressions Sec :  ", 51.745); correspondancePressions = 51.745; resolve();
      } else if (temperatureCorrigeeSec == 33.6) {
        console.log("==> Correspondance des pressions Sec :  ", 52.034); correspondancePressions = 52.034; resolve();
      } else if (temperatureCorrigeeSec == 33.7) {
        console.log("==> Correspondance des pressions Sec :  ", 52.323); correspondancePressions = 52.323; resolve();
      } else if (temperatureCorrigeeSec == 33.8) {
        console.log("==> Correspondance des pressions Sec :  ", 52.612); correspondancePressions = 52.612; resolve();
      } else if (temperatureCorrigeeSec == 33.9) {
        console.log("==> Correspondance des pressions Sec :  ", 52.901); correspondancePressions = 52.901; resolve();
      } else if (temperatureCorrigeeSec == 34) {
        console.log("==> Correspondance des pressions Sec :  ", 53.19); correspondancePressions = 53.19; resolve();
      } else if (temperatureCorrigeeSec == 34.1) {
        console.log("==> Correspondance des pressions Sec :  ", 53.494); correspondancePressions = 53.494; resolve();
      } else if (temperatureCorrigeeSec == 34.2) {
        console.log("==> Correspondance des pressions Sec :  ", 53.798); correspondancePressions = 53.798; resolve();
      } else if (temperatureCorrigeeSec == 34.3) {
        console.log("==> Correspondance des pressions Sec :  ", 54.102); correspondancePressions = 54.102; resolve();
      } else if (temperatureCorrigeeSec == 34.4) {
        console.log("==> Correspondance des pressions Sec :  ", 54.406); correspondancePressions = 54.406; resolve();
      } else if (temperatureCorrigeeSec == 34.5) {
        console.log("==> Correspondance des pressions Sec :  ", 54.71); correspondancePressions = 54.71; resolve();
      } else if (temperatureCorrigeeSec == 34.6) {
        console.log("==> Correspondance des pressions Sec :  ", 55.014); correspondancePressions = 55.014; resolve();
      } else if (temperatureCorrigeeSec == 34.7) {
        console.log("==> Correspondance des pressions Sec :  ", 55.318); correspondancePressions = 55.318; resolve();
      } else if (temperatureCorrigeeSec == 34.8) {
        console.log("==> Correspondance des pressions Sec :  ", 55.622); correspondancePressions = 55.622; resolve();
      } else if (temperatureCorrigeeSec == 34.9) {
        console.log("==> Correspondance des pressions Sec :  ", 55.926); correspondancePressions = 55.926; resolve();
      } else if (temperatureCorrigeeSec == 35) { console.log("==> Correspondance des pressions Sec :  ", 56.23); correspondancePressions = 56.23; } resolve();


    } catch (error) {

      console.log("❌ %c ERREUR ==> gestions Hum ==> Tableau de correspondance Sec",
        'color: orange', error);

      reject();

    }


  });
}

//? --------------------------------------------------

//? Récupération de l'étalonage Hum.

let etalonnageHum

const gestionHumEtallonnageModels = db.etalonnageHum;

let recuperationDeEtalonageHum = () => {
  return new Promise((resolve, reject) => {

    try {
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
              //console.log(result);

              etalonnageHum = result['etalonnageHum'];

              console.log(
                "✅ %c SUCCÈS ==> gestions Hum ==> 2️⃣  Récupération de l'étalonage Hum =========================>",
                'color: green', etalonnageHum
              );

            })
            .then(() => {

              resolve();

            });
        });
    } catch (error) {

      console.log("❌ %c ERREUR ==> gestions Hum ==> Récupération de l'étalonage Hum",
        'color: orange', error);

      reject();
    }

  });
}

//? --------------------------------------------------

//? Mesure de la température Hum.

let mcpBrocheHum = 1;
let listValHum = [];

let getTemperaturesHum = () => {
  return new Promise((resolve, reject) => {

    try {

      let temps = 0;

      let count = () => {
        temps = temps++;

        //console.log(temps++);

        if (temps++ === 39) {
          clearInterval(conteur);

        }

        // console.log(jaune, '[ GESTION SUBSTRAT CALCULES  ] temps', temps);

        const tempSensor = mcpadc.open(mcpBrocheHum, { speedHz: 20000 }, (err) => {
          if (err) throw err;

          tempSensor.read((err, reading) => {
            if (err) throw err;
            listValHum.push(reading.value * 40);

            // console.log(
            //   "✅ %c SUCCÈS ==> gestions Hum ==> Mesure de la température Hum",
            //   'color: green', listValHum
            // );

            if (listValHum.length >= 40) {
              // console.log('listValHum.length >=40');
              resolve()
            }
          });
        });

      };

      let conteur = setInterval(count, 1000);

    } catch (error) {

      console.log("❌ %c ERREUR ==> gestions Hum ==> Mesure de la température Sec",
        'color: orange', error);

      reject();

    }

  });
}

//? --------------------------------------------------

//? Calcule de la température moyenne Hum.

let temperatureMoyenneHum;

let calculeDeLaTemperatureMoyenneHum = () => {
  return new Promise((resolve, reject) => {

    try {

      let arrayLength = listValHum.length
      // console.log('Nb valeurs de listValHum :', arrayLength);

      const reducer = (accumulator, curr) => accumulator + curr;
      let sumlistVal = listValHum.reduce(reducer)
      // console.log('Somme valeurs listValHum : ', sumlistValHum);

      // temperatureMoyenneHum = Math.round((sumlistVal / arrayLength) * 100) / 100;

      temperatureMoyenneHum = (sumlistVal / arrayLength);

      console.log(
        "✅ %c SUCCÈS ==> gestions Hum ==> 2️⃣  Temperature moyenne brute Hum ===========================>",
        'color: green ', temperatureMoyenneHum
      );

      resolve();

    } catch (error) {

      console.log("❌ %c ERREUR ==> gestions Hum ==> Temperature Hum moyenne Hum ===========>",
        'color: orange', error);

      reject();

    }

  });
}

//? --------------------------------------------------

//? Définition de la température Hum corrigée Hum.

let temperatureCorrigeeHum;

let definitionTemperatureHumcorrigee = () => {
  return new Promise((resolve, reject) => {

    try {

      temperatureCorrigeeHum = parseFloat((temperatureMoyenneHum + etalonnageHum).toFixed(1));


      console.log(
        "✅ %c SUCCÈS ==> gestions Hum ==> 2️⃣  Définition de la température corrigée Hum ===============>",
        'color: green', temperatureCorrigeeHum
      );

      resolve();

    } catch (error) {

      console.log("❌ %c ERREUR ==> gestions Hum ==> Définition de la température Hum corrigée Hum",
        'color: orange', error);

      reject();

    }

  });
}

//? --------------------------------------------------

//? Tableau de correspondance sec.

let correspondancePressionsHum;

let tableauCorrespondanceHum = () => {
  return new Promise((resolve, reject) => {

    try {

      if (temperatureCorrigeeHum == 10) {
        console.log("==> Correspondance des pressions Hum :  ", 12.28); correspondancePressionsHum = 12.28; resolve();
      } else if (temperatureCorrigeeHum == 10.1) {
        console.log("==> Correspondance des pressions Hum :  ", 12.364); correspondancePressionsHum = 12.364; resolve();
      } else if (temperatureCorrigeeHum == 10.2) {
        console.log("==> Correspondance des pressions Hum :  ", 12.448); correspondancePressionsHum = 12.448; resolve();
      } else if (temperatureCorrigeeHum == 10.3) {
        console.log("==> Correspondance des pressions Hum :  ", 12.532); correspondancePressionsHum = 12.532; resolve();
      } else if (temperatureCorrigeeHum == 10.4) {
        console.log("==> Correspondance des pressions Hum :  ", 12.616); correspondancePressionsHum = 12.616; resolve();
      } else if (temperatureCorrigeeHum == 10.5) {
        console.log("==> Correspondance des pressions Hum :  ", 12.7); correspondancePressionsHum = 12.7; resolve();
      } else if (temperatureCorrigeeHum == 10.6) {
        console.log("==> Correspondance des pressions Hum :  ", 12.784); correspondancePressionsHum = 12.784; resolve();
      } else if (temperatureCorrigeeHum == 10.7) {
        console.log("==> Correspondance des pressions Hum :  ", 12.868); correspondancePressionsHum = 12.868; resolve();
      } else if (temperatureCorrigeeHum == 10.8) {
        console.log("==> Correspondance des pressions Hum :  ", 12.952); correspondancePressionsHum = 12.952; resolve();
      } else if (temperatureCorrigeeHum == 10.9) {
        console.log("==> Correspondance des pressions Hum :  ", 13.036); correspondancePressionsHum = 13.036; resolve();
      } else if (temperatureCorrigeeHum == 11) {
        console.log("==> Correspondance des pressions Hum :  ", 13.12); correspondancePressionsHum = 13.12; resolve();
      } else if (temperatureCorrigeeHum == 11.1) {
        console.log("==> Correspondance des pressions Hum :  ", 13.21); correspondancePressionsHum = 13.21; resolve();
      } else if (temperatureCorrigeeHum == 11.2) {
        console.log("==> Correspondance des pressions Hum :  ", 13.3); correspondancePressionsHum = 13.3; resolve();
      } else if (temperatureCorrigeeHum == 11.3) {
        console.log("==> Correspondance des pressions Hum :  ", 13.39); correspondancePressionsHum = 13.39; resolve();
      } else if (temperatureCorrigeeHum == 11.4) {
        console.log("==> Correspondance des pressions Hum :  ", 13.48); correspondancePressionsHum = 13.48; resolve();
      } else if (temperatureCorrigeeHum == 11.5) {
        console.log("==> Correspondance des pressions Hum :  ", 13.57); correspondancePressionsHum = 13.57; resolve();
      } else if (temperatureCorrigeeHum == 11.6) {
        console.log("==> Correspondance des pressions Hum :  ", 13.66); correspondancePressionsHum = 13.66; resolve();
      } else if (temperatureCorrigeeHum == 11.7) {
        console.log("==> Correspondance des pressions Hum :  ", 13.75); correspondancePressionsHum = 13.75; resolve();
      } else if (temperatureCorrigeeHum == 11.8) {
        console.log("==> Correspondance des pressions Hum :  ", 13.84); correspondancePressionsHum = 13.84; resolve();
      } else if (temperatureCorrigeeHum == 11.9) {
        console.log("==> Correspondance des pressions Hum :  ", 13.93); correspondancePressionsHum = 13.93; resolve();
      } else if (temperatureCorrigeeHum == 12) {
        console.log("==> Correspondance des pressions Hum :  ", 14.02); correspondancePressionsHum = 14.02; resolve();
      } else if (temperatureCorrigeeHum == 12.1) {
        console.log("==> Correspondance des pressions Hum :  ", 14.115); correspondancePressionsHum = 14.115; resolve();
      } else if (temperatureCorrigeeHum == 12.2) {
        console.log("==> Correspondance des pressions Hum :  ", 14.21); correspondancePressionsHum = 14.21; resolve();
      } else if (temperatureCorrigeeHum == 12.3) {
        console.log("==> Correspondance des pressions Hum :  ", 14.305); correspondancePressionsHum = 14.305; resolve();
      } else if (temperatureCorrigeeHum == 12.4) {
        console.log("==> Correspondance des pressions Hum :  ", 14.4); correspondancePressionsHum = 14.4; resolve();
      } else if (temperatureCorrigeeHum == 12.5) {
        console.log("==> Correspondance des pressions Hum :  ", 14.495); correspondancePressionsHum = 14.495; resolve();
      } else if (temperatureCorrigeeHum == 12.6) {
        console.log("==> Correspondance des pressions Hum :  ", 14.59); correspondancePressionsHum = 14.59; resolve();
      } else if (temperatureCorrigeeHum == 12.7) {
        console.log("==> Correspondance des pressions Hum :  ", 14.685); correspondancePressionsHum = 14.685; resolve();
      } else if (temperatureCorrigeeHum == 12.8) {
        console.log("==> Correspondance des pressions Hum :  ", 14.78); correspondancePressionsHum = 14.78; resolve();
      } else if (temperatureCorrigeeHum == 12.9) {
        console.log("==> Correspondance des pressions Hum :  ", 14.875); correspondancePressionsHum = 14.875; resolve();
      } else if (temperatureCorrigeeHum == 13) {
        console.log("==> Correspondance des pressions Hum :  ", 14.97); correspondancePressionsHum = 14.97; resolve();
      } else if (temperatureCorrigeeHum == 13.1) {
        console.log("==> Correspondance des pressions Hum :  ", 15.071); correspondancePressionsHum = 15.071; resolve();
      } else if (temperatureCorrigeeHum == 13.2) {
        console.log("==> Correspondance des pressions Hum :  ", 15.172); correspondancePressionsHum = 15.172; resolve();
      } else if (temperatureCorrigeeHum == 13.3) {
        console.log("==> Correspondance des pressions Hum :  ", 15.273); correspondancePressionsHum = 15.273; resolve();
      } else if (temperatureCorrigeeHum == 13.4) {
        console.log("==> Correspondance des pressions Hum :  ", 15.374); correspondancePressionsHum = 15.374; resolve();
      } else if (temperatureCorrigeeHum == 13.5) {
        console.log("==> Correspondance des pressions Hum :  ", 15.475); correspondancePressionsHum = 15.475; resolve();
      } else if (temperatureCorrigeeHum == 13.6) {
        console.log("==> Correspondance des pressions Hum :  ", 15.576); correspondancePressionsHum = 15.576; resolve();
      } else if (temperatureCorrigeeHum == 13.7) {
        console.log("==> Correspondance des pressions Hum :  ", 15.677); correspondancePressionsHum = 15.677; resolve();
      } else if (temperatureCorrigeeHum == 13.8) {
        console.log("==> Correspondance des pressions Hum :  ", 15.778); correspondancePressionsHum = 15.778; resolve();
      } else if (temperatureCorrigeeHum == 13.9) {
        console.log("==> Correspondance des pressions Hum :  ", 15.879); correspondancePressionsHum = 15.879; resolve();
      } else if (temperatureCorrigeeHum == 14) {
        console.log("==> Correspondance des pressions Hum :  ", 15.98); correspondancePressionsHum = 15.98; resolve();
      } else if (temperatureCorrigeeHum == 14.1) {
        console.log("==> Correspondance des pressions Hum :  ", 16.087); correspondancePressionsHum = 16.087; resolve();
      } else if (temperatureCorrigeeHum == 14.2) {
        console.log("==> Correspondance des pressions Hum :  ", 16.194); correspondancePressionsHum = 16.194; resolve();
      } else if (temperatureCorrigeeHum == 14.3) {
        console.log("==> Correspondance des pressions Hum :  ", 16.301); correspondancePressionsHum = 16.301; resolve();
      } else if (temperatureCorrigeeHum == 14.4) {
        console.log("==> Correspondance des pressions Hum :  ", 16.408); correspondancePressionsHum = 16.408; resolve();
      } else if (temperatureCorrigeeHum == 14.5) {
        console.log("==> Correspondance des pressions Hum :  ", 16.515); correspondancePressionsHum = 16.515; resolve();
      } else if (temperatureCorrigeeHum == 14.6) {
        console.log("==> Correspondance des pressions Hum :  ", 16.622); correspondancePressionsHum = 16.622; resolve();
      } else if (temperatureCorrigeeHum == 14.7) {
        console.log("==> Correspondance des pressions Hum :  ", 16.729); correspondancePressionsHum = 16.729; resolve();
      } else if (temperatureCorrigeeHum == 14.8) {
        console.log("==> Correspondance des pressions Hum :  ", 16.836); correspondancePressionsHum = 16.836; resolve();
      } else if (temperatureCorrigeeHum == 14.9) {
        console.log("==> Correspondance des pressions Hum :  ", 16.943); correspondancePressionsHum = 16.943; resolve();
      } else if (temperatureCorrigeeHum == 15) {
        console.log("==> Correspondance des pressions Hum :  ", 17.05); correspondancePressionsHum = 17.05; resolve();
      } else if (temperatureCorrigeeHum == 15.1) {
        console.log("==> Correspondance des pressions Hum :  ", 17.163); correspondancePressionsHum = 17.163; resolve();
      } else if (temperatureCorrigeeHum == 15.2) {
        console.log("==> Correspondance des pressions Hum :  ", 17.276); correspondancePressionsHum = 17.276; resolve();
      } else if (temperatureCorrigeeHum == 15.3) {
        console.log("==> Correspondance des pressions Hum :  ", 17.389); correspondancePressionsHum = 17.389; resolve();
      } else if (temperatureCorrigeeHum == 15.4) {
        console.log("==> Correspondance des pressions Hum :  ", 17.502); correspondancePressionsHum = 17.502; resolve();
      } else if (temperatureCorrigeeHum == 15.5) {
        console.log("==> Correspondance des pressions Hum :  ", 17.615); correspondancePressionsHum = 17.615; resolve();
      } else if (temperatureCorrigeeHum == 15.6) {
        console.log("==> Correspondance des pressions Hum :  ", 17.728); correspondancePressionsHum = 17.728; resolve();
      } else if (temperatureCorrigeeHum == 15.7) {
        console.log("==> Correspondance des pressions Hum :  ", 17.841); correspondancePressionsHum = 17.841; resolve();
      } else if (temperatureCorrigeeHum == 15.8) {
        console.log("==> Correspondance des pressions Hum :  ", 17.954); correspondancePressionsHum = 17.954; resolve();
      } else if (temperatureCorrigeeHum == 15.9) {
        console.log("==> Correspondance des pressions Hum :  ", 18.067); correspondancePressionsHum = 18.067; resolve();
      } else if (temperatureCorrigeeHum == 16) {
        console.log("==> Correspondance des pressions Hum :  ", 18.18); correspondancePressionsHum = 18.18; resolve();
      } else if (temperatureCorrigeeHum == 16.1) {
        console.log("==> Correspondance des pressions Hum :  ", 18.299); correspondancePressionsHum = 18.299; resolve();
      } else if (temperatureCorrigeeHum == 16.2) {
        console.log("==> Correspondance des pressions Hum :  ", 18.418); correspondancePressionsHum = 18.418; resolve();
      } else if (temperatureCorrigeeHum == 16.3) {
        console.log("==> Correspondance des pressions Hum :  ", 18.537); correspondancePressionsHum = 18.537; resolve();
      } else if (temperatureCorrigeeHum == 16.4) {
        console.log("==> Correspondance des pressions Hum :  ", 18.656); correspondancePressionsHum = 18.656; resolve();
      } else if (temperatureCorrigeeHum == 16.5) {
        console.log("==> Correspondance des pressions Hum :  ", 18.775); correspondancePressionsHum = 18.775; resolve();
      } else if (temperatureCorrigeeHum == 16.6) {
        console.log("==> Correspondance des pressions Hum :  ", 18.894); correspondancePressionsHum = 18.894; resolve();
      } else if (temperatureCorrigeeHum == 16.7) {
        console.log("==> Correspondance des pressions Hum :  ", 19.013); correspondancePressionsHum = 19.013; resolve();
      } else if (temperatureCorrigeeHum == 16.8) {
        console.log("==> Correspondance des pressions Hum :  ", 19.132); correspondancePressionsHum = 19.132; resolve();
      } else if (temperatureCorrigeeHum == 16.9) {
        console.log("==> Correspondance des pressions Hum :  ", 19.251); correspondancePressionsHum = 19.251; resolve();
      } else if (temperatureCorrigeeHum == 17) {
        console.log("==> Correspondance des pressions Hum :  ", 19.37); correspondancePressionsHum = 19.37; resolve();
      } else if (temperatureCorrigeeHum == 17.1) {
        console.log("==> Correspondance des pressions Hum :  ", 19.496); correspondancePressionsHum = 19.496; resolve();
      } else if (temperatureCorrigeeHum == 17.2) {
        console.log("==> Correspondance des pressions Hum :  ", 19.622); correspondancePressionsHum = 19.622; resolve();
      } else if (temperatureCorrigeeHum == 17.3) {
        console.log("==> Correspondance des pressions Hum :  ", 19.748); correspondancePressionsHum = 19.748; resolve();
      } else if (temperatureCorrigeeHum == 17.4) {
        console.log("==> Correspondance des pressions Hum :  ", 19.874); correspondancePressionsHum = 19.874; resolve();
      } else if (temperatureCorrigeeHum == 17.5) {
        console.log("==> Correspondance des pressions Hum :  ", 20); correspondancePressionsHum = 20; resolve();
      } else if (temperatureCorrigeeHum == 17.6) {
        console.log("==> Correspondance des pressions Hum :  ", 20.126); correspondancePressionsHum = 20.126; resolve();
      } else if (temperatureCorrigeeHum == 17.7) {
        console.log("==> Correspondance des pressions Hum :  ", 20.252); correspondancePressionsHum = 20.252; resolve();
      } else if (temperatureCorrigeeHum == 17.8) {
        console.log("==> Correspondance des pressions Hum :  ", 20.378); correspondancePressionsHum = 20.378; resolve();
      } else if (temperatureCorrigeeHum == 17.9) {
        console.log("==> Correspondance des pressions Hum :  ", 20.504); correspondancePressionsHum = 20.504; resolve();
      } else if (temperatureCorrigeeHum == 18) {
        console.log("==> Correspondance des pressions Hum :  ", 20.63); correspondancePressionsHum = 20.63; resolve();
      } else if (temperatureCorrigeeHum == 18.1) {
        console.log("==> Correspondance des pressions Hum :  ", 20.764); correspondancePressionsHum = 20.764; resolve();
      } else if (temperatureCorrigeeHum == 18.2) {
        console.log("==> Correspondance des pressions Hum :  ", 20.898); correspondancePressionsHum = 20.898; resolve();
      } else if (temperatureCorrigeeHum == 18.3) {
        console.log("==> Correspondance des pressions Hum :  ", 21.032); correspondancePressionsHum = 21.032; resolve();
      } else if (temperatureCorrigeeHum == 18.4) {
        console.log("==> Correspondance des pressions Hum :  ", 21.166); correspondancePressionsHum = 21.166; resolve();
      } else if (temperatureCorrigeeHum == 18.5) {
        console.log("==> Correspondance des pressions Hum :  ", 21.3); correspondancePressionsHum = 21.3; resolve();
      } else if (temperatureCorrigeeHum == 18.6) {
        console.log("==> Correspondance des pressions Hum :  ", 21.434); correspondancePressionsHum = 21.434; resolve();
      } else if (temperatureCorrigeeHum == 18.7) {
        console.log("==> Correspondance des pressions Hum :  ", 21.568); correspondancePressionsHum = 21.568; resolve();
      } else if (temperatureCorrigeeHum == 18.8) {
        console.log("==> Correspondance des pressions Hum :  ", 21.702); correspondancePressionsHum = 21.702; resolve();
      } else if (temperatureCorrigeeHum == 18.9) {
        console.log("==> Correspondance des pressions Hum :  ", 21.836); correspondancePressionsHum = 21.836; resolve();
      } else if (temperatureCorrigeeHum == 19) {
        console.log("==> Correspondance des pressions Hum :  ", 21.97); correspondancePressionsHum = 21.97; resolve();
      } else if (temperatureCorrigeeHum == 19.1) {
        console.log("==> Correspondance des pressions Hum :  ", 22.111); correspondancePressionsHum = 22.111; resolve();
      } else if (temperatureCorrigeeHum == 19.2) {
        console.log("==> Correspondance des pressions Hum :  ", 22.252); correspondancePressionsHum = 22.252; resolve();
      } else if (temperatureCorrigeeHum == 19.3) {
        console.log("==> Correspondance des pressions Hum :  ", 22.393); correspondancePressionsHum = 22.393; resolve();
      } else if (temperatureCorrigeeHum == 19.4) {
        console.log("==> Correspondance des pressions Hum :  ", 22.534); correspondancePressionsHum = 22.534; resolve();
      } else if (temperatureCorrigeeHum == 19.5) {
        console.log("==> Correspondance des pressions Hum :  ", 22.675); correspondancePressionsHum = 22.675; resolve();
      } else if (temperatureCorrigeeHum == 19.6) {
        console.log("==> Correspondance des pressions Hum :  ", 22.816); correspondancePressionsHum = 22.816; resolve();
      } else if (temperatureCorrigeeHum == 19.7) {
        console.log("==> Correspondance des pressions Hum :  ", 22.957); correspondancePressionsHum = 22.957; resolve();
      } else if (temperatureCorrigeeHum == 19.8) {
        console.log("==> Correspondance des pressions Hum :  ", 23.098); correspondancePressionsHum = 23.098; resolve();
      } else if (temperatureCorrigeeHum == 19.9) {
        console.log("==> Correspondance des pressions Hum :  ", 23.239); correspondancePressionsHum = 23.239; resolve();
      } else if (temperatureCorrigeeHum == 20) {
        console.log("==> Correspondance des pressions Hum :  ", 23.38); correspondancePressionsHum = 23.38; resolve();
      } else if (temperatureCorrigeeHum == 20.1) {
        console.log("==> Correspondance des pressions Hum :  ", 23.529); correspondancePressionsHum = 23.529; resolve();
      } else if (temperatureCorrigeeHum == 20.2) {
        console.log("==> Correspondance des pressions Hum :  ", 23.678); correspondancePressionsHum = 23.678; resolve();
      } else if (temperatureCorrigeeHum == 20.3) {
        console.log("==> Correspondance des pressions Hum :  ", 23.827); correspondancePressionsHum = 23.827; resolve();
      } else if (temperatureCorrigeeHum == 20.4) {
        console.log("==> Correspondance des pressions Hum :  ", 23.976); correspondancePressionsHum = 23.976; resolve();
      } else if (temperatureCorrigeeHum == 20.5) {
        console.log("==> Correspondance des pressions Hum :  ", 24.125); correspondancePressionsHum = 24.125; resolve();
      } else if (temperatureCorrigeeHum == 20.6) {
        console.log("==> Correspondance des pressions Hum :  ", 24.274); correspondancePressionsHum = 24.274; resolve();
      } else if (temperatureCorrigeeHum == 20.7) {
        console.log("==> Correspondance des pressions Hum :  ", 24.423); correspondancePressionsHum = 24.423; resolve();
      } else if (temperatureCorrigeeHum == 20.8) {
        console.log("==> Correspondance des pressions Hum :  ", 24.572); correspondancePressionsHum = 24.572; resolve();
      } else if (temperatureCorrigeeHum == 20.9) {
        console.log("==> Correspondance des pressions Hum :  ", 24.721); correspondancePressionsHum = 24.721; resolve();
      } else if (temperatureCorrigeeHum == 21) {
        console.log("==> Correspondance des pressions Hum :  ", 24.87); correspondancePressionsHum = 24.87; resolve();
      } else if (temperatureCorrigeeHum == 21.1) {
        console.log("==> Correspondance des pressions Hum :  ", 25.026); correspondancePressionsHum = 25.026; resolve();
      } else if (temperatureCorrigeeHum == 21.2) {
        console.log("==> Correspondance des pressions Hum :  ", 25.182); correspondancePressionsHum = 25.182; resolve();
      } else if (temperatureCorrigeeHum == 21.3) {
        console.log("==> Correspondance des pressions Hum :  ", 25.338); correspondancePressionsHum = 25.338; resolve();
      } else if (temperatureCorrigeeHum == 21.4) {
        console.log("==> Correspondance des pressions Hum :  ", 25.494); correspondancePressionsHum = 25.494; resolve();
      } else if (temperatureCorrigeeHum == 21.5) {
        console.log("==> Correspondance des pressions Hum :  ", 25.65); correspondancePressionsHum = 25.65; resolve();
      } else if (temperatureCorrigeeHum == 21.6) {
        console.log("==> Correspondance des pressions Hum :  ", 25.806); correspondancePressionsHum = 25.806; resolve();
      } else if (temperatureCorrigeeHum == 21.7) {
        console.log("==> Correspondance des pressions Hum :  ", 25.962); correspondancePressionsHum = 25.962; resolve();
      } else if (temperatureCorrigeeHum == 21.8) {
        console.log("==> Correspondance des pressions Hum :  ", 26.118); correspondancePressionsHum = 26.118; resolve();
      } else if (temperatureCorrigeeHum == 21.9) {
        console.log("==> Correspondance des pressions Hum :  ", 26.274); correspondancePressionsHum = 26.274; resolve();
      } else if (temperatureCorrigeeHum == 22) {
        console.log("==> Correspondance des pressions Hum :  ", 26.43); correspondancePressionsHum = 26.43; resolve();
      } else if (temperatureCorrigeeHum == 22.1) {
        console.log("==> Correspondance des pressions Hum :  ", 26.596); correspondancePressionsHum = 26.596; resolve();
      } else if (temperatureCorrigeeHum == 22.2) {
        console.log("==> Correspondance des pressions Hum :  ", 26.762); correspondancePressionsHum = 26.762; resolve();
      } else if (temperatureCorrigeeHum == 22.3) {
        console.log("==> Correspondance des pressions Hum :  ", 26.928); correspondancePressionsHum = 26.928; resolve();
      } else if (temperatureCorrigeeHum == 22.4) {
        console.log("==> Correspondance des pressions Hum :  ", 27.094); correspondancePressionsHum = 27.094; resolve();
      } else if (temperatureCorrigeeHum == 22.5) {
        console.log("==> Correspondance des pressions Hum :  ", 27.26); correspondancePressionsHum = 27.26; resolve();
      } else if (temperatureCorrigeeHum == 22.6) {
        console.log("==> Correspondance des pressions Hum :  ", 27.426); correspondancePressionsHum = 27.426; resolve();
      } else if (temperatureCorrigeeHum == 22.7) {
        console.log("==> Correspondance des pressions Hum :  ", 27.592); correspondancePressionsHum = 27.592; resolve();
      } else if (temperatureCorrigeeHum == 22.8) {
        console.log("==> Correspondance des pressions Hum :  ", 27.758); correspondancePressionsHum = 27.758; resolve();
      } else if (temperatureCorrigeeHum == 22.9) {
        console.log("==> Correspondance des pressions Hum :  ", 27.924); correspondancePressionsHum = 27.924; resolve();
      } else if (temperatureCorrigeeHum == 23) {
        console.log("==> Correspondance des pressions Hum :  ", 28.09); correspondancePressionsHum = 28.09; resolve();
      } else if (temperatureCorrigeeHum == 23.1) {
        console.log("==> Correspondance des pressions Hum :  ", 28.264); correspondancePressionsHum = 28.264; resolve();
      } else if (temperatureCorrigeeHum == 23.2) {
        console.log("==> Correspondance des pressions Hum :  ", 28.438); correspondancePressionsHum = 28.438; resolve();
      } else if (temperatureCorrigeeHum == 23.3) {
        console.log("==> Correspondance des pressions Hum :  ", 28.612); correspondancePressionsHum = 28.612; resolve();
      } else if (temperatureCorrigeeHum == 23.4) {
        console.log("==> Correspondance des pressions Hum :  ", 28.786); correspondancePressionsHum = 28.786; resolve();
      } else if (temperatureCorrigeeHum == 23.5) {
        console.log("==> Correspondance des pressions Hum :  ", 28.96); correspondancePressionsHum = 28.96; resolve();
      } else if (temperatureCorrigeeHum == 23.6) {
        console.log("==> Correspondance des pressions Hum :  ", 29.134); correspondancePressionsHum = 29.134; resolve();
      } else if (temperatureCorrigeeHum == 23.7) {
        console.log("==> Correspondance des pressions Hum :  ", 29.308); correspondancePressionsHum = 29.308; resolve();
      } else if (temperatureCorrigeeHum == 23.8) {
        console.log("==> Correspondance des pressions Hum :  ", 29.482); correspondancePressionsHum = 29.482; resolve();
      } else if (temperatureCorrigeeHum == 23.9) {
        console.log("==> Correspondance des pressions Hum :  ", 29.656); correspondancePressionsHum = 29.656; resolve();
      } else if (temperatureCorrigeeHum == 24) {
        console.log("==> Correspondance des pressions Hum :  ", 29.83); correspondancePressionsHum = 29.83; resolve();
      } else if (temperatureCorrigeeHum == 24.1) {
        console.log("==> Correspondance des pressions Hum :  ", 30.014); correspondancePressionsHum = 30.014; resolve();
      } else if (temperatureCorrigeeHum == 24.2) {
        console.log("==> Correspondance des pressions Hum :  ", 30.198); correspondancePressionsHum = 30.198; resolve();
      } else if (temperatureCorrigeeHum == 24.3) {
        console.log("==> Correspondance des pressions Hum :  ", 30.382); correspondancePressionsHum = 30.382; resolve();
      } else if (temperatureCorrigeeHum == 24.4) {
        console.log("==> Correspondance des pressions Hum :  ", 30.566); correspondancePressionsHum = 30.566; resolve();
      } else if (temperatureCorrigeeHum == 24.5) {
        console.log("==> Correspondance des pressions Hum :  ", 30.75); correspondancePressionsHum = 30.75; resolve();
      } else if (temperatureCorrigeeHum == 24.6) {
        console.log("==> Correspondance des pressions Hum :  ", 30.934); correspondancePressionsHum = 30.934; resolve();
      } else if (temperatureCorrigeeHum == 24.7) {
        console.log("==> Correspondance des pressions Hum :  ", 31.118); correspondancePressionsHum = 31.118; resolve();
      } else if (temperatureCorrigeeHum == 24.8) {
        console.log("==> Correspondance des pressions Hum :  ", 31.302); correspondancePressionsHum = 31.302; resolve();
      } else if (temperatureCorrigeeHum == 24.9) {
        console.log("==> Correspondance des pressions Hum :  ", 31.486); correspondancePressionsHum = 31.486; resolve();
      } else if (temperatureCorrigeeHum == 25) {
        console.log("==> Correspondance des pressions Hum :  ", 31.67); correspondancePressionsHum = 31.67; resolve();
      } else if (temperatureCorrigeeHum == 25.1) {
        console.log("==> Correspondance des pressions Hum :  ", 31.863); correspondancePressionsHum = 31.863; resolve();
      } else if (temperatureCorrigeeHum == 25.2) {
        console.log("==> Correspondance des pressions Hum :  ", 32.056); correspondancePressionsHum = 32.056; resolve();
      } else if (temperatureCorrigeeHum == 25.3) {
        console.log("==> Correspondance des pressions Hum :  ", 32.249); correspondancePressionsHum = 32.249; resolve();
      } else if (temperatureCorrigeeHum == 25.4) {
        console.log("==> Correspondance des pressions Hum :  ", 32.442); correspondancePressionsHum = 32.442; resolve();
      } else if (temperatureCorrigeeHum == 25.5) {
        console.log("==> Correspondance des pressions Hum :  ", 32.635); correspondancePressionsHum = 32.635; resolve();
      } else if (temperatureCorrigeeHum == 25.6) {
        console.log("==> Correspondance des pressions Hum :  ", 32.828); correspondancePressionsHum = 32.828; resolve();
      } else if (temperatureCorrigeeHum == 25.7) {
        console.log("==> Correspondance des pressions Hum :  ", 33.021); correspondancePressionsHum = 33.021; resolve();
      } else if (temperatureCorrigeeHum == 25.8) {
        console.log("==> Correspondance des pressions Hum :  ", 33.214); correspondancePressionsHum = 33.214; resolve();
      } else if (temperatureCorrigeeHum == 25.9) {
        console.log("==> Correspondance des pressions Hum :  ", 33.407); correspondancePressionsHum = 33.407; resolve();
      } else if (temperatureCorrigeeHum == 26) {
        console.log("==> Correspondance des pressions Hum :  ", 33.6); correspondancePressionsHum = 33.6; resolve();
      } else if (temperatureCorrigeeHum == 26.1) {
        console.log("==> Correspondance des pressions Hum :  ", 33.804); correspondancePressionsHum = 33.804; resolve();
      } else if (temperatureCorrigeeHum == 26.2) {
        console.log("==> Correspondance des pressions Hum :  ", 34.008); correspondancePressionsHum = 34.008; resolve();
      } else if (temperatureCorrigeeHum == 26.3) {
        console.log("==> Correspondance des pressions Hum :  ", 34.212); correspondancePressionsHum = 34.212; resolve();
      } else if (temperatureCorrigeeHum == 26.4) {
        console.log("==> Correspondance des pressions Hum :  ", 34.416); correspondancePressionsHum = 34.416; resolve();
      } else if (temperatureCorrigeeHum == 26.5) {
        console.log("==> Correspondance des pressions Hum :  ", 34.62); correspondancePressionsHum = 34.62; resolve();
      } else if (temperatureCorrigeeHum == 26.6) {
        console.log("==> Correspondance des pressions Hum :  ", 34.824); correspondancePressionsHum = 34.824; resolve();
      } else if (temperatureCorrigeeHum == 26.7) {
        console.log("==> Correspondance des pressions Hum :  ", 35.028); correspondancePressionsHum = 35.028; resolve();
      } else if (temperatureCorrigeeHum == 26.8) {
        console.log("==> Correspondance des pressions Hum :  ", 35.232); correspondancePressionsHum = 35.232; resolve();
      } else if (temperatureCorrigeeHum == 26.9) {
        console.log("==> Correspondance des pressions Hum :  ", 35.436); correspondancePressionsHum = 35.436; resolve();
      } else if (temperatureCorrigeeHum == 27) {
        console.log("==> Correspondance des pressions Hum :  ", 35.64); correspondancePressionsHum = 35.64; resolve();
      } else if (temperatureCorrigeeHum == 27.1) {
        console.log("==> Correspondance des pressions Hum :  ", 35.856); correspondancePressionsHum = 35.856; resolve();
      } else if (temperatureCorrigeeHum == 27.2) {
        console.log("==> Correspondance des pressions Hum :  ", 36.072); correspondancePressionsHum = 36.072; resolve();
      } else if (temperatureCorrigeeHum == 27.3) {
        console.log("==> Correspondance des pressions Hum :  ", 36.288); correspondancePressionsHum = 36.288; resolve();
      } else if (temperatureCorrigeeHum == 27.4) {
        console.log("==> Correspondance des pressions Hum :  ", 36.504); correspondancePressionsHum = 36.504; resolve();
      } else if (temperatureCorrigeeHum == 27.5) {
        console.log("==> Correspondance des pressions Hum :  ", 36.72); correspondancePressionsHum = 36.72; resolve();
      } else if (temperatureCorrigeeHum == 27.6) {
        console.log("==> Correspondance des pressions Hum :  ", 36.936); correspondancePressionsHum = 36.936; resolve();
      } else if (temperatureCorrigeeHum == 27.7) {
        console.log("==> Correspondance des pressions Hum :  ", 37.152); correspondancePressionsHum = 37.152; resolve();
      } else if (temperatureCorrigeeHum == 27.8) {
        console.log("==> Correspondance des pressions Hum :  ", 37.368); correspondancePressionsHum = 37.368; resolve();
      } else if (temperatureCorrigeeHum == 27.9) {
        console.log("==> Correspondance des pressions Hum :  ", 37.584); correspondancePressionsHum = 37.584; resolve();
      } else if (temperatureCorrigeeHum == 28) {
        console.log("==> Correspondance des pressions Hum :  ", 37.8); correspondancePressionsHum = 37.8; resolve();
      } else if (temperatureCorrigeeHum == 28.1) {
        console.log("==> Correspondance des pressions Hum :  ", 38.025); correspondancePressionsHum = 38.025; resolve();
      } else if (temperatureCorrigeeHum == 28.2) {
        console.log("==> Correspondance des pressions Hum :  ", 38.25); correspondancePressionsHum = 38.25; resolve();
      } else if (temperatureCorrigeeHum == 28.3) {
        console.log("==> Correspondance des pressions Hum :  ", 38.475); correspondancePressionsHum = 38.475; resolve();
      } else if (temperatureCorrigeeHum == 28.4) {
        console.log("==> Correspondance des pressions Hum :  ", 38.7); correspondancePressionsHum = 38.7; resolve();
      } else if (temperatureCorrigeeHum == 28.5) {
        console.log("==> Correspondance des pressions Hum :  ", 38.925); correspondancePressionsHum = 38.925; resolve();
      } else if (temperatureCorrigeeHum == 28.6) {
        console.log("==> Correspondance des pressions Hum :  ", 39.15); correspondancePressionsHum = 39.15; resolve();
      } else if (temperatureCorrigeeHum == 28.7) {
        console.log("==> Correspondance des pressions Hum :  ", 39.375); correspondancePressionsHum = 39.375; resolve();
      } else if (temperatureCorrigeeHum == 28.8) {
        console.log("==> Correspondance des pressions Hum :  ", 39.6); correspondancePressionsHum = 39.6; resolve();
      } else if (temperatureCorrigeeHum == 28.9) {
        console.log("==> Correspondance des pressions Hum :  ", 39.825); correspondancePressionsHum = 39.825; resolve();
      } else if (temperatureCorrigeeHum == 29) {
        console.log("==> Correspondance des pressions Hum :  ", 40.05); correspondancePressionsHum = 40.05; resolve();
      } else if (temperatureCorrigeeHum == 29.1) {
        console.log("==> Correspondance des pressions Hum :  ", 40.288); correspondancePressionsHum = 40.288; resolve();
      } else if (temperatureCorrigeeHum == 29.2) {
        console.log("==> Correspondance des pressions Hum :  ", 40.526); correspondancePressionsHum = 40.526; resolve();
      } else if (temperatureCorrigeeHum == 29.3) {
        console.log("==> Correspondance des pressions Hum :  ", 40.764); correspondancePressionsHum = 40.764; resolve();
      } else if (temperatureCorrigeeHum == 29.4) {
        console.log("==> Correspondance des pressions Hum :  ", 41.002); correspondancePressionsHum = 41.002; resolve();
      } else if (temperatureCorrigeeHum == 29.5) {
        console.log("==> Correspondance des pressions Hum :  ", 41.24); correspondancePressionsHum = 41.24; resolve();
      } else if (temperatureCorrigeeHum == 29.6) {
        console.log("==> Correspondance des pressions Hum :  ", 41.478); correspondancePressionsHum = 41.478; resolve();
      } else if (temperatureCorrigeeHum == 29.7) {
        console.log("==> Correspondance des pressions Hum :  ", 41.716); correspondancePressionsHum = 41.716; resolve();
      } else if (temperatureCorrigeeHum == 29.8) {
        console.log("==> Correspondance des pressions Hum :  ", 41.954); correspondancePressionsHum = 41.954; resolve();
      } else if (temperatureCorrigeeHum == 29.9) {
        console.log("==> Correspondance des pressions Hum :  ", 42.192); correspondancePressionsHum = 42.192; resolve();
      } else if (temperatureCorrigeeHum == 30) {
        console.log("==> Correspondance des pressions Hum :  ", 42.43); correspondancePressionsHum = 42.43; resolve();
      } else if (temperatureCorrigeeHum == 30.1) {
        console.log("==> Correspondance des pressions Hum :  ", 42.679); correspondancePressionsHum = 42.679; resolve();
      } else if (temperatureCorrigeeHum == 30.2) {
        console.log("==> Correspondance des pressions Hum :  ", 42.928); correspondancePressionsHum = 42.928; resolve();
      } else if (temperatureCorrigeeHum == 30.3) {
        console.log("==> Correspondance des pressions Hum :  ", 43.177); correspondancePressionsHum = 43.177; resolve();
      } else if (temperatureCorrigeeHum == 30.4) {
        console.log("==> Correspondance des pressions Hum :  ", 43.426); correspondancePressionsHum = 43.426; resolve();
      } else if (temperatureCorrigeeHum == 30.5) {
        console.log("==> Correspondance des pressions Hum :  ", 43.675); correspondancePressionsHum = 43.675; resolve();
      } else if (temperatureCorrigeeHum == 30.6) {
        console.log("==> Correspondance des pressions Hum :  ", 43.924); correspondancePressionsHum = 43.924; resolve();
      } else if (temperatureCorrigeeHum == 30.7) {
        console.log("==> Correspondance des pressions Hum :  ", 44.173); correspondancePressionsHum = 44.173; resolve();
      } else if (temperatureCorrigeeHum == 30.8) {
        console.log("==> Correspondance des pressions Hum :  ", 44.422); correspondancePressionsHum = 44.422; resolve();
      } else if (temperatureCorrigeeHum == 30.9) {
        console.log("==> Correspondance des pressions Hum :  ", 44.671); correspondancePressionsHum = 44.671; resolve();
      } else if (temperatureCorrigeeHum == 31) {
        console.log("==> Correspondance des pressions Hum :  ", 44.92); correspondancePressionsHum = 44.92; resolve();
      } else if (temperatureCorrigeeHum == 31.1) {
        console.log("==> Correspondance des pressions Hum :  ", 45.183); correspondancePressionsHum = 45.183; resolve();
      } else if (temperatureCorrigeeHum == 31.2) {
        console.log("==> Correspondance des pressions Hum :  ", 45.446); correspondancePressionsHum = 45.446; resolve();
      } else if (temperatureCorrigeeHum == 31.3) {
        console.log("==> Correspondance des pressions Hum :  ", 45.709); correspondancePressionsHum = 45.709; resolve();
      } else if (temperatureCorrigeeHum == 31.4) {
        console.log("==> Correspondance des pressions Hum :  ", 45.972); correspondancePressionsHum = 45.972; resolve();
      } else if (temperatureCorrigeeHum == 31.5) {
        console.log("==> Correspondance des pressions Hum :  ", 46.235); correspondancePressionsHum = 46.235; resolve();
      } else if (temperatureCorrigeeHum == 31.6) {
        console.log("==> Correspondance des pressions Hum :  ", 46.498); correspondancePressionsHum = 46.498; resolve();
      } else if (temperatureCorrigeeHum == 31.7) {
        console.log("==> Correspondance des pressions Hum :  ", 46.761); correspondancePressionsHum = 46.761; resolve();
      } else if (temperatureCorrigeeHum == 31.8) {
        console.log("==> Correspondance des pressions Hum :  ", 47.024); correspondancePressionsHum = 47.024; resolve();
      } else if (temperatureCorrigeeHum == 31.9) {
        console.log("==> Correspondance des pressions Hum :  ", 47.287); correspondancePressionsHum = 47.287; resolve();
      } else if (temperatureCorrigeeHum == 32) {
        console.log("==> Correspondance des pressions Hum :  ", 47.55); correspondancePressionsHum = 47.55; resolve();
      } else if (temperatureCorrigeeHum == 32.1) {
        console.log("==> Correspondance des pressions Hum :  ", 47.825); correspondancePressionsHum = 47.825; resolve();
      } else if (temperatureCorrigeeHum == 32.2) {
        console.log("==> Correspondance des pressions Hum :  ", 48.1); correspondancePressionsHum = 48.1; resolve();
      } else if (temperatureCorrigeeHum == 32.3) {
        console.log("==> Correspondance des pressions Hum :  ", 48.375); correspondancePressionsHum = 48.375; resolve();
      } else if (temperatureCorrigeeHum == 32.4) {
        console.log("==> Correspondance des pressions Hum :  ", 48.65); correspondancePressionsHum = 48.65; resolve();
      } else if (temperatureCorrigeeHum == 32.5) {
        console.log("==> Correspondance des pressions Hum :  ", 48.925); correspondancePressionsHum = 48.925; resolve();
      } else if (temperatureCorrigeeHum == 32.6) {
        console.log("==> Correspondance des pressions Hum :  ", 49.2); correspondancePressionsHum = 49.2; resolve();
      } else if (temperatureCorrigeeHum == 32.7) {
        console.log("==> Correspondance des pressions Hum :  ", 49.475); correspondancePressionsHum = 49.475; resolve();
      } else if (temperatureCorrigeeHum == 32.8) {
        console.log("==> Correspondance des pressions Hum :  ", 49.75); correspondancePressionsHum = 49.75; resolve();
      } else if (temperatureCorrigeeHum == 32.9) {
        console.log("==> Correspondance des pressions Hum :  ", 50.025); correspondancePressionsHum = 50.025; resolve();
      } else if (temperatureCorrigeeHum == 33) {
        console.log("==> Correspondance des pressions Hum :  ", 50.3); correspondancePressionsHum = 50.3; resolve();
      } else if (temperatureCorrigeeHum == 33.1) {
        console.log("==> Correspondance des pressions Hum :  ", 50.589); correspondancePressionsHum = 50.589; resolve();
      } else if (temperatureCorrigeeHum == 33.2) {
        console.log("==> Correspondance des pressions Hum :  ", 50.878); correspondancePressionsHum = 50.878; resolve();
      } else if (temperatureCorrigeeHum == 33.3) {
        console.log("==> Correspondance des pressions Hum :  ", 51.167); correspondancePressionsHum = 51.167; resolve();
      } else if (temperatureCorrigeeHum == 33.4) {
        console.log("==> Correspondance des pressions Hum :  ", 51.456); correspondancePressionsHum = 51.456; resolve();
      } else if (temperatureCorrigeeHum == 33.5) {
        console.log("==> Correspondance des pressions Hum :  ", 51.745); correspondancePressionsHum = 51.745; resolve();
      } else if (temperatureCorrigeeHum == 33.6) {
        console.log("==> Correspondance des pressions Hum :  ", 52.034); correspondancePressionsHum = 52.034; resolve();
      } else if (temperatureCorrigeeHum == 33.7) {
        console.log("==> Correspondance des pressions Hum :  ", 52.323); correspondancePressionsHum = 52.323; resolve();
      } else if (temperatureCorrigeeHum == 33.8) {
        console.log("==> Correspondance des pressions Hum :  ", 52.612); correspondancePressionsHum = 52.612; resolve();
      } else if (temperatureCorrigeeHum == 33.9) {
        console.log("==> Correspondance des pressions Hum :  ", 52.901); correspondancePressionsHum = 52.901; resolve();
      } else if (temperatureCorrigeeHum == 34) {
        console.log("==> Correspondance des pressions Hum :  ", 53.19); correspondancePressionsHum = 53.19; resolve();
      } else if (temperatureCorrigeeHum == 34.1) {
        console.log("==> Correspondance des pressions Hum :  ", 53.494); correspondancePressionsHum = 53.494; resolve();
      } else if (temperatureCorrigeeHum == 34.2) {
        console.log("==> Correspondance des pressions Hum :  ", 53.798); correspondancePressionsHum = 53.798; resolve();
      } else if (temperatureCorrigeeHum == 34.3) {
        console.log("==> Correspondance des pressions Hum :  ", 54.102); correspondancePressionsHum = 54.102; resolve();
      } else if (temperatureCorrigeeHum == 34.4) {
        console.log("==> Correspondance des pressions Hum :  ", 54.406); correspondancePressionsHum = 54.406; resolve();
      } else if (temperatureCorrigeeHum == 34.5) {
        console.log("==> Correspondance des pressions Hum :  ", 54.71); correspondancePressionsHum = 54.71; resolve();
      } else if (temperatureCorrigeeHum == 34.6) {
        console.log("==> Correspondance des pressions Hum :  ", 55.014); correspondancePressionsHum = 55.014; resolve();
      } else if (temperatureCorrigeeHum == 34.7) {
        console.log("==> Correspondance des pressions Hum :  ", 55.318); correspondancePressionsHum = 55.318; resolve();
      } else if (temperatureCorrigeeHum == 34.8) {
        console.log("==> Correspondance des pressions Hum :  ", 55.622); correspondancePressionsHum = 55.622; resolve();
      } else if (temperatureCorrigeeHum == 34.9) {
        console.log("==> Correspondance des pressions Hum :  ", 55.926); correspondancePressionsHum = 55.926; resolve();
      } else if (temperatureCorrigeeHum == 35) {
        console.log("==> Correspondance des pressions Hum :  ", 56.23); correspondancePressionsHum = 56.23; resolve();
      } else { (console.log('ERREUR Correspondance des pressions Hum')) }
    } catch (error) {

      console.log("❌ %c ERREUR ==> gestions Hum ==> Tableau de correspondance Hum",
        'color: orange', error);

      reject();

    }

  });
}

//? --------------------------------------------------

//? Calcule du taux d'humidité.

let tauxHumidite;
let deltaHum;

let calculeTauxHumidite = () => {
  return new Promise((resolve, reject) => {
    try {

      tauxHumidite = parseFloat((
        ((correspondancePressionsHum -
          1013 *
          0.000662 *
          (temperatureCorrigeeSec - temperatureCorrigeeHum)) /
          correspondancePressions) *
        100
      ).toFixed(2));

      console.log(
        "✅ %c SUCCÈS ==> gestions Hum ==> Taux Humidite ==============================================>",
        'color: green', tauxHumidite
      );

      //* Calcule du delta entre la consigne et le taux d'humidité.

      deltaHum = parseFloat((tauxHumidite - consigne).toFixed(1));

      console.log(
        "✅ %c SUCCÈS ==> gestions Hum ==> delta humidité =============================================>",
        'color: green', deltaHum
      );

      resolve();

    } catch (error) {

      console.log("❌ %c ERREUR ==> gestions Hum ==> Calcule du taux d'humidité",
        'color: orange', error);

      reject();

    }

  });
}

//? --------------------------------------------------

//? Action après le calcule du delta.

let actionApresCalculeDelta = () => {
  return new Promise((resolve, reject) => {

    try {

      if (deltaHum > 2) {
        console.log(
          magenta,
          '[ GESTION HUM CALCULES  ] DeltaHum >  0 : On ne fait rien'
        );
        //! ----------------------------------------
        //
        resolve();
      } else if (deltaHum <= 2 && deltaHum >= -2) {
        //*
        //* Pas d'action car interval entre 2% et -2%"
        //*
        //! ----------------------------------------
        //
        resolve();
      } else if (deltaHum >= -5 && deltaHum < -2) {
        //

        let eau = () => {
          //* Activation de l'eau au sol.

          new Gpio(16, 'out');

          console.log(
            magenta,
            "[ GESTION HUM CALCULES  ] DeltaHum <  0 : Activation de l'eau au sol."
          );
        };
        eau();

        //* Déactivation de l'eau au sol.
        setTimeout((eau) => {
          new Gpio(16, 'in');

          console.log(
            magenta,
            "[ GESTION HUM CALCULES  ] Déactivation de l'eau au sol."
          );
          resolve();
        }, 10000);
        //! ----------------------------------------
        //
      } else if (deltaHum >= -10 && deltaHum < -5) {
        //

        let eau = () => {
          //* Activation de l'eau au sol.

          new Gpio(16, 'out');

          console.log(
            magenta,
            "[ GESTION HUM CALCULES  ] DeltaHum <  0 : Activation de l'eau au sol."
          );
        };
        eau();

        //* Déactivation de l'eau au sol.
        setTimeout((eau) => {
          new Gpio(16, 'in');

          console.log(
            magenta,
            "[ GESTION HUM CALCULES  ] Déactivation de l'eau au sol."
          );

          resolve();
        }, 10000);
        //! ----------------------------------------
        //
      } else if (deltaHum < -10) {
        //

        let eau = () => {
          //* Activation de l'eau au sol.

          new Gpio(16, 'out');

          console.log(
            magenta,
            "[ GESTION HUM CALCULES  ] DeltaHum <  0 : Activation de l'eau au sol."
          );
        };
        eau();

        //* Déactivation de l'eau au sol.
        setTimeout((eau) => {
          new Gpio(16, 'in');

          console.log(
            magenta,
            "[ GESTION HUM CALCULES  ] Déactivation de l'eau au sol."
          );
          resolve();
        }, 10000);

        //! ----------------------------------------
      }

    } catch (error) {

      reject();

      console.log('ERREUR calcul action delta :', error);

    }

  });
}

//? --------------------------------------------------

//? Enregistrement des données dans la BD.

let enregistrementDesDonnees = () => {
  return new Promise((resolve, reject) => {

    const gestionHumModels = db.gestionHum;

    gestionHumModels
      .create({
        tauxHumidite: tauxHumidite,
        deltaHum: deltaHum,
        valeursMesureSec180: temperatureCorrigeeSec,
        valeursMesureHum90: temperatureCorrigeeHum,
        consigne: consigne,
        valeurAxeX: valeurAxeX,
        jourDuCycle: jourDuCycle,
      })

      .then((result) => {

        console.log(
          "✅ %c SUCCÈS ==> gestions Hum ==> Enregistrement des données dans la BD sous l'ID ============>",
          'color: green', result["dataValues"].id
        );

        resolve();
      })
      .catch((error) => {

        console.log("❌ %c ERREUR ==> Enregistrement des données dans la BD ===>",
          'color: orange', error);

        reject();

      });

  });
}


//? --------------------------------------------------



//! -------------------------------------------------- !

//! Exécution des fonctions asynchrones.

let handleMyPromise = async () => {

  try {

    await recuperationDeLaConsigne();

    await constructionAxeX();

    await recuperationDeEtalonageSec();

    await getTemperaturesSec();

    await calculeDeLaTemperatureMoyenneSec();

    await definitionTemperatureSeccorrigee();

    await tableauCorrespondanceSec();

    await recuperationDeEtalonageHum();

    await getTemperaturesHum();

    await calculeDeLaTemperatureMoyenneHum();

    await definitionTemperatureHumcorrigee();

    await tableauCorrespondanceHum();

    await calculeTauxHumidite();

    await actionApresCalculeDelta();

    await enregistrementDesDonnees();

  }
  catch (err) {
    console.log('err finale :', err);
  }
};

handleMyPromise();

//! -------------------------------------------------- !