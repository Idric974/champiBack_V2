const axios = require('axios');

const url = 'http://192.168.1.11:3000/api/postSms/postSms';

let message = "Non pas d'ince ???";

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
