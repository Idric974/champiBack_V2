//! Gestion Air.

const axios = require('axios');

//! Rafraichissement de la page.

setInterval(() => {
  window.location.reload();
}, 1800000);

let myDate = new Date();
let date = myDate.toLocaleString();

console.log('Page actualisée le : ' + date);

//! ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//! Afficher la date.

function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function afficherDate() {
  while (true) {
    await pause(1000);
    var cejour = new Date();
    var options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    };
    var date = cejour.toLocaleDateString('fr-RU', options);
    var heure =
      ('0' + cejour.getHours()).slice(-2) +
      ':' +
      ('0' + cejour.getMinutes()).slice(-2) +
      ':' +
      ('0' + cejour.getSeconds()).slice(-2);
    var dateheure = date + ' ' + heure;
    var dateheure = dateheure.replace(/(^\w{1})|(\s+\w{1})/g, (lettre) =>
      lettre.toUpperCase()
    );
    document.getElementById('afficheDate').innerHTML = dateheure;
  }
}

afficherDate();

//! ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//! I) Gesiont Air.

//? 1 Récupération de la tempèrature Air dans la base.

//* Température Air.

let temperatureAir;
let temperatureAirLocalStorage;

//* Consigne Air.

let deltaAir;
let deltaAirLocalStorage;

let getTemperatureAir = () => {
  axios({
    url: 'http://localhost:3003/api/gestionAirRoutes/getTemperatureAir/',
    method: 'get',
  })
    .then((response) => {
      // console.log(response.data.temperatureAir.temperatureAir);

      temperatureAir = response.data.temperatureAir.temperatureAir;

      localStorage.setItem('Valeure température Air : ', temperatureAir);

      temperatureAirLocalStorage = localStorage.getItem(
        'Valeure température Air : '
      );

      document.getElementById('temperatureAir').innerHTML =
        temperatureAirLocalStorage + '°C';
    })
    .catch((error) => {
      console.log(error);
      console.log(JSON.stringify(error));
    });
};

getTemperatureAir();

setInterval(() => {
  getTemperatureAir();
  // console.log('récup tempAir');
}, 10000);

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? 2 Récupération de la consigne Air dans la base.

//* température Air.

let consigneAir;
let consigneAirLocalStorage;
let objectifAir;
let pasAir;
let nbJourAir;
let nbJourAirLocalStorage;
let nbHeureAir;
let nbHeureAirLocalStorage;

let getConsigneAir = () => {
  axios({
    url: 'http://localhost:3003/api/gestionAirRoutes/getDataAir/',
    method: 'get',
  })
    //
    //* Récupération des données.

    .then((response) => {
      // console.log(response.data);

      //* Consigne Air.

      consigneAir = response.data.datatemperatureAir.consigneAir;

      localStorage.setItem('Valeure consigne Air : ', consigneAir);

      consigneAirLocalStorage = localStorage.getItem('Valeure consigne Air : ');

      document.getElementById('consigneAir').innerHTML =
        'Consigne Air : ' + consigneAirLocalStorage + '°C';

      objectifAir = response.data.datatemperatureAir.objectifAir;

      pasAir = response.data.datatemperatureAir.pasAir;
    })

    //* -------------------------------------------------

    //* Durée de la descente Air.

    .then(() => {
      let CalculeNombreJour = () => {
        if (
          consigneAir == 0 ||
          consigneAir == '' ||
          consigneAir == null ||
          objectifAir == 0 ||
          objectifAir == '' ||
          objectifAir == null ||
          pasAir == 0 ||
          pasAir == '' ||
          pasAir == null
        ) {
          // console.log('Pas de paramètre pas de calcule des jours');

          return;
        } else {
          let dureeDescenteAir = ((consigneAir - objectifAir) / pasAir) * 12;

          // console.log('Durée Descente Air', dureeDescenteAir);

          let totalHeures = dureeDescenteAir;

          nbJourAir = Math.floor(totalHeures / 24);

          totalHeures %= 360;

          nbHeureAir = Math.floor(totalHeures / 36);

          // console.log(
          //   'La durée de la descente Air est de  : ' +
          //     nbJourAir +
          //     ' Jours ' +
          //     nbHeureAir +
          //     ' Heures '
          // );
        }

        localStorage.setItem('Valeure nbJour Air : ', nbJourAir);
        nbJourAirLocalStorage = localStorage.getItem('Valeure nbJour Air : ');

        localStorage.setItem('Valeure nbHeure Air : ', nbHeureAir);
        nbHeureAirLocalStorage = localStorage.getItem('Valeure nbHeure Air : ');

        document.getElementById('descenteAir').innerHTML =
          nbJourAirLocalStorage +
          ' ' +
          'Jours et' +
          ' ' +
          nbHeureAirLocalStorage +
          ' ' +
          'Heures';
      };

      CalculeNombreJour();

      setInterval(() => {
        CalculeNombreJour();
      }, 120000);
    })

    //* -------------------------------------------------

    //* Stockage de la valeur deltat.

    .then(() => {
      deltaAir = parseFloat(temperatureAir - consigneAir).toFixed(2);
      // console.log('delta Air Front', deltaAir);

      localStorage.setItem('Valeure delta Air : ', deltaAir);

      deltaAirLocalStorage = localStorage.getItem('Valeure delta Air : ');

      document.getElementById('delatAir').innerHTML =
        'Delta Air : ' + deltaAirLocalStorage + '°C';
    })

    //* -------------------------------------------------

    //* Catch des erreurs.

    .catch((error) => {
      console.log(error);

      console.log(JSON.stringify(error));
    });

  //* -------------------------------------------------
};

getConsigneAir();

setInterval(() => {
  getConsigneAir();
  // console.log('récup consigneAir');
}, 15000);

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? 3 Post consigne air dans la base.

document
  .getElementById('validationConsigneAir')
  .addEventListener('click', function () {
    //
    // console.log('Clic sur bouton validation Etal Hum');

    let consigneAirForm = document.getElementById('consigneAirForm').value;
    // console.log('consigneAirForm', consigneAirForm);

    const boutonValiderEtalAir = axios
      .post('http://localhost:3003/api/gestionAirRoutes/postConsigneAir/', {
        consigneAir: consigneAirForm,
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

// 4 Post des datas air dans la base.

document
  .getElementById('validationdataAir')
  .addEventListener('click', function () {
    //
    // console.log('Clic sur bouton validation Etal Hum');

    let pasAirForm = document.getElementById('pasAirForm').value;
    // console.log('pasAirForm', pasAirForm);
    let objectiAirForm = document.getElementById('objectiAirForm').value;
    // console.log('objectiAirForm', objectiAirForm);

    const boutonValiderEtalHum = axios
      .post('http://localhost:3003/api/gestionAirRoutes/postDataAir/', {
        pasAir: pasAirForm,
        objectifAir: objectiAirForm,
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    window.location.reload();
  });

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//! ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
