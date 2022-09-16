//! Gestion Humidité.

const axios = require('axios');

//? 1 Récupération du taux humidité dans la base.

//* Taux humidité.

let tauxHum;
let tauxHumLocalStorage;
let pasHum;
let pasHumLocalStorage;
let objectifHum;
let objectifHumLocalStorage;
let heureHum;
let nbJourHum;
let nbJourHumLocalStorage;
let nbHeureHum;
let nbHeureHumLocalStorage;

//* Tempèrature Hum

let temperatureSec;
let temperatureSecLocalStorage;
let temperatureHum;
let temperatureHumLocalStorage;

//* Consigne Air.

let deltaTauxHum;
let deltaTauxHumLocalStorage;

let getTauxHum = () => {
  axios({
    url: 'http://localhost:3003/api/gestionHumiditeRoutes/getTauxHumidite/',
    method: 'get',
  })
    .then((response) => {
      // console.log(response.data);

      //* température Air.

      tauxHum = response.data.gestionTauxHum.tauxHumidite;

      localStorage.setItem('gestionHum ==> Taux humidité :', tauxHum);

      tauxHumLocalStorage = localStorage.getItem('gestionHum ==> Taux humidité :');

      document.getElementById('tauxHumidite').innerHTML =
        tauxHumLocalStorage + '%';

      //* -------------------------------------------------

      //* Température Sec.

      temperatureSec = response.data.gestionTauxHum.valeursMesureSec180;

      localStorage.setItem('gestionHum ==> Tempèrature Sec :', temperatureSec);

      temperatureSecLocalStorage = localStorage.getItem(
        'gestionHum ==> Tempèrature Sec :'
      );

      document.getElementById('temperatureSec').innerHTML =
        temperatureSecLocalStorage + '°C';

      //* -------------------------------------------------

      //* Température Hum.

      temperatureHum = response.data.gestionTauxHum.valeursMesureHum90;

      localStorage.setItem('gestionHum ==> Tempèrature Humide :', temperatureHum);

      temperatureHumLocalStorage = localStorage.getItem(
        'gestionHum ==> Tempèrature Humide :'
      );

      document.getElementById('temperatureHum').innerHTML =
        temperatureHumLocalStorage + '°C';

      //* -------------------------------------------------
    })
    .catch((error) => {
      console.log(error);
      console.log(JSON.stringify(error));
    });
};

getTauxHum();

setInterval(() => {
  getTauxHum();
  // console.log('récup Taux Hum');
}, 10000);

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? 2 Récupération de la consigne Hum dans la base.

let consigneHum;
let consigneHumLocalStorage;

