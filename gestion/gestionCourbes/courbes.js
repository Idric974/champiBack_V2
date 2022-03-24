//! Les constantes.

const axios = require('axios');
const Chart = require('chart.js');
const {
  format,
  time,
  day,
  timeseries,
  hour,
  quarter,
  millisecond,
} = require('date-fns');

//! --------------------------------------------------------------

//! Les variables.

let dataCourbeHumidite;
let valeurTauxHumidite = [];

let listTauxHumidite = [];
let consigneHumidite = [];
let listConsigneHumidite;

let temperatureSec180 = [];
let listTemperatureSec180;

let temperatureHum90 = [];
let listTemperatureHum90;

let date;

let lab = [];
let listLab;

let dateDemarrageCycle;
// let dateDuJour = moment().add(1, 'days').format('YYYY-MM-DD');
// let nbJour = [];
//! --------------------------------------------------------------

//! Logique pour la gestion des onglet.

const onglets = Array.from(document.querySelectorAll('.onglets'));
const contenu = Array.from(document.querySelectorAll('.contenu'));

onglets.forEach((onglet) => {
  onglet.addEventListener('click', tabsAnimation);
});

let index = 0;

function tabsAnimation(e) {
  const el = e.target;

  onglets[index].classList.remove('active');
  contenu[index].classList.remove('active-contenu');

  index = onglets.indexOf(el);

  onglets[index].classList.add('active');
  contenu[index].classList.add('active-contenu');
}

//! --------------------------------------------------------------

//! Logique pour la lréation de la date de début du cycle.

var btn = document.getElementById('btn');
btn.addEventListener(
  'click',
  function () {
    let text = 'Etes-vous sûre de vouloir démarrer un cycle ?';
    if (confirm(text) == true) {
      let dateDemarrageCycle = format(new Date(), 'yyyy-MM-dd');
      console.log('Date de demarrage du cycle : ', dateDemarrageCycle);

      axios
        .post(
          'http://localhost:3003/api/gestionCourbeRoutes/dateDemarrageCycle/',
          {
            dateDemarrageCycle: dateDemarrageCycle,
          }
        )
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });

      const infoSmall = document.getElementById('infoSmallButton');

      infoSmallId.classList.remove('infoSmallDisplay');

      setTimeout(() => {
        infoSmallId.classList.add('infoSmallDisplay');
      }, 5000);
    } else {
      console.log('You canceled!');
    }
  },
  false
);

//! --------------------------------------------------------------

//! Logique pour l'affichage des courbes.

let getDataCourbeHumidite = () => {
  axios({
    url: 'http://localhost:3003/api/gestionCourbeRoutes/getTauxHumiditeCourbe/',
    method: 'get',
  })
    .then((response) => {
      console.log(
        'La réponse de la requête : ',
        response.data.tauxHumiditeCourbe
      );

      dataCourbeHumidite = response.data.tauxHumiditeCourbe;
      console.log('La réponse de la requête : ', dataCourbeHumidite);

      dataCourbeHumidite.forEach((item, index) =>
        valeurTauxHumidite.push({
          // x: item['createdAt'].split('.')[0].split('T')[0],
          x: item['createdAt'],
          y: item['tauxHumidite'],
        })
      );

      // format(item['tauxHumidite'], 'yyyy-MM-dd');

      console.log('Tableau des valeur à afficher : ', valeurTauxHumidite);
    })

    .then(() => {
      // ! Logique pour les courbes.

      let test = [2, 3, 4];

      const data = {
        // labels: ['Jour-1', 'Jour-2', 'Jour-3', 'Jour-4'],
        datasets: [
          {
            label: 'Courbe humidité',
            data: valeurTauxHumidite,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            lineTension: 0.2,
            pointRadius: 0,
            borderWidth: 1,
            xAxisID: 'xAxis1',
          },
        ],
      };

      let options = {
        scales: {
          x: {
            display: false,
            // type: time,
            type: 'category',
            ticks: {
              callback: function (label) {
                let nombre = test;
              },
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      };

      const config = {
        type: 'line',
        data,
        options,
      };

      const myChart = new Chart(document.getElementById('myChart'), config);

      //! --------------------------------------------------------------
    })
    .catch((error) => {
      console.log(error);
      console.log(JSON.stringify(error));
    });
};

getDataCourbeHumidite();

//! --------------------------------------------------------------
