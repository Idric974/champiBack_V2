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

  // Création des privilges
  let priviles =
    'GRANT ALL PRIVILEGES ON *.* TO' + ' ' + userName + '@localhost';

  db.query(priviles, function (err, result) {
    if (err) throw err;
    console.log('Les privilèges ontété ajoutés', result);
  });

  // --------------------------
});
