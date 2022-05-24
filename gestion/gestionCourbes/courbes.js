//! Les constantes.

const axios = require('axios');
const Chart = require('chart.js');
const zoomPlugin = require('chartjs-plugin-zoom');

//Chart.register(zoomPlugin);

const {
  format,
  time,
  day,
  timeseries,
  hour,
  quarter,
  millisecond,
} = require('date-fns');

//! --------------------------------------------------

//! Le variable.

let dateDuJour;
let jourDuCycle;
let jourDuCycleLocalStorage;
const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

//! --------------------------------------------------

//! Affichage du jour du cycle.

let getJourDuCycle = () => {
  //
  axios({
    url: 'http://localhost:3003/api/gestionAirRoutes/getTemperatureAir/',
    method: 'get',
  })
    //* Récupération du jour du cycle.
    .then((response) => {
      console.log('Jour du cycle : ', response.data.temperatureAir.jourDuCycle);

      jourDuCycle = response.data.temperatureAir.jourDuCycle;

      localStorage.setItem('Jour du cycle : ', jourDuCycle);

      jourDuCycleLocalStorage = localStorage.getItem('Jour du cycle : ');

      console.log('Jour du cycle : ', jourDuCycleLocalStorage);

      document.getElementById('jourDuCycle').innerHTML =
        'Jour ' + jourDuCycleLocalStorage;
    })
    //* -------------------------*

    //* Date du jour.
    .then(() => {
      dateDuJour = new Date();
      // console.log('Date du Jour : ', dateDuJour);
      document.getElementById('dateDuJourCycle').innerHTML = dateDuJour
        .toLocaleString('fr-FR', options)
        .toLocaleUpperCase();
    })
    //* -------------------------*

    .catch((error) => {
      console.log(error);
      console.log(JSON.stringify(error));
    });
};

getJourDuCycle();

setInterval(() => {
  getJourDuCycle();
}, 3600000);

//! --------------------------------------------------

//! Affichage date démarrage cycle.

let dateDemarrageDuCycle;
let dateDemarrageDuCycleStorage;

let getDateDemarrageDuCycle = () => {
  //
  axios({
    url: 'http://localhost:3003/api/gestionCourbeRoutes/getDateDemarrageCycle/',
    method: 'get',
  })
    //* Récupération date démarrage du cycle.
    .then((response) => {
      console.log(
        'Date démarrage du cycle : ',
        response.data.dateDemarrageCycle.dateDemarrageCycle
      );

      dateDemarrageDuCycle = new Date(
        response.data.dateDemarrageCycle.dateDemarrageCycle
      )
        .toLocaleString()
        .split(',')[0];

      localStorage.setItem('Date démarrage cycle : ', dateDemarrageDuCycle);

      dateDemarrageDuCycleStorage = localStorage.getItem(
        'Date démarrage cycle : '
      );

      document.getElementById('dateDemarrageCycle').innerHTML =
        'DÉMARRAGE : ' + dateDemarrageDuCycleStorage;
    })
    //* -------------------------*

    //* Date du jour.
    .then(() => {
      // dateDuJour = new Date();
      // // console.log('Date du Jour : ', dateDuJour);
      // document.getElementById('dateDuJourCycle').innerHTML = dateDuJour
      //   .toLocaleString('fr-FR', options)
      //   .toLocaleUpperCase();
    })
    //* -------------------------*

    .catch((error) => {
      console.log(error);
      console.log(JSON.stringify(error));
    });
};

getDateDemarrageDuCycle();

//! --------------------------------------------------

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

//! Bouton création de la date de début du cycle AIR.

var btnAir = document.getElementById('btnAir');
btnAir.addEventListener(
  'click',
  function () {
    let text = 'Etes-vous sûre de vouloir démarrer un cycle ?';
    if (confirm(text) == true) {
      //
      let dateDemarrageCycle = new Date();
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

      getJourDuCycle();

      setTimeout(() => {
        infoSmallId.classList.add('infoSmallDisplay');
      }, 5000);

      setTimeout(() => {
        location.reload();
      }, 5500);
    } else {
      console.log('You canceled!');
    }
  },
  false
);

//! --------------------------------------------------------------

//? I) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES AIR ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//! LOGIQUE POUR L'AFFICHAGE DES COURBES DATA.

//! Les variables.

let dataCourbeAir;
let valeurTemperatureAir = [];

let consigneCourbeAir;
let valeurConsigneAir = [];

//! --------------------------------------------------------------

