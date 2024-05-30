//! Gestion Substrat.

const axios = require('axios');

//! Rafraichissement de la page.

setInterval(() => {
  window.location.reload();
}, 1800000);

let myDate = new Date();
let date = myDate.toLocaleString();

console.log('Page actualisée le : ' + date);

//! ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//? 1 Récupération de la tempèrature substrat dans la base.

//* Température Substrat.

let temperatureSubstrat;
let temperatureSubstratLocalStorage;

let getTemperatureSubstrat = () => {
  axios({
    url: 'http://localhost:3003/api/gestionSubstratRoutes/getTemperatureSubstrat/',
    method: 'get',
  })
    .then((response) => {

      // console.log(response.data.temperatureSubsrat.temperatureSubstrat);

      temperatureSubstrat = response.data.temperatureSubsrat.temperatureSubstrat;

      if (typeof window !== 'undefined') {
        localStorage.setItem('gestionSubstrat ==> Tempèrature :', temperatureSubstrat);

        temperatureSubstratLocalStorage = localStorage.getItem(
          'gestionSubstrat ==> Tempèrature :'
        );

        document.getElementById('temperatureSubstrat').innerHTML =
          temperatureSubstratLocalStorage + '°C';
      }

      let consigneMaxDataSubstratLocalStorage = localStorage.getItem(
        'gestionSubstrat ==> Dernier Consigne Max:'
      );

      document.getElementById('dernierConsigneSubstratMaxEntree').innerHTML =
        consigneMaxDataSubstratLocalStorage;

      let consigneMinDataSubstratLocalStorage = localStorage.getItem(
        'gestionSubstrat ==> Dernier Consigne Min:'
      );

      document.getElementById('dernierConsigneSubstratMinEntree').innerHTML =
        consigneMinDataSubstratLocalStorage;

    })
    .catch((error) => {
      console.log(error);
      console.log(JSON.stringify(error));
    });
};

getTemperatureSubstrat();

setInterval(() => {
  getTemperatureSubstrat();
  // console.log('récup tempAir');
}, 10000);

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


let consigneMaxDataSubstrat;
let consigneMaxDataSubstratLocalStorage;
let consigneMinDataSubstrat;
let consigneMinDataSubstratLocalStorage;

let getConsigneSubstrat = () => {
  axios({
    url: 'http://localhost:3003/api/gestionSubstratRoutes/getDataSubstrat/',
    method: 'get',
  })
    .then((response) => {
      // console.log('Get Data Substrat : ', response.data);

      //! consigne Max Data Substrat.

      if (typeof window !== 'undefined') {

        consigneMaxDataSubstrat = response.data.dataSubstrat.consigneMaxDataSubstrat
        //console.log('consigneMaxDataSubstrat :', consigneMaxDataSubstrat);

        localStorage.setItem('gestionSubstrat ==> Consigne Max :', consigneMaxDataSubstrat);

        consigneMaxDataSubstratLocalStorage = localStorage.getItem(
          'gestionSubstrat ==> Consigne Max :'
        );

        document.getElementById('consigneMaxDataSubstrat').innerHTML =
          consigneMaxDataSubstratLocalStorage;

      }

      //! -----------------------------------------

      //! consigne Min Data Substrat.

      if (typeof window !== 'undefined') {

        consigneMinDataSubstrat = response.data.dataSubstrat.consigneMinDataSubstrat
        // console.log('consigneMinDataSubstrat :', consigneMinDataSubstrat);

        localStorage.setItem('gestionSubstrat ==> Consigne Min :', consigneMinDataSubstrat);

        consigneMinDataSubstratLocalStorage = localStorage.getItem(
          'gestionSubstrat ==> Consigne Min :'
        );

        document.getElementById('consigneMinDataSubstrat').innerHTML =
          consigneMinDataSubstratLocalStorage;
      }

    })
    .catch((e) => {
      console.log('ERREUR : ', e);
    })
}

getConsigneSubstrat();

setInterval(() => {
  getConsigneSubstrat();
  // console.log('récup consigneAir');
}, 15000);

//? 3 Post des consignes substrat dans la base.

if (typeof document !== 'undefined') {
  document
    .getElementById('validationConsigneSubstrat')
    .addEventListener('click', function () {
      //
      // console.log('Clic sur bouton validation consigne substrat');

      //* Consigne Max Substrat.

      let consigneMaxDataSubstrat = document.getElementById('inputConsigneMaxDataSubstrat').value;
      // console.log('consigneMaxDataSubstrat', consigneMaxDataSubstrat);

      localStorage.setItem('gestionSubstrat ==> Dernier Consigne Max:', consigneMaxDataSubstrat);

      //* -----------------------------------------

      //* Consigne Min Substrat.

      let consigneMinDataSubstrat = document.getElementById('inputConsigneMinDataSubstrat').value;

      // console.log('consigneMinDataSubstrat', consigneMinDataSubstrat);
      localStorage.setItem('gestionSubstrat ==> Dernier Consigne Min:', consigneMinDataSubstrat);

      //* -----------------------------------------

      axios
        .post('http://localhost:3003/api/gestionSubstratRoutes/postConsigneSubstrat/', {
          consigneMaxDataSubstrat,
          consigneMinDataSubstrat
        })
        .then(function (response) {
          // console.log(response.data);
        })
        .then(() => {
          window.location.reload();
        })
        .catch(function (error) {
          console.log(error);
        });
    })
};