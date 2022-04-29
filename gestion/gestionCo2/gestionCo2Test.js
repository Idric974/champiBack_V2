const axios = require('axios');

axios({
  method: 'post',
  url: `http://localhost:5000/api/getCo2Routes/getCo2`,
  //   url: `http://192.168.0.10:6000/getCO2/2`,
  withCredentials: true,
  data: {
    numSalle: '2',
  },
})
  .then((res) => {
    console.log('resultat :', res.data);
  })
  .catch((err) => {
    console.log(err);
  });
