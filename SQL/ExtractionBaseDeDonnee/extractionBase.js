const mysql = require('mysql');
const fs = require('fs');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'idric',
    password: 'Kup33uC4W6',
    database: 'champyresi',
});

//! Champs à modifier.

//* Table à interroger
const table = 'gestion_airs';

//* Attribut de classement
const rangePar = 'id';

//* Nombre de résultat désiré
const limite = 100;

//! -------------------------------------------------

con.connect(function (err) {
    if (err) throw err;
    console.log('Connecté à la base de données MySQL!');
    //

    //* gestion Air

    con.query(`SELECT * FROM ${table}
               ORDER BY ${rangePar} DESC
               LIMIT ${limite}`
        ,
        function (err, result) {
            if (err) throw err;
            console.table(result);
        }
    );
});
