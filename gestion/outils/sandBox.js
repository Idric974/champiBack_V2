//! Compter le nombre de jours entre le démarrage du cycle et aujourd'hui.
let test = '2022-03-28';
let dateDemarrageCycle = new Date(test);
let dateDuJour = new Date();
let difference = Math.abs(dateDuJour - dateDemarrageCycle);
let nombreDeJour = Math.round(difference / (1000 * 3600 * 24));

console.log('Nombre De Jour : ', nombreDeJour);
//! --------------------------------------------------