let getDataCourbeAir = () => {
  axios({
    url: 'http://localhost:3003/api/gestionCourbeRoutes/getTemperatureAirCourbe/',
    method: 'get',
  })
    .then((response) => {
      // console.log('La réponse de la requête temperature air : ', response.data);

      //* Récupération de la température.

      dataCourbeAir = response.data.temperatureAirCourbe;
      // console.log(
      //   'La réponse de la requête temperature air : ',
      //   temperatureAir
      // );

      dataCourbeAir.forEach((item, index) =>
        valeurTemperatureAir.push({
          // x: item['createdAt'],
          x: item['valeurAxeX'],
          y: item['temperatureAir'],
        })
      );

      // console.table(
      //   'Tableau des valeurs temperature air à afficher : ',
      //   valeurTemperatureAir
      // );

      //*---------------------------------------------

      //* Récupération de la consigne.

      consigneCourbeAir = response.data.temperatureAirCourbe;

      // console.log(
      //   'La réponse de la requête consigne air : ',
      //   consigneCourbeAir
      // );

      consigneCourbeAir.forEach((item, index) =>
        valeurConsigneAir.push({
          x: item['valeurAxeX'],
          y: item['consigne'],
        })
      );

      // console.table(
      //   'Tableau des valeurs consigne air à afficher : ',
      //   valeurConsigneAir
      // );

      //*---------------------------------------------
    })

    .then(() => {
      // ! Logique pour les courbes Air.

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
            display: false,
          },
        ],
      };
      //! ---------------------------------

      //! Les options.
      const optionsAir = {
        animation: {
          duration: 0,
        },
        scales: {
          x: {},

          y: {},
        },
        plugins: {
          zoom: {},
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

      Chart.register(zoomPlugin);

      //! --------------------------------------------------------------
    })
    .catch((error) => {
      console.log(error);
      console.log(JSON.stringify(error));
    });
};

getDataCourbeAir();

//! --------------------------------------------------------------

//! LOGIQUE POUR L'AFFICHAGE DES COURBES VANNE.

//! Les variables.

let dataCourbeAirVanne;
let valeurTemperatureAirVanne = [];

//! --------------------------------------------------------------

let getDataCourbeAirVanne = () => {
  axios({
    url: 'http://localhost:3003/api/gestionCourbeRoutes/getTemperatureAirCourbe/',
    method: 'get',
  })
    .then((response) => {
      // console.log('La réponse de la requête vanne air : ', response.data);

      //* Récupération de la valeur vanne.

      dataCourbeAirVanne = response.data.temperatureAirCourbe;
      // console.log(
      //   'La réponse de la requête vanne air : ',
      //   temperatureAir
      // );

      dataCourbeAirVanne.forEach((item, index) =>
        valeurTemperatureAirVanne.push({
          // x: item['createdAt'],
          x: item['valeurAxeX'],
          y: item['etatRelay'],
        })
      );

      // console.log(
      //   'Tableau des valeurs vanne air à afficher : ',
      //   valeurTemperatureAirVanne
      // );

      //*---------------------------------------------
    })

    .then(() => {
      // ! Logique pour les courbes Air.

      //! Le contexte graphique.
      const ctxVanne = document
        .getElementById('myChartAirVanne')
        .getContext('2d');
      //! ---------------------------------

      //!les labels.
      const myLabelsVanne = [];
      //! ---------------------------------

      //! Les datas.
      const data = {
        labels: myLabelsVanne,

        datasets: [
          // Courbe taux humidité
          {
            label: 'Courbe Vanne Air',
            data: valeurTemperatureAirVanne,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            lineTension: 0.2,
            pointRadius: 0,
          },
        ],
      };
      //! ---------------------------------

      //! Les options.
      const optionsVanne = {
        animation: {
          duration: 0,
        },
        scales: {
          x: {},

          y: {
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (item, index, ticks) {
                return item + '%';
              },
            },
          },
        },
      };
      //! ---------------------------------

      //! La configuration du graphique.
      const configVanne = {
        type: 'line',
        data,
        optionsVanne,
      };
      //! ---------------------------------

      //!L'instanciation de graphique.
      const myChartVanne = new Chart(ctxVanne, configVanne);
      //! ---------------------------------

      //! --------------------------------------------------------------
    })
    .catch((error) => {
      console.log(error);
      console.log(JSON.stringify(error));
    });
};

getDataCourbeAirVanne();

//! --------------------------------------------------------------

//? ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ FIN GESTION COURBES AIR ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//? II) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ GESTION COURBES HUMIDITE ➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//! Les variables.

let dataCourbeHumidite;
let valeurTauxHumidite = [];

