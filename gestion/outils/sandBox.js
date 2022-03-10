const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'idric',
  password: 'Kup33uC4W6',
  database: 'champyresi',
});

let table = 'gestion_hums';
let dateDebut = '2022-02-01';
let dateFin = '2022-02-28';

//* ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
con.connect(function (err) {
  if (err) throw err;
  console.log('Connecté à la base de données MySQL!');

  con.query(
    'SELECT * FROM ' +
      table +
      ' ' +
      'WHERE DATE(createdAt)  BETWEEN 2022-02-01 AND  2022-02-28 ORDER BY createdAt ASC',

    function (err, result) {
      if (err) throw err;
      console.log(result);
    }
  );
});
//* ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
