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

const saveChatMsgToDB = async ({
  sender_id,
  receiver_id,
  message,
  room,
  send_at,
}) => {
  try {
    const insertedQuery =
      "INSERT INTO chat_info(receiver_id, sender_id, message, send_at, updated, room, status) VALUES($1, $2, $3, $4, $5, $6, $7)";
    const insertedResult = await pgsqlPool
      .query(insertedQuery, [
        sender_id,
        receiver_id,
        message,
        send_at,
        send_at,
        room,
        "active",
      ])
      .then((result) => {
        console.log({ insertedResult: result.rowCount });
        return result.rowCount;
      });
    return { data: "OK" };
  } catch (error) {
    log.error("CHAT-MODEL", "Error message: %j", error);
    throw error;
  }
};

module.exports = {
  selectMessagesByRoom,
};
