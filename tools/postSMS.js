const axios = require('axios');

const url = 'http://192.168.1.9:4000/api/postSms/postSms';

let message = "Message test du 05/08/2022 ==> 11h54";

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

