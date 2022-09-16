//! Gestion Co2.

const axios = require('axios');

//? 1 Récupération du taux de Co2 dans la base.

//* Taux de Co2.

let tauxCo2;
let tauxCo2LocalStorage;

//* Consigne Air.

let deltaCo2;
let deltaCo2LocalStorage;

let getTauxCo2 = () => {
  axios({
    url: 'http://localhost:3003/api/gestionCo2Routes/getTauxC2o/',
    method: 'get',
  })
    .then((response) => {
      // console.log(response.data);

      //* Taux Co2.

      tauxCo2 = response.data.tauxCo2.tauxCo2;

      localStorage.setItem('Valeure taux Co2 : ', tauxCo2);

      tauxCo2LocalStorage = localStorage.getItem('Valeure taux Co2 : ');

      document.getElementById('tauxCo2').innerHTML =
        tauxCo2LocalStorage + ' ppm';

      // -------------------------------------
    })
    .catch((error) => {
      console.log(error);
      console.log(JSON.stringify(error));
    });
};

getTauxCo2();

setInterval(() => {
  getTauxCo2();
  // console.log('récup tempAir');
}, 10000);

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? 2 Récupération de la consigne Co2 dans la base.

let consigneCo2;
let consigneCo2LocalStorage;
let pasCo2;
let pasCo2LocalStorage;
let objectifCo2;
let objectifCo2LocalStorage;
let heureCo2;
let nbJourCo2;
let nbJourCo2LocalStorage;
let nbHeureCo2;
let nbHeureCo2LocalStorage;

let getConsigneCo2 = () => {
  axios({
    url: 'http://localhost:3003/api/gestionCo2Routes/getDataCo2/',
    method: 'get',
  })
    //
    //* Récupération des données.

    .then((response) => {
      // console.log(response.data);

      //* Consigne Co2.

      consigneCo2 = response.data.dataTauxCo2.consigneCo2;

      localStorage.setItem('Valeure consigne Co2 : ', consigneCo2);

      consigneCo2LocalStorage = localStorage.getItem('Valeure consigne Co2 : ');

      document.getElementById('consigneCo2').innerHTML =
        consigneCo2LocalStorage + ' ppm';

      //* -------------------------------------------------

      //* Dernier consigne Co2.

      let dernierConsigneCo2Entree = localStorage.getItem('gestionCo2 ==> Dernier consigne :');

      document.getElementById('dernierConsigneCo2Entree').innerHTML =
        dernierConsigneCo2Entree;

      //* -------------------------------------------------

      //* Pas Co2.

      pasCo2 = response.data.dataTauxCo2.pasCo2;

      localStorage.setItem('Valeure Pas Co2 : ', pasCo2);

      pasCo2LocalStorage = localStorage.getItem('Valeure Pas Co2 : ');

      if (pasCo2LocalStorage !== null && pasCo2LocalStorage !== ' ') {
        document.getElementById('pasCo2Id').innerHTML = "-";

        console.log('pasAirLocalStorage === undefined');
      } else {

        document.getElementById('pasCo2Id').innerHTML =
          pasCo2LocalStorage;

      }

      //* -------------------------------------------------

      //* Objectif Co2.

      objectifCo2 = response.data.dataTauxCo2.objectifCo2;

      localStorage.setItem('Valeure objectif Co2 : ', objectifCo2);

      objectifCo2LocalStorage = localStorage.getItem('Valeure objectif Co2 : ');

      if (objectifCo2LocalStorage !== null && objectifCo2LocalStorage !== ' ') {

        document.getElementById('objectiCo2Id').innerHTML = "-";

      } else {

        document.getElementById('objectiCo2Id').innerHTML =
          objectifCo2LocalStorage;
      }

      //* -------------------------------------------------
    })

    //* -------------------------------------------------

    //* Durée de la descente Air.

    .then(() => {
      let CalculeNombreJour = () => {
        if (
          consigneCo2 == 0 ||
          consigneCo2 == '' ||
          consigneCo2 == null ||
          objectifCo2 == 0 ||
          objectifCo2 == '' ||
          objectifCo2 == null ||
          pasCo2 == 0 ||
          pasCo2 == '' ||
          pasCo2 == null
        ) {
          // console.log('Pas de paramètre pas de calcule des jours');
          return;
        } else {
          let dureeDescenteCo2 = ((consigneCo2 - objectifCo2) / pasCo2) * 12;

          // console.log('Durée Descente Co2', dureeDescenteCo2);

          let totalHeures = dureeDescenteCo2;

          nbJourCo2 = Math.floor(totalHeures / 24);

          totalHeures %= 360;

          nbHeureCo2 = Math.floor(totalHeures / 36);

          // console.log(
          //   'La durée de la descente Co2 est de  : ' +
          //     nbJourCo2 +
          //     ' Jours ' +
          //     nbHeureCo2 +
          //     ' Heures '
          // );
        }

        localStorage.setItem('Valeure nbJour Co2 : ', nbJourCo2);
        nbJourCo2LocalStorage = localStorage.getItem('Valeure nbJour Co2 : ');

        localStorage.setItem('Valeure nbHeure Co2 : ', nbHeureCo2);
        nbHeureCo2LocalStorage = localStorage.getItem('Valeure nbHeure Co2 : ');

        document.getElementById('descenteCo2').innerHTML =
          nbJourCo2LocalStorage +
          ' ' +
          'Jours et' +
          ' ' +
          nbHeureCo2LocalStorage +
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
      deltaCo2 = parseFloat(tauxCo2 - consigneCo2).toFixed(2);
      // console.log('delta Air Front', deltaco2);

      localStorage.setItem('Valeure delta Co2 : ', deltaCo2);

      deltaCo2LocalStorage = localStorage.getItem('Valeure delta Co2 : ');

      document.getElementById('deltaCo2').innerHTML =
        deltaCo2LocalStorage + ' ppm';
    })

    .catch((error) => {
      console.log(error);
      console.log(JSON.stringify(error));
    });
};

getConsigneCo2();

setInterval(() => {
  getConsigneCo2();
  // console.log('récup consigneAir');
}, 15000);

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? 3 Post consigne Co2 dans la base.

document
  .getElementById('validationConsigneCo2')
  .addEventListener('click', function () {
    //

    // console.log('Clic sur bouton validation Etal Co2');

    let consigneCo2Form = document.getElementById('consigneCo2Form').value;
    console.log('consigneCo2Form', consigneCo2Form);

    localStorage.setItem('gestionCo2 ==> Dernier consigne :', consigneCo2Form);

    const boutonValiderEtatco2 = axios
      .post('http://localhost:3003/api/gestionCo2Routes/postConsigneCo2/', {
        consigneCo2: consigneCo2Form,
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? 4 Post des datas Co2 dans la base.

document
  .getElementById('validationdataCo2')
  .addEventListener('click', function () {
    //

    // console.log('Clic sur bouton validation Etal Co2');

    let pasCo2Form = document.getElementById('pasCo2Form').value;
    // console.log('pasCo2Form', pasCo2Form);

    let objectifCo2Form = document.getElementById('objectifCo2Form').value;
    // console.log('objectiCo2Form', objectiCo2Form);


    const boutonValiderEtalCo2 = axios
      .post('http://localhost:3003/api/gestionCo2Routes/postDataCo2/', {
        pasCo2: pasCo2Form,
        objectifCo2: objectifCo2Form,
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
