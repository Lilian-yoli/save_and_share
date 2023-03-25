const { expect } = require("../set_up");
const { timestampToDate } = require("../../utils");

describe("FN - timestampToDate", () => {
  it("timestamp input should return correct format YYYY-MM-DD", () => {
    const timestampForTest = new Date("2023-12-30T16:00:00.000Z");
    const dateFormat = timestampToDate(timestampForTest);
    expect(dateFormat).to.equal("2023-12-30");
  });

  it("undefined input should throw error", () => {
    expect(() => timestampToDate(undefined)).to.throw(
      Error,
      "Something went wrong in fn timestampToDate"
    );
  });

  it("wrong data type input should throw error", () => {
    expect(() => timestampToDate("2023-12-30T16:00:00.000Z")).to.throw(
      Error,
      "Something went wrong in fn timestampToDate"
    );
  });

  it("empty input should throw error", () => {
    expect(() => timestampToDate()).to.throw(
      Error,
      "Something went wrong in fn timestampToDate"
    );
  });
});
