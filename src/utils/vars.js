const path = require("path");
require("dotenv").config({ path: require("find-config")(".env") });
const ck = require("ckey");

console.log(process.env.REACT_APP_BE_ROOT_TEST);
const BE_ROOT = (process.env.ENV = "TEST"
  ? process.env.REACT_APP_BE_ROOT_TEST
  : process.env.REACT_APP_BE_ROOT_PROD);
module.exports = {
  BE_ROOT,
};
