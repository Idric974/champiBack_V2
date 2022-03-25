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

//? LOGIQUE POUR LA GESTION DES ONGLETS.

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

//? I) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES AIR ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//! Création de la date de début du cycle AIR.

var btnAir = document.getElementById('btnAir');
btnAir.addEventListener(
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

//! Les variables.

let dataCourbeAir;
let valeurTemperatureAir = [];

let consigneCourbeAir;
let valeurConsigneAir = [];

let dateDemarrageCycle;
// let dateDuJour = moment().add(1, 'days').format('YYYY-MM-DD');
// let nbJour = [];
//! --------------------------------------------------------------

let getDataCourbeAir = () => {
  axios({
    url: 'http://localhost:3003/api/gestionCourbeRoutes/getTemperatureAirCourbe/',
    method: 'get',
  })
    .then((response) => {
      console.log(
        'La réponse de la requête temperature air : ',
        response.data.temperatureAirCourbe
      );

      dataCourbeAir = response.data.temperatureAirCourbe;
      // console.log(
      //   'La réponse de la requête temperature air : ',
      //   temperatureAir
      // );

      dataCourbeAir.forEach((item, index) =>
        valeurTemperatureAir.push({
          // x: item['createdAt'].split('.')[0].split('T')[0],
          x: item['createdAt'],
          y: item['temperatureAir'],
        })
      );

      console.log(
        'Tableau des valeur temperature air à afficher : ',
        valeurTemperatureAir
      );
    })

    .then(() => {
      let getConsigneAir = () => {
        axios({
          url: 'http://localhost:3003/api/gestionCourbeRoutes/getConsigneAirCourbe/',
          method: 'get',
        }).then((response) => {
          // console.log(
          //   'La réponse de la requête consigne Air : ',
          //   response.data.consigneAirCourbe
          // );

          consigneCourbeAir = response.data.consigneAirCourbe;
          // console.log(
          //   'La réponse de la requête consigne air : ',
          //   consigneCourbeAir
          // );

          consigneCourbeAir.forEach((item, index) =>
            valeurConsigneAir.push({
              // x: item['createdAt'].split('.')[0].split('T')[0],
              x: item['createdAt'],
              y: item['consigneAir'],
            })
          );

          console.log(
            'Tableau des valeur consigne air à afficher : ',
            valeurConsigneAir
          );
        });
      };

      getConsigneAir();
    })

    .then(() => {
      // ! Logique pour les courbes.

      //! Le contexte graphique.
      const ctxAir = document.getElementById('myChartAir').getContext('2d');
      //! ---------------------------------

      //!les labels.
      const myLabelsAir = [];
      //! ---------------------------------

      //! Les datas.
      const data = {
        labels: myLabelsAir,

        datasets: [
          // Courbe taux humidité
          {
            label: 'Courbe Température Air',
            data: valeurTemperatureAir,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            lineTension: 0.2,
            pointRadius: 0,
            // xAxisID: 'xAxis1',
          },

          // Courbe consigne air.
          {
            label: 'Courbe Consigne Air.',
            data: valeurConsigneAir,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            lineTension: 0.2,
            pointRadius: 0,
            // xAxisID: 'xAxis2',
          },
          // ------------------------------
        ],
      };
      //! ---------------------------------

      //! Les options.
      const optionsAir = {
        animation: {
          duration: 0,
        },
        scales: {
          x: {
            display: false,
            // id: 'xAxis1',
            // time: {
            //   displayFormats: {
            //     quarter: 'HH:mm',
            //   },
            // },
            ticks: {
              // callback: function (label) {
              // },
            },
          },

          x: {
            display: false,
            // id: 'xAxis2',
            // time: {
            //   displayFormats: {
            //     quarter: 'HH:mm',
            //   },
            // },
            ticks: {
              // callback: function (label) {
              // },
            },
          },
          y: {},
        },
      };
      //! ---------------------------------

      //! La configuration du graphique.
      const configAir = {
        type: 'line',
        data,
        optionsAir,
      };
      //! ---------------------------------

      //!L'instanciation de graphique.
      const myChartAir = new Chart(ctxAir, configAir);
      //! ---------------------------------

      //! --------------------------------------------------------------
    })
    .catch((error) => {
      console.log(error);
      console.log(JSON.stringify(error));
    });
};

getDataCourbeAir();

//! --------------------------------------------------------------

//? ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ FIN GESTION COURBES AIR ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//? II) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES HUMIDITE ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//! Création de la date de début du cycle HUM.

var btnHum = document.getElementById('btnHum');

btnHum.addEventListener(
  'click',
  function () {
    let text = 'Etes-vous sûre de vouloir démarrer un cycle ?';
    if (confirm(text) == true) {
      let dateDemarrageCycleHum = format(new Date(), 'yyyy-MM-dd');
      console.log('Date de demarrage du cycle : ', dateDemarrageCycleHum);

      axios
        .post(
          'http://localhost:3003/api/gestionCourbeRoutes/dateDemarrageCycle/',
          {
            dateDemarrageCycleHum: dateDemarrageCycleHum,
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

//! Les variables.

let dataCourbeHumidite;
let valeurTauxHumidite = [];

let consigneCourbeHumidite;
let valeurConsigneHumidite = [];

let dateDemarrageCycleHum;
// let dateDuJour = moment().add(1, 'days').format('YYYY-MM-DD');
// let nbJour = [];
//! --------------------------------------------------------------

//! Logique pour l'affichage des courbes.

let getDataCourbeHumiditeHum = () => {
  axios({
    url: 'http://localhost:3003/api/gestionCourbeRoutes/getTauxHumiditeCourbe/',
    method: 'get',
  })
    .then((response) => {
      // console.log(
      //   'La réponse de la requête taux humidité : ',
      //   response.data.tauxHumiditeCourbe
      // );

      dataCourbeHumidite = response.data.tauxHumiditeCourbe;
      // console.log(
      //   'La réponse de la requête taux humidité : ',
      //   dataCourbeHumidite
      // );

      dataCourbeHumidite.forEach((item, index) =>
        valeurTauxHumidite.push({
          // x: item['createdAt'].split('.')[0].split('T')[0],
          x: item['createdAt'],
          y: item['tauxHumidite'],
        })
      );

      console.log(
        'Tableau des valeur taux humidité à afficher : ',
        valeurTauxHumidite
      );
    })

    .then(() => {
      let getConsigneHum = () => {
        axios({
          url: 'http://localhost:3003/api/gestionCourbeRoutes/getconsigneHumiditeCourbe/',
          method: 'get',
        }).then((response) => {
          // console.log(
          //   'La réponse de la requête consigne humidité : ',
          //   response.data.consigneHumiditeCourbe
          // );

          consigneCourbeHumidite = response.data.consigneHumiditeCourbe;
          // console.log(
          //   'La réponse de la requête consigne humidité : ',
          //   consigneCourbeHumidite
          // );

          consigneCourbeHumidite.forEach((item, index) =>
            valeurConsigneHumidite.push({
              // x: item['createdAt'].split('.')[0].split('T')[0],
              x: item['createdAt'],
              y: item['consigneHum'],
            })
          );

          console.log(
            'Tableau des valeur consigne humidité à afficher : ',
            valeurConsigneHumidite
          );
        });
      };

      getConsigneHum();
    })

    .then(() => {
      // ! Logique pour les courbes.

      //! Le contexte graphique.
      const ctxHum = document.getElementById('myChartHum').getContext('2d');
      //! ---------------------------------

      //!les labels.
      const myLabelsHum = [];
      //! ---------------------------------

      //! Les datas.
      const data = {
        labels: myLabelsHum,

        datasets: [
          // Courbe taux humidité
          {
            label: 'Courbe Taux Humidité',
            data: valeurTauxHumidite,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            lineTension: 0.2,
            pointRadius: 0,
            // xAxisID: 'xAxis1',
          },

          // Courbe consigne humidité
          {
            label: 'Courbe Consigne humidité',
            data: valeurConsigneHumidite,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            lineTension: 0.2,
            pointRadius: 0,
            // xAxisID: 'xAxis2',
          },
          // ------------------------------
        ],
      };
      //! ---------------------------------

      //! Les options.
      const optionsHum = {
        animation: {
          duration: 0,
        },
        scales: {
          x: {
            display: false,
            // id: 'xAxis1',
            time: {
              displayFormats: {
                quarter: 'HH:mm',
              },
            },
            ticks: {
              // callback: function (label) {
              // },
            },
          },

          x: {
            display: false,
            // id: 'xAxis2',
            time: {
              displayFormats: {
                quarter: 'HH:mm',
              },
            },
            ticks: {
              // callback: function (label) {
              // },
            },
          },
          y: {},
        },
      };
      //! ---------------------------------

      //! La configuration du graphique.
      const configHum = {
        type: 'line',
        data,
        optionsHum,
      };
      //! ---------------------------------

      //!L'instanciation de graphique.
      const myChartHum = new Chart(ctxHum, configHum);
      //! ---------------------------------

      //! --------------------------------------------------------------
    })
    .catch((error) => {
      console.log(error);
      console.log(JSON.stringify(error));
    });
};

getDataCourbeHumiditeHum();

//! --------------------------------------------------------------

//? II) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ FIN GESTION COURBES HUMIDITE ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//? III) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES Co2 ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//? III) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ FIN GESTION COURBES Co2 ➖➖➖➖➖➖➖➖➖➖➖➖➖➖