var mysql = require('mysql');

var con = mysql.createConnection({
  host: 'localhost',
  user: 'idric',
  password: 'Kup33uC4W6',
  database: 'champyresi',
});

//* Tables à supprimer

//! gestionAir.
//let table = 'gestion_airs';
// let table = 'gestion_airs_datas';
// let table = 'gestion_airs_etalonnages';
// let table = 'gestion_airs_etat_relay';
let table = 'gestion_vannes';


//! gestion Hummidité.
// let table = 'gestion_hums';
// let table = 'gestion_hums_datas';
// let table = 'gestion_hums_etalonnage_hums';
// let table = 'gestion_hums_etalonnage_secs';

//! gestion Co2
// let table = 'gestion_co2s';
// let table = 'gestion_co2s_datas';

//! gestion Substrat.
// let table = 'gestion_sub_etalonnages';

//! Gestion des Logs
// let table = 'gestion_logs';

//! Gestion substrat
//let table = 'gestion_substrats'

con.connect(function (err) {
  //
  if (err) throw err;

  //*➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖ gestion Co2 ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

  con.query('DROP TABLE' + ' ' + table, function (err, result) {
    if (err) throw err;
    console.log('Table :', table, result);
  });

  //* ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
});
