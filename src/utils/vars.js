const path = require("path");
require("dotenv").config({ path: require("find-config")(".env") });
const ck = require("ckey");

console.log(process.env.REACT_APP_BE_ROOT_TEST);
let BE_ROOT =
  "http://3ds-flex-tutorial-be-env.eba-ivqy6wrb.us-west-2.elasticbeanstalk.com";
try {
  BE_ROOT = process.env.REACT_APP_BE_ENV = "TEST"
    ? process.env.REACT_APP_BE_ROOT_TEST
    : "http://3ds-flex-tutorial-be-env.eba-ivqy6wrb.us-west-2.elasticbeanstalk.com";
} catch {
  BE_ROOT =
    "http://3ds-flex-tutorial-be-env.eba-ivqy6wrb.us-west-2.elasticbeanstalk.com";
}
module.exports = {
  BE_ROOT,
};
