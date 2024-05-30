const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'idric',
  password: 'Kup33uC4W6',
});

let userName = 'gil';

db.connect(function (err) {
  if (err) throw err;
  //
  console.log('Connexion à la base de donnée réussie');

  // Création de l'utilisateur
  let user = 'CREATE USER' + ' ' + userName + '@localhost IDENTIFIED BY ""';

  db.query(user, function (err, result) {
    if (err) throw err;
    console.log("L'utilisateur", userName, 'a été créé', result);
  });

  // --------------------------
});
