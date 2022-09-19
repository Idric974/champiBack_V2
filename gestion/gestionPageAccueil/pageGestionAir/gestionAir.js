const axios = require('axios');

//! Rafraichissement de la page.

setInterval(() => {
  window.location.reload();
}, 1800000);

let myDate = new Date();
let date = myDate.toLocaleString();

console.log('Page actualisée le : ' + date);

//! -------------------------------------------------

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

//! -------------------------------------------------



//! Récupération de la tempèrature Air dans la base.

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

      localStorage.setItem('gestionAir ==> Tempèrature Air:', temperatureAir);

      temperatureAirLocalStorage = localStorage.getItem(
        'gestionAir ==> Tempèrature Air:'
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

//! -------------------------------------------------

//! Récupération de la consigne Air dans la base.

//* température Air.

let consigneAir;
let consigneAirLocalStorage;
let objectifAir;
let pasAir;
let nbJourAir;
let nbHeureAir;
let getDernierConsigneAirEntree;
let getdernierPasAirEntree;
let getDernierObjectifAirEntree;

let getConsigneAir = () => {
  axios({
    url: 'http://localhost:3003/api/gestionAirRoutes/getDataAir/',
    method: 'get',
  })
    //
    //* Récupération des données.

    .then((response) => {
      //* Consigne Air.

      // console.log(response.data);

      consigneAir = response.data.datatemperatureAir.consigneAir;

      localStorage.setItem('gestionAir ==> Consigne :', consigneAir);

      consigneAirLocalStorage = localStorage.getItem(
        'gestionAir ==> Consigne :'
      );

      document.getElementById('consigneAir').innerHTML =
        consigneAirLocalStorage + '°C';

      //* -------------------------------------------------

      //* Affichage historique Consigne.

      getDernierConsigneAirEntree = localStorage.getItem(
        'gestionAir ==> Dernier consigne:'
      );

      document.getElementById('dernierConsigneAirEntree').innerHTML =
        getDernierConsigneAirEntree;

      //* -------------------------------------------------

      //* Affichage historique Pas.

      getdernierPasAirEntree = localStorage.getItem(
        'gestionAir ==> Dernier Pas:'
      );

      document.getElementById('dernierPasAirEntree').innerHTML =
        getdernierPasAirEntree;

      //* -------------------------------------------------

      //* Affichage historique Objecif.

      getDernierObjectifAirEntree = localStorage.getItem(
        'gestionAir ==> Dernier Objectif:'
      );

      document.getElementById('dernierObjectifAirEntree').innerHTML =
        getDernierObjectifAirEntree;

      //* -------------------------------------------------
    })

    //* -------------------------------------------------

    //* Durée de la descente Air.

    .then(() => {
      let CalculeNombreJour = () => {
        if (
          consigneAir == 0 ||
          consigneAir == '' ||
          consigneAir == null ||
          getDernierObjectifAirEntree == 0 ||
          getDernierObjectifAirEntree == '' ||
          getDernierObjectifAirEntree == null ||
          getdernierPasAirEntree == 0 ||
          getdernierPasAirEntree == '' ||
          getdernierPasAirEntree == null
        ) {
          //  console.log('Pas de paramètre pas de calcule des jours');

          return;
        } else {
          let dureeDescenteAir =
            ((consigneAir - getDernierObjectifAirEntree) /
              getdernierPasAirEntree) *
            12;

          // console.log('Durée Descente Air', dureeDescenteAir);

          let totalHeures = dureeDescenteAir;

          nbJourAir = Math.floor(totalHeures / 24);

          totalHeures %= 360;

          nbHeureAir = Math.floor(totalHeures / 36);

          // console.log(
          //   'La durée de la descente Air est de  : ' +
          //   nbJourAir +
          //   ' Jours ' +
          //   nbHeureAir +
          //   ' Heures '
          // );
        }

        localStorage.setItem('gestionAir ==> Nombre de jour:', nbJourAir);
        nbJourAirLocalStorage = localStorage.getItem('Valeure nbJour Air : ');

        let nombreDeJour = localStorage.getItem(
          'gestionAir ==> Nombre de jour:'
        );

        localStorage.setItem('gestionAir ==> Nombre de heure:', nbHeureAir);

        let nombreDeHeure = localStorage.getItem(
          'gestionAir ==> Nombre de heure:'
        );

        document.getElementById('descenteAir').innerHTML =
          nombreDeJour +
          ' ' +
          'Jours et' +
          ' ' +
          nombreDeHeure +
          ' ' +
          'Heures';
      };

      CalculeNombreJour();

      setInterval(() => {
        CalculeNombreJour();
      }, 120000);
    })

    //* -------------------------------------------------

    //* Stockage de la valeur delta.

    .then(() => {
      deltaAir = parseFloat(temperatureAir - consigneAir).toFixed(2);
      // console.log('delta Air Front', deltaAir);

      localStorage.setItem('Valeure delta Air : ', deltaAir);

      deltaAirLocalStorage = localStorage.getItem('Valeure delta Air : ');

      document.getElementById('deltaAir').innerHTML =
        deltaAirLocalStorage + '°C';
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

//! -------------------------------------------------

//! 3 Post consigne air dans la base.

document
  .getElementById('validationConsigneAir')
  .addEventListener('click', function () {
    //
    console.log('Clic sur bouton validation consigne air ');

    let consigneAirForm = document.getElementById('consigneAirForm').value;
    // console.log('consigneAirForm', consigneAirForm);

    localStorage.setItem('gestionAir ==> Dernier consigne:', consigneAirForm);

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

//! Post des datas air dans la base.

document
  .getElementById('validationdataAir')
  .addEventListener('click', function () {
    //
    // console.log('Clic sur bouton validation Etal Hum');

    //* Pas Air.

    let pasAirForm = document.getElementById('pasAirForm').value;
    // console.log('pasAirForm', pasAirForm);

    localStorage.setItem('gestionAir ==> Dernier Pas:', pasAirForm);

    //* -------------------------------------------------

    //* Objectif Air.

    let objectiAirForm = document.getElementById('objectiAirForm').value;

    localStorage.setItem('gestionAir ==> Dernier Objectif:', objectiAirForm);

    //* -------------------------------------------------

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

//! -------------------------------------------------

