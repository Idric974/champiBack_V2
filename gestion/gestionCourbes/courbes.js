//! Les constantes.

const axios = require('axios');

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

//! Afficher la date du jour.

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

//! ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

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

      // console.log('Jour du cycle : ', jourDuCycleLocalStorage);

      document.getElementById('jourDuCycle').innerHTML =
        'Jour ' + jourDuCycleLocalStorage;
    })
    //* -------------------------*

    //* Date du jour.
    // .then(() => {
    //   dateDuJour = new Date();
    //   // console.log('Date du Jour : ', dateDuJour);
    //   document.getElementById('dateDuJourCycle').innerHTML = dateDuJour
    //     .toLocaleString('fr-FR', options)
    //     .toLocaleUpperCase();
    // })
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
      // console.log(
      //   'Date démarrage du cycle : ',
      //   response.data.dateDemarrageCycle.dateDemarrageCycle
      // );

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
        'Date démarrage cycle :' + dateDemarrageDuCycleStorage;
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

