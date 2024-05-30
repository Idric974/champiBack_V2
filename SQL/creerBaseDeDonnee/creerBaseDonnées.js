// Créer une base de données MySQL.

const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'idric',
  password: 'Kup33uC4W6',
});

db.connect(function (err) {
  if (err) throw err;
  console.log('Connecté à la base de données MySQL!');
  db.query('CREATE DATABASE test_creation_base', function (err, result) {
    if (err) throw err;
    console.log('Base de données créée !', result);
  });
});

// Procédure 1

// CREATE USER 'idric'@'localhost' IDENTIFIED BY 'Kup33uC4W6';

// CREATE DATABASE 'champyresi';

// GRANT ALL ON idric.\* TO 'idric'@'%' IDENTIFIED BY 'Kup33uC4W6' WITH GRANT OPTION;

// Procédure 2

// mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
// mysql> FLUSH PRIVILEGES;
// mysql> quit
