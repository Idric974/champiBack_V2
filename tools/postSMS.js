const axios = require('axios');

//! Url de la master.
const url = 'http://192.168.1.6:4000/api/postSms/postSms';

let date = new Date();
let message = `Salut c'est bon, l'application post et reçoit les messages : ${date}`;

axios
  .post(url, {
    message,
  })
  .then(function (response) {
    console.log('Reponse de SMS808 : ', response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

