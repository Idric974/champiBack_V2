//! Solution 1.

const axios = require('axios');

axios({
  method: 'post',
  url: `http://192.168.0.10:5000/api/getCo2Routes/getCo2`,
  withCredentials: true,
  data: {
    numSalle: '1',
  },
})
  .then((res) => {
    console.log('resultat :', res.data);
  })
  .catch((err) => {
    console.log(err);
  });

//! -------------------------------------------------

//! Solution 2.

// const http = require('http');

// const data = JSON.stringify({
//   numSalle: 1,
// });

// const options = {
//   hostname: '192.168.0.10',
//   port: 5000,
//   path: '/api/getCo2Routes/getCo2',
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Content-Length': data.length,
//   },
// };

// const req = http.request(options, (res) => {
//   console.log(`statusCode : ${res.statusCode}`);

//   res.on('data', (d) => {
//     process.stdout.write(d);
//   });
// });

// req.on('error', (error) => {
//   console.error(error);
// });

// req.write(data);
// req.end();

//! -------------------------------------------------
