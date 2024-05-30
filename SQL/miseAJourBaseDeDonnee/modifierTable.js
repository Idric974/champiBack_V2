const mysql = require('mysql');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'idric',
  password: 'Kup33uC4W6',
  database: 'champyresi',
});

db.connect(function (err) {
  if (err) throw err;
  //
  console.log('Connexion à la base de donnée réussie');

  //* gestion Air

  let sql = 'ALTER TABLE gestion_airs ADD jourDuCycle varchar(255)';
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log('Table gestion_airs Modifiée', result);
  });
});
