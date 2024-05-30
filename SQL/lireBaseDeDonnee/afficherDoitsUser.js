const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'idric',
  password: 'Kup33uC4W6',
  database: 'champyresi',
});

let userName = 'idric';

con.connect(function (err) {
  if (err) throw err;
  console.log('Connecté à la base de données MySQL!');

  con.query(
    'show grants for' + ' ' + userName + '@localhost',
    function (err, result) {
      if (err) throw err;
      console.log('Liste des utilisateur : s', result);
    }
  );
});
