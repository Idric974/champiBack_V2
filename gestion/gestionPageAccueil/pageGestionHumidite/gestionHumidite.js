//! Gestion Humidité.

const axios = require('axios');

//! Rafraichissement de la page.

setInterval(() => {
  window.location.reload();
}, 30000);

let myDate = new Date();
let date = myDate.toLocaleString();

console.log('Page actualisée le : ' + date);

//! -------------------------------------------------

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

      //* Taux humidité.

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
let getDernierConsigneHumEntree;
let getDernierPasHumEntree;
let getDernierObjectifHumEntree

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

      //* -------------------------------------------------

      //* Affichage historique Consigne.

      getDernierConsigneHumEntree = localStorage.getItem('gestionHum ==> Dernier consigne:');

      document.getElementById('dernierConsigneHumEntree').innerHTML =
        getDernierConsigneHumEntree;

      //* -------------------------------------------------

      //* Affichage historique Pas.

      getDernierPasHumEntree = localStorage.getItem('gestionHum ==> Dernier Pas:');

      document.getElementById('dernierConsignePasEntree').innerHTML =
        getDernierPasHumEntree;

      //* -------------------------------------------------

      //* Affichage historique Objectif.

      getDernierObjectifHumEntree = localStorage.getItem('gestionHum ==> Dernier Objectif:');

      document.getElementById('dernierConsigneObjectifEntree').innerHTML =
        getDernierObjectifHumEntree;

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
          getDernierObjectifHumEntree == 0 ||
          getDernierObjectifHumEntree == '' ||
          getDernierObjectifHumEntree == null ||
          getDernierPasHumEntree == 0 ||
          getDernierPasHumEntree == '' ||
          getDernierPasHumEntree == null
        ) {
          //console.log('Pas de paramètre pas de calcule des jours');

          return;
        } else {
          let dureeDescenteAir = ((consigneHum - getDernierObjectifHumEntree) / getDernierPasHumEntree) * 12;

          //  console.log('Durée Descente Air', dureeDescenteAir);

          let totalHeures = dureeDescenteAir;

          nbJourHum = Math.floor(totalHeures / 24);

          totalHeures %= 360;

          nbHeureHum = Math.floor(totalHeures / 36);

          // console.log(
          //   'La durée de la descente Air est de  : ' +
          //   nbJourAir +
          //   ' Jours ' +
          //   nbHeureAir +
          //   ' Heures '
          // );
        }

        localStorage.setItem('gestionHum ==> Nombre de jour:', nbJourHum);
        nbJourHum = localStorage.getItem('Valeure nbJour Air : ');

        let nombreDeJour = localStorage.getItem('gestionHum ==> Nombre de jour:');


        localStorage.setItem('gestionHum ==> Nombre de heure:', nbHeureHum);


        let nombreDeHeure = localStorage.getItem('gestionHum ==> Nombre de heure:');

        document.getElementById('descenteHum').innerHTML =
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

    localStorage.setItem('gestionHum ==> Dernier Pas:', pasHumForm);

    let objectifHumForm = document.getElementById('objectifHumForm').value;
    // console.log('objectiHumForm', objectiHumForm);

    localStorage.setItem('gestionHum ==> Dernier Objectif:', objectifHumForm);

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
