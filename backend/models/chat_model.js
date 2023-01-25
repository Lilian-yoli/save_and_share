const { pgsqlPool } = require("./../pgsql_connection");
const log = require("npmlog");

const selectMessagesByRoom = async (room) => {
  try {
    const selectQuery =
      "SELECT sender_id, receiver_id, message, send_at FROM chat_info WHERE room = $1;";
    const selectedResult = await pgsqlPool
      .query(selectQuery, [room])
      .then((result) => {
        console.log({ selectedResult: result.rows });
        return result.rows;
      })
      .catch((e) => log.error("CHAT-MODEL", "Error message: %j", e.stack));
    return selectedResult;
  } catch (error) {
    log.error("CHAT-MODEL", "Error message: %j", error);
    throw error;
  }
};

module.exports = {
  selectMessagesByRoom,
};
