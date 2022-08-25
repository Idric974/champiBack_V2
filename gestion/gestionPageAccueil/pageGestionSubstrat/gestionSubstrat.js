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

//* Température Air.

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
        localStorage.setItem('Valeure température Substrat : ', temperatureSubstrat);

        temperatureSubstratLocalStorage = localStorage.getItem(
          'Valeure température Substrat : '
        );

        document.getElementById('temperatureSubstrat').innerHTML =
          temperatureSubstratLocalStorage + '°C';
      }

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

        localStorage.setItem('consigneMaxDataSubstrat : ', consigneMaxDataSubstrat);

        consigneMaxDataSubstratLocalStorage = localStorage.getItem(
          'consigneMaxDataSubstrat : '
        );

        document.getElementById('consigneMaxDataSubstrat').innerHTML = 'Consigne Max : ' +
          consigneMaxDataSubstratLocalStorage + '°C';

      }

      //! -----------------------------------------

      //! consigne Min Data Substrat.

      if (typeof window !== 'undefined') {

        consigneMinDataSubstrat = response.data.dataSubstrat.consigneMinDataSubstrat
        // console.log('consigneMinDataSubstrat :', consigneMinDataSubstrat);

        localStorage.setItem('consigneMinDataSubstrat : ', consigneMinDataSubstrat);

        consigneMinDataSubstratLocalStorage = localStorage.getItem(
          'consigneMinDataSubstrat : '
        );

        document.getElementById('consigneMinDataSubstrat').innerHTML = 'Consigne Min : ' +
          consigneMinDataSubstratLocalStorage + '°C';

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
      console.log('Clic sur bouton validation consigne substrat');


      let consigneMaxDataSubstrat = document.getElementById('inputConsigneMaxDataSubstrat').value;
      console.log('consigneMaxDataSubstrat', consigneMaxDataSubstrat);

      let consigneMinDataSubstrat = document.getElementById('inputConsigneMinDataSubstrat').value;
      console.log('consigneMinDataSubstrat', consigneMinDataSubstrat);

      axios
        .post('http://localhost:3003/api/gestionSubstratRoutes/postConsigneSubstrat/', {
          consigneMaxDataSubstrat,
          consigneMinDataSubstrat
        })
        .then(function (response) {
          console.log(response.data);
        })
        .then(() => {
          window.location.reload();
        })
        .catch(function (error) {
          console.log(error);
        });
    })
};