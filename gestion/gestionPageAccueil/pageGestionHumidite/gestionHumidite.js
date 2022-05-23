const axios = require('axios');

//! Gestion Humidité.

//? 1 Récupération du taux humidité dans la base.

// Taux humidité.
let tauxHum;
let tauxHumLocalStorage;
let objectifHum;
let heureHum;
let pasHum;
let nbJourHum;
let nbJourHumLocalStorage;
let nbHeureHum;
let nbHeureHumLocalStorage;

// Tempèrature Hum
let temperatureSec;
let temperatureSecLocalStorage;
let temperatureHum;
let temperatureHumLocalStorage;

// Consigne Air.
let deltaTauxHum;
let deltaTauxHumLocalStorage;

let getTauxHum = () => {
  axios({
    url: 'http://localhost:3003/api/gestionHumiditeRoutes/getTauxHumidite/',
    method: 'get',
  })
    .then((response) => {
      // console.log(response.data);

      // température Air.

      tauxHum = response.data.gestionTauxHum.tauxHumidite;

      localStorage.setItem('Valeure taux humidité : ', tauxHum);

      tauxHumLocalStorage = localStorage.getItem('Valeure taux humidité : ');

      document.getElementById('tauxHumidite').innerHTML =
        tauxHumLocalStorage + '%';

      // -------------------------------------

      // Température Sec.

      temperatureSec = response.data.gestionTauxHum.valeursMesureSec180;

      localStorage.setItem('Valeure tempSec hum : ', temperatureSec);

      temperatureSecLocalStorage = localStorage.getItem(
        'Valeure tempSec hum : '
      );

      document.getElementById('temperatureSec').innerHTML =
        'Température Sec : ' + temperatureSecLocalStorage + '°C';

      // -------------------------------------

      // Température Hum.

      temperatureHum = response.data.gestionTauxHum.valeursMesureHum90;

      localStorage.setItem('Valeure tempHum hum : ', temperatureHum);

      temperatureHumLocalStorage = localStorage.getItem(
        'Valeure tempHum hum : '
      );

      document.getElementById('temperatureHum').innerHTML =
        'Température Hum : ' + temperatureHumLocalStorage + '°C';

      // -------------------------------------
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
    .then((response) => {
      // console.log(response.data);

      // Consigne Hum.

      consigneHum = response.data.dataGestionHum.consigneHum;

      localStorage.setItem('Valeure consigne Hum : ', consigneHum);

      consigneHumLocalStorage = localStorage.getItem('Valeure consigne Hum : ');

      document.getElementById('consigneHumidite').innerHTML =
        'Consigne Hum : ' + consigneHumLocalStorage + '%';

      // -------------------------------------

      // Durée de la descente Hum.

      objectifHum = response.data.dataGestionHum.objectifHum;
      pasHum = response.data.dataGestionHum.pasHum;

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

        localStorage.setItem('Valeure nbJour Hum : ', nbJourHum);
        nbJourHumLocalStorage = localStorage.getItem('Valeure nbJour Hum : ');

        localStorage.setItem('Valeure nbHeure Hum : ', nbHeureHum);
        nbHeureHumLocalStorage = localStorage.getItem('Valeure nbHeure Hum : ');

        document.getElementById('descenteHum').innerHTML =
          nbJourHumLocalStorage +
          ' ' +
          'Jours et' +
          ' ' +
          nbHeureHumLocalStorage +
          ' ' +
          'Heures';
      };

      CalculeNombreJour();

      setInterval(() => {
        CalculeNombreJour();
      }, 120000);
      // -------------------------------------
    })
    .then(() => {
      let deltaTauxHum = parseFloat(tauxHum - consigneHum).toFixed(2);
      // console.log('delta Hum Front', deltaHum);

      localStorage.setItem('Valeure delta hum : ', deltaTauxHum);

      deltaTauxHumLocalStorage = localStorage.getItem('Valeure delta hum : ');

      document.getElementById('deltaHumidite').innerHTML =
        'Delta Hum : ' + deltaTauxHumLocalStorage + '%';
    })

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
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//! ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
