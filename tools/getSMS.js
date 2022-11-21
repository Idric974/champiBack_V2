const axios = require('axios');

const url = 'http://192.168.1.4:4000/api/getSms/getSms';

let numSalle;

//! Les promesses.

//? Récupération du numéro de la salle.

let recupérationNumeroSalle = () => {

  return new Promise((resolve, reject) => {

    axios
      .get(url)
      .then(function (response) {

        numSalle = response.data;

        console.log('Numéro de la salle de destination : ', numSalle);

        resolve();

      })
      .catch(function (error) {
        console.log("ERROR : Récupération du numéro de la salle :", error);
        reject();
      });

  });
}

//? ------------------------------------------------- 

//? Interrogation de la base de données.

const mysql = require('mysql');

let interrogationBaseDonnées = () => {
  return new Promise((resolve, reject) => {
    try {

      const con = mysql.createConnection({
        host: 'localhost',
        user: 'idric',
        password: 'Kup33uC4W6',
        database: 'champyresi',
      });

      let table = 'gestion_airs';

      con.connect(function (err) {
        if (err) throw err;
        console.log('Connecté à la base de données MySQL!');
        //
        con.query(
          'SELECT * FROM ' + table + ' WHERE id=(SELECT max(id) FROM ' + table + ')',
          function (err, result) {

            if (err) {

              reject();
              throw err;

            } else {

              console.log(result);
              resolve();

            }

          }
        );
      });

    } catch (error) {
      console.log("ERROR : Interrogation de la base de données :", error);
    }
  });
}

//? ------------------------------------------------- 

//! -------------------------------------------------   

//! Exécution des promesses. 

let handleMyPromise = async (e) => {
  e.preventDefault();
  try {
    await recupérationNumeroSalle();
    await interrogationBaseDonnées();
  }
  catch (err) {
    console.log('err :', err);
  }
};

handleMyPromise();

    //! -------------------------------------------------  