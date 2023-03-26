const {
  expect,
  requester,
  truncateAllTables,
  truncateTable,
  getAllTables,
} = require("../set_up");
const { TOKEN_EXPIRED } = process.env;

const tokenExpiredTime = TOKEN_EXPIRED;
const normalUser = {
  email: "test@test.com",
  username: "test user",
  password: "testing",
  verified_password: "testing",
};

const formatErrorUser = {
  email: "test",
  username: "test user",
  password: "testing",
  verified_password: "testing",
};

const unverifiedPasswordUser = {
  email: "test",
  username: "test user",
  password: "testing",
  verified_password: "",
};

describe("Sign up", () => {
  before(async () => {
    console.log({ before_fn: "Before" });
    await truncateAllTables(getAllTables, truncateTable);
  });
  it("normal user", async () => {
    const response = await requester
      .post("/api/1.0/user/signup")
      .send(normalUser);
    const responseData = response.body.data;
    const expectedUser = {
      id: responseData.user.id,
      provider: "native",
      username: normalUser.username,
      email: normalUser.email,
    };
    expect(responseData.user).to.deep.equal(expectedUser);
    expect(responseData.access_token).to.be.a("string");
    expect(responseData.token_expired).to.equal(tokenExpiredTime);
  });

  it("Email already registered", async () => {
    const response = await requester
      .post("/api/1.0/user/signup")
      .send(normalUser);
    const responseData = response.body;
    expect(responseData).to.deep.equal({ error: "Duplicated Email." });
  });

  it("Format error user", async () => {
    const response = await requester
      .post("/api/1.0/user/signup")
      .send(formatErrorUser);
    const responseData = response.body;
    expect(responseData).to.deep.equal({
      error: { errorMsg: "Format error for sign up info." },
    });
  });

  it("password not equal to verified_password", async () => {
    const response = await requester
      .post("/api/1.0/user/signup")
      .send(unverifiedPasswordUser);
    const responseData = response.body;
    expect(responseData).to.deep.equal({
      error: { errorMsg: "Format error for sign up info." },
    });
  });

  it("password not equal to verified_password", async () => {
    const response = await requester
      .post("/api/1.0/user/signup")
      .send(unverifiedPasswordUser);
    const responseData = response.body;
    expect(responseData).to.deep.equal({
      error: { errorMsg: "Format error for sign up info." },
    });
  });
});
