const cron = require("node-cron");
const { updateDailyShareTimesTo0 } = require("../models/share_model");
const log = require("npmlog");

const resetSharedTimesJob = () => {
  log.info("Cron-Job", "resetSharedTimesJob is registered.");
  return cron.schedule("0 0 * * *", async () => {
    console.log("Cron job starts..." + new Date());
    const numbersOfDailyUpdate = await updateDailyShareTimesTo0();
    log.info(
      "resetSharedTimesJob",
      "There are %j members been updated.",
      numbersOfDailyUpdate
    );
  });
};

module.exports = {
  resetSharedTimesJob,
};
