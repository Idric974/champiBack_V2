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
let getDernierConsigneCo2Entree;
let getDernierPasCo2Entree;
let getDernierObjectifCo2Entree

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

      //* Affichage historique Consigne.

      getDernierConsigneCo2Entree = localStorage.getItem('gestionCo2 ==> Dernier consigne:');

      document.getElementById('dernierConsigneCo2Entree').innerHTML =
        getDernierConsigneCo2Entree;

      //* -------------------------------------------------

      //* Affichage historique Pas.

      getDernierPasCo2Entree = localStorage.getItem('gestionCo2 ==> Dernier Pas:');

      document.getElementById('dernierPasCo2Entree').innerHTML =
        getDernierPasCo2Entree;

      //* -------------------------------------------------

      //* Affichage historique Objectif.

      getDernierObjectifCo2Entree = localStorage.getItem('gestionCo2 ==> Dernier Objectif:');

      document.getElementById('dernierObjectifCo2Entree').innerHTML =
        getDernierObjectifCo2Entree;

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
          getDernierObjectifCo2Entree == 0 ||
          getDernierObjectifCo2Entree == '' ||
          getDernierObjectifCo2Entree == null ||
          getDernierPasCo2Entree == 0 ||
          getDernierPasCo2Entree == '' ||
          getDernierPasCo2Entree == null
        ) {
          // console.log('Pas de paramètre pas de calcule des jours Hum');

          return;
        } else {
          let dureeDescenteCo2 = ((consigneCo2 - getDernierObjectifCo2Entree) / getDernierPasCo2Entree) * 12;

          console.log('Durée Descente Co2', dureeDescenteCo2);

          let totalHeures = dureeDescenteCo2;

          nbJourCo2 = Math.floor(totalHeures / 24);

          totalHeures %= 360;

          nbHeureCo2 = Math.floor(totalHeures / 36);

          // console.log(
          //   'La durée de la descente Air est de  : ' +
          //   nbJourAir +
          //   ' Jours ' +
          //   nbHeureAir +
          //   ' Heures '
          // );
        }

        localStorage.setItem('gestionCo2 ==> Nombre de jour:', nbJourCo2);
        nbJourCo2 = localStorage.getItem('gestionCo2 ==> Nombre de jour:');

        let nombreDeJour = localStorage.getItem('gestionCo2 ==> Nombre de jour:');


        localStorage.setItem('gestionCo2 ==> Nombre de heure:', nbHeureCo2);

        let nombreDeHeure = localStorage.getItem('gestionCo2 ==> Nombre de heure:');

        document.getElementById('descenteCo2').innerHTML =
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

    localStorage.setItem('gestionCo2 ==> Dernier consigne:', consigneCo2Form);

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
    localStorage.setItem('gestionCo2 ==> Dernier Pas:', pasCo2Form);

    let objectifCo2Form = document.getElementById('objectifCo2Form').value;
    // console.log('objectiCo2Form', objectiCo2Form);
    localStorage.setItem('gestionCo2 ==> Dernier Objectif:', objectifCo2Form);


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
