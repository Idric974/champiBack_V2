const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'idric',
  password: 'Kup33uC4W6',
  database: 'champyresi',
});

let user = 'gill';

con.connect(function (err) {
  if (err) throw err;
  console.log('Connecté à la base de données MySQL!');

  con.query('DROP USER' + ' ' + user + '@localhost', function (err, result) {
    if (err) throw err;
    console.log("=========> l'utilisateur", user, 'a été supprimé', result);
  });
});
