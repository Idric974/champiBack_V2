const dotenv = require("dotenv");
dotenv.config();

let status = process.env.CHAMPIBACK_STATUS;
console.log("status ==> ", status);