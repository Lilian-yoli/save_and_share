const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
const NODE_ENV = process.env;
const log = require("npmlog");

chai.use(chaiHttp);

const { expect } = chai;
const requester = chai.request(server).keepOpen();

const before = async () => {
  if (NODE_ENV === "test") {
    console.log({ NODE_ENV: NODE_ENV });
    log.info("TEST", "NODE_ENV is %j", NODE_ENV);
  }
  log.info("TEST", "NODE_ENV is %j", NODE_ENV);
};

before();

module.exports = {
  expect,
  requester,
};
