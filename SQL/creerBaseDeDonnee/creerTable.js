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

  //! gestion Air.

  //* gestion_airs.

  // let sql =
  //   'CREATE TABLE gestion_airs (id int auto_increment, temperatureAir FLOAT, deltaAir FLOAT, days FLOAT, heures FLOAT, etatRelay FLOAT, actionRelay FLOAT,  consigne varchar(255), valeurAxeX varchar(255), jourDuCycle varchar(255), createdAt DATE, updatedAt DATE, primary key(id))';
  // db.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log('Table gestion_airs créé : ', result);
  // });

  //* -----------------------

  //* gestion_airs_datas.

  // let sql =
  //   'CREATE TABLE gestion_airs_datas (id int auto_increment, consigneAir FLOAT, pasAir FLOAT, objectifAir FLOAT, deltaAir FLOAT, days INTEGER, heures INTEGER, createdAt DATE, updatedAt DATE, primary key(id))';
  // db.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log('Table gestion_airs_datas créé : ', result);
  // });

  //* -----------------------

  //* gestion_airs_etalonnages.

  // let sql =
  //   'CREATE TABLE gestion_airs_etalonnages (id int auto_increment, etalonnageAir FLOAT, createdAt DATE, updatedAt DATE, primary key(id))';
  // db.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log('Table gestion_airs_etalonnages créé : ', result);
  // });

  //* -----------------------

  //* gestion_airs_etat_relays.

  // let sql =
  //   'CREATE TABLE gestion_airs_etat_relays (id int auto_increment, etatRelay FLOAT, createdAt DATE, updatedAt DATE, primary key(id))';
  // db.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log('Table gestion_airs_etat_relays créé : ', result);
  // });

  //* -----------------------

  //! Gestion Humidité.

  //* gestion_hums.

  // let sql =
  //   'CREATE TABLE gestion_hums (id int auto_increment, tauxHumidite FLOAT, deltaHum FLOAT, valeursMesureSec180 FLOAT, valeursMesureHum90 FLOAT, daysHum INTEGER, heuresHum INTEGER, createdAt DATE, consigne varchar(255), valeurAxeX varchar(255), jourDuCycle varchar(255), updatedAt DATE, primary key(id))';
  // db.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log('Table gestion_hums créé : ', result);
  // });

  //* -----------------------

  //* gestion_hums_datas.

  // let sql =
  //   'CREATE TABLE gestion_hums_datas (id int auto_increment, consigneHum FLOAT, pasHum FLOAT, objectifHum FLOAT, createdAt DATE, updatedAt DATE, primary key(id))';
  // db.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log('Table gestion_hums_datas créé : ', result);
  // });

  //* -----------------------

  //* gestion_hums_etalonnage_secs.

  // let sql =
  //   'CREATE TABLE gestion_hums_etalonnage_secs (id int auto_increment,  etalonnageSec FLOAT, createdAt DATE, updatedAt DATE, primary key(id))';
  // db.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log('Table gestion_airs_etalonnage créé : ', result);
  // });

  //* -----------------------

  //* gestion_hums_etalonnage_hums.

  // let sql =
  //   'CREATE TABLE gestion_hums_etalonnage_hums (id int auto_increment, etalonnageHum FLOAT, createdAt DATE, updatedAt DATE, primary key(id))';
  // db.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log('Table gestion_airs_etalonnage créé : ', result);
  // });

  //* -----------------------

  //! Gestion Co2.

  //* gestion_co2s.

  // let sql =
  //   'CREATE TABLE  gestion_co2s (id int auto_increment, tauxCo2 FLOAT, deltaCo2 FLOAT, daysCo2 FLOAT,  heuresCo2 FLOAT, consigne varchar(255), valeurAxeX varchar(255), jourDuCycle varchar(255), createdAt DATE, updatedAt DATE, primary key(id))';
  // db.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log('Table gestion_co2s créé : ', result);
  // });

  //* gestion_co2s_datas.

  // let sql =
  //   'CREATE TABLE  gestion_co2s_datas (id int auto_increment, consigneCo2 FLOAT, pasCo2 FLOAT, objectifCo2 FLOAT, createdAt DATE, updatedAt DATE, primary key(id))';
  // db.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log('Table gestion_co2s_datas créé : ', result);
  // });

  //* -----------------------

  //* Gestion des Logs.

  // let tableLog =
  //   'CREATE TABLE  gestion_logs (id int auto_increment,  fichier TEXT(255), nomModule TEXT(255), typeErreur TEXT(255), createdAt DATE, updatedAt DATE, primary key(id))';

  // db.query(tableLog, function (err, result) {
  //   if (err) throw err;
  //   console.log('Table gestion_logs créé : ', result);
  // });

  //* -----------------------

  //! Gestion des courbes.

  //* gestion_courbes.

  // let tableLog =
  //   'CREATE TABLE  gestion_courbes (id int auto_increment,  dateDemarrageCycle DATE, createdAt DATE, updatedAt DATE, primary key(id))';

  // db.query(tableLog, function (err, result) {
  //   if (err) throw err;
  //   console.log('Table gestion_courbes créé : ', result);
  // });

  //* -----------------------

  //! Gestion relay eau au sol.

  // let tableLog =
  //   'CREATE TABLE  relay_eau_au_sol (id int auto_increment,  etatRelayEauAuSol INTEGER, createdAt DATE, updatedAt DATE, primary key(id))';

  // db.query(tableLog, function (err, result) {
  //   if (err) throw err;
  //   console.log('Table elay_eau_au_sol créé : ', result);
  // });

  //* -----------------------

  //! Gestion de la température substrat.

  // let tableLog =
  //   'CREATE TABLE  gestion_substrats (id int auto_increment,  temperatureSubstrat FLOAT,  days FLOAT, heures FLOAT, etatRelay FLOAT, actionRelay FLOAT, valeurAxeX varchar(255), jourDuCycle varchar(255), createdAt DATE, updatedAt DATE, primary key(id))';

  // db.query(tableLog, function (err, result) {
  //   if (err) throw err;
  //   console.log('Table gestion_substrats créé : ', result);
  // });

  //* -----------------------

  //! Gestion de la température substrat.

  // let tableLog =
  //   'CREATE TABLE  gestion_substrats_datas (id int auto_increment, consigneMaxDataSubstrat FLOAT, consigneMinDataSubstrat FLOAT, createdAt DATE, updatedAt DATE, primary key(id))';

  // db.query(tableLog, function (err, result) {
  //   if (err) throw err;
  //   console.log('Table gestion_substrats_datas créé : ', result);
  // });

  //* -----------------------

    //! Bouton des contôle des vannes.

  // let tableLog =
  //   'CREATE TABLE  gestion_vannes (id int auto_increment, vanneActive TEXT, createdAt DATE, updatedAt DATE, primary key(id))';

  // db.query(tableLog, function (err, result) {
  //   if (err) throw err;
  //   console.log('Table gestion des vannes créé : ', result);
  // });

  //* -----------------------
});
