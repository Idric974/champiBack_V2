const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'idric',
  password: 'Kup33uC4W6',
  database: 'champyresi',
});

con.connect(function (err) {
  if (err) throw err;
  console.log('Connecté à la base de données MySQL!');

  con.query('show databases', function (err, result) {
    if (err) throw err;
    console.log('Liste des bases de données : ', result);
  });
});
