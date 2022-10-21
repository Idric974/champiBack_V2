const axios = require('axios');

const url = 'http://192.168.1.4:4000/api/getSms/getSms';
let smsList;

axios
  .get(url)
  .then(function (response) {
    smsList = response.data;
    console.log('List des SMS808 : ', smsList);
  })
  .catch(function (error) {
    console.log(error);
  });
