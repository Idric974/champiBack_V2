const axios = require('axios');

let test = () => {
  axios({
    method: 'post',
    url: 'http://192.168.0.10:6000/test',
    // data: { test: 'Message d erreur', salle: '2', motif: 'Trop de froid' },
  })
    .then(function (reponse) {
      console.log(reponse.data);
    })
    .catch(function (erreur) {
      console.log(erreur);
    });
};

test();