let consigneCourbeHumidite;
let valeurConsigneHumidite = [];

//! --------------------------------------------------------------

//! Logique pour l'affichage des courbes Hum.

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

      //* Récupération du taux humidité.
      dataCourbeHumidite = response.data.tauxHumiditeCourbe;
      // console.log(
      //   'La réponse de la requête taux humidité : ',
      //   dataCourbeHumidite
      // );

      dataCourbeHumidite.forEach((item, index) =>
        valeurTauxHumidite.push({
          // x: item['createdAt'].split('.')[0].split('T')[0],
          x: item['valeurAxeX'],
          y: item['tauxHumidite'],
        })
      );

      // console.log(
      //   'Tableau des valeur taux humidité à afficher : ',
      //   valeurTauxHumidite
      // );

      //*---------------------------------------------

      //* Récupération de la consigne.

      consigneCourbeHumidite = response.data.tauxHumiditeCourbe;

      // console.log(
      //   'La réponse de la requête consigne hum : ',
      //   consigneCourbeHumidite
      // );

      consigneCourbeHumidite.forEach((item, index) =>
        valeurConsigneHumidite.push({
          // x: item['createdAt'].split('.')[0].split('T')[0],
          x: item['valeurAxeX'],
          y: item['consigne'],
        })
      );

      // console.log(
      //   'Tableau des valeurs consigne hum à afficher : ',
      //   valeurConsigneHumidite
      // );

      //*---------------------------------------------
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

//! Les variables.

let dataCourbeCo2;
let valeurTauxCo2 = [];

let consigneCourbeCo2;
let valeurConsigneCo2 = [];

//! --------------------------------------------------------------

//! Logique pour l'affichage des courbes Co2.

let getDataCourbeCo2 = () => {
  axios({
    url: 'http://localhost:3003/api/gestionCourbeRoutes/getTauxCo2Courbe/',
    method: 'get',
  })
    .then((response) => {
      // console.log(
      //   'La réponse de la requête taux humidité : ',
      //   response.data.tauxCo2Courbe
      // );

      //* Récupération Taux de Co2.

      dataCourbeCo2 = response.data.tauxCo2Courbe;
      // console.log(
      //   'La réponse de la requête taux humidité : ',
      //   dataCourbeCo2
      // );

      dataCourbeCo2.forEach((item, index) =>
        valeurTauxCo2.push({
          x: item['valeurAxeX'],
          y: item['tauxCo2'],
        })
      );

      // console.log(
      //   'Tableau des valeur taux Co2 à afficher : ',
      //   valeurTauxCo2
      // );

      //*---------------------------------------------

      //* Récupération de la consigne.

      consigneCourbeCo2 = response.data.tauxCo2Courbe;

      // console.log(
      //   'La réponse de la requête consigne Co2 : ',
      //   tauxCo2Courbe
      // );

      consigneCourbeCo2.forEach((item, index) =>
        valeurConsigneCo2.push({
          // x: item['createdAt'].split('.')[0].split('T')[0],
          x: item['valeurAxeX'],
          y: item['consigne'],
        })
      );

      // console.log(
      //   'Tableau des valeurs consigne Co2 à afficher : ',
      //   valeurConsigneCo2
      // );

      //*---------------------------------------------
    })

    .then(() => {
      // ! Logique pour les courbes.

      //! Le contexte graphique.
      const ctxCo2 = document.getElementById('myChartCo2').getContext('2d');
      //! ---------------------------------

      //!les labels.
      const myLabelsCo2 = [];
      //! ---------------------------------

      //! Les datas.
      const data = {
        labels: myLabelsCo2,

        datasets: [
          // Courbe taux Co2
          {
            label: 'Courbe Taux Co2',
            data: valeurTauxCo2,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            lineTension: 0.2,
            pointRadius: 0,
            // xAxisID: 'xAxis1',
          },

          // Courbe consigne Co2
          {
            label: 'Courbe Consigne Co2',
            data: valeurConsigneCo2,
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
      const optionsCo2 = {
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
      const configCo2 = {
        type: 'line',
        data,
        optionsCo2,
      };
      //! ---------------------------------

      //!L'instanciation de graphique.
      const myChartCo2 = new Chart(ctxCo2, configCo2);
      //! ---------------------------------

      //! --------------------------------------------------------------
    })
    .catch((error) => {
      console.log(error);
      console.log(JSON.stringify(error));
    });
};

getDataCourbeCo2();

//! --------------------------------------------------------------
//? III) ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ FIN GESTION COURBES Co2 ➖➖➖➖➖➖➖➖➖➖➖➖➖➖
