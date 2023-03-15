const chai = require("chai");
const chaiHttp = require("chaihttp");
const server = require("../../index");
const NODE_ENV = process.env;
const log = require("npmlog");

chai.use(chaiHttp);

const { assert } = chai;
const requester = chai.request(server).keepOpen();

const before = async () => {
  if (NODE_ENV === "test") {
    log.info("TEST", "NODE_ENV is %j", NODE_ENV);
  }
  log.info("TEST", "NODE_ENV is %j", NODE_ENV);
};

before();

module.exports = {
  assert,
  requester,
};
