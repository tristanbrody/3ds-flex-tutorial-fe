const path = require("path");
require("dotenv").config({ path: require("find-config")(".env") });
const ck = require("ckey");

const BE_ROOT = process.env.REACT_APP_BE_ROOT;
module.exports = {
  BE_ROOT,
};