let getConsigneHum = () => {
  axios({
    url: 'http://localhost:3003/api/gestionHumiditeRoutes/getConsigneHumidite/',
    method: 'get',
  })
    //
    //* Récupération des données.
    .then((response) => {
      // console.log(response.data);

      //* Consigne Hum.

      consigneHum = response.data.dataGestionHum.consigneHum;

      localStorage.setItem('gestionHum ==> Consigne:', consigneHum);

      consigneHumLocalStorage = localStorage.getItem('gestionHum ==> Consigne:');

      document.getElementById('consigneHumidite').innerHTML =
        consigneHumLocalStorage + '%';

      //* Dernièr consigne Hum entrée.

      let dernierConsigneHumEntree = localStorage.getItem('gestionHum ==> Dernier consigne:');

      document.getElementById('dernierConsigneHumEntree').innerHTML =
        dernierConsigneHumEntree;

      //* -------------------------------------------------

      //* Pas Humidité.

      pasHum = response.data.dataGestionHum.pasHum;

      localStorage.setItem('gestionHum ==> Pas :', pasHum);

      pasHumLocalStorage = localStorage.getItem('gestionHum ==> Pas :');

      document.getElementById('pasHumId').innerHTML =
        pasHumLocalStorage;

      if (pasHumLocalStorage !== null && pasHumLocalStorage !== ' ') {
        document.getElementById('pasHumId').innerHTML = "-";
      } else {
        document.getElementById('pasHumId').innerHTML =
          pasHumLocalStorage;
      }

      //* -------------------------------------------------

      //* Objectif Humidité.

      objectifHum = response.data.dataGestionHum.objectifHum;

      localStorage.setItem('gestionHum ==> Objectif :', objectifHum);

      objectifHumLocalStorage = localStorage.getItem('gestionHum ==> Objectif :');

      // console.log('=======> ', objectifHumLocalStorage);

      if (objectifHumLocalStorage !== null && objectifHumLocalStorage !== ' ') {

        document.getElementById('objectifHums').innerHTML = "-";
        console.log('pasAirLocalStorage === undefined');
      } else {

        document.getElementById('objectifHums').innerHTML =
          objectifHumLocalStorage;
      }

      //* -------------------------------------------------
    })

    //* -------------------------------------------------

    //* Durée de la descente Air.

    .then(() => {
      // Durée de la descente Hum.

      let CalculeNombreJour = () => {
        if (
          consigneHum == 0 ||
          consigneHum == '' ||
          consigneHum == null ||
          objectifHum == 0 ||
          objectifHum == '' ||
          objectifHum == null ||
          pasHum == 0 ||
          pasHum == '' ||
          pasHum == null
        ) {
          // console.log('Pas de paramètre pas de calcule des jours');
          return;
        } else {
          let dureeDescenteHum = ((consigneHum - objectifHum) / pasHum) * 12;

          // console.log('Durée Descente Hum', dureeDescenteHum);

          let totalHeures = dureeDescenteHum;

          nbJourHum = Math.floor(totalHeures / 24);

          totalHeures %= 360;

          nbHeureHum = Math.floor(totalHeures / 36);

          // console.log(
          //   'La durée de la descente Hum est de  : ' +
          //     nbJourHum +
          //     ' Jours ' +
          //     nbHeureHum +
          //     ' Heures '
          // );
        }

        localStorage.setItem('gestionHum ==> Nombre de jour :', nbJourHum);
        nbJourHumLocalStorage = localStorage.getItem('gestionHum ==> Nombre de jour :');

        localStorage.setItem("gestionHum ==> Nombre d'heures :", nbHeureHum);
        nbHeureHumLocalStorage = localStorage.getItem("gestionHum ==> Nombre d'heures :");

        document.getElementById('descenteHum').innerHTML =
          nbJourHumLocalStorage +
          ' ' +
          'Jours et' +
          ' ' +
          nbHeureHumLocalStorage +
          ' ' +
          'Heures';
      };

      // CalculeNombreJour();

      // setInterval(() => {
      //   CalculeNombreJour();
      // }, 120000);
      // -------------------------------------
    })

    //* -------------------------------------------------

    //* Stockage de la valeur deltat.

    .then(() => {
      let deltaTauxHum = parseFloat(tauxHum - consigneHum).toFixed(2);
      // console.log('delta Hum Front', deltaHum);

      localStorage.setItem('gestionHum ==> Delta :', deltaTauxHum);

      deltaTauxHumLocalStorage = localStorage.getItem('gestionHum ==> Delta :');

      document.getElementById('deltaHumidite').innerHTML =
        deltaTauxHumLocalStorage + '%';
    })

    //* -------------------------------------------------

    //* Catch des erreurs.

    .catch((error) => {
      console.log(error);
      console.log(JSON.stringify(error));
    });
};

getConsigneHum();

setInterval(() => {
  getConsigneHum();
  // console.log('récup consigneAir');
}, 15000);

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? 3 Post consigne hum dans la base.

document
  .getElementById('validationConsigneHum')
  .addEventListener('click', function () {
    //

    // console.log('Clic sur bouton validation Etal Hum');

    let consigneHumForm = document.getElementById('consigneHumForm').value;
    // console.log('consigneHumForm', consigneHumForm);

    localStorage.setItem('gestionHum ==> Dernier consigne:', consigneHumForm);

    const boutonValiderEtatHum = axios
      .post(
        'http://localhost:3003/api/gestionHumiditeRoutes/postConsigneHum/',
        {
          consigneHum: consigneHumForm,
        }
      )
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

//? 4 Post des datas hum dans la base.

document
  .getElementById('validationdataHum')
  .addEventListener('click', function () {
    //

    // console.log('Clic sur bouton validation Etal Hum');

    let pasHumForm = document.getElementById('pasHumForm').value;
    // console.log('pasHumForm', pasHumForm);

    let objectifHumForm = document.getElementById('objectifHumForm').value;
    // console.log('objectiHumForm', objectiHumForm);

    const boutonValiderEtalHum = axios
      .post('http://localhost:3003/api/gestionHumiditeRoutes/postDataHum/', {
        pasHum: pasHumForm,
        objectifHum: objectifHumForm,
      })
      .then(function (response) {
        // console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    window.location.reload();
  });

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//! ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
