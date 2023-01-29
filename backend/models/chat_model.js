const { pgsqlPool } = require("./../pgsql_connection");
const log = require("npmlog");

const selectMessagesByRoom = async (room) => {
  try {
    console.log({ selectMessagesByRoom: room });
    const selectQuery = `SELECT sender_id, receiver_id, message, send_at FROM chat_info WHERE room = $1 ORDER BY send_at;`;
    const selectedResult = await pgsqlPool
      .query(selectQuery, [room])
      .then((result) => {
        console.log({ selectedResult: result.rows });
        return result.rows;
      });
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
      "INSERT INTO chat_info(sender_id, receiver_id, message, send_at, updated, room, status) VALUES($1, $2, $3, $4, $5, $6, $7)";
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
        return {
          command: result.command,
          rowCount: result.rowCount,
        };
      });
    console.log({ insertedResult: insertedResult });
    if (insertedResult.command == "INSERT" && insertedResult.rowCount == 1) {
      return { data: "Data inserted!" };
    } else {
      return { error: "Data insertion failed." };
    }
  } catch (error) {
    log.error("CHAT-MODEL", "Error message: %j", error);
  }
};

const selectChattedUser = async (userId) => {
  try {
    const selectedQuery = `With last_chat_by_room AS 
        (SELECT room, MAX(send_at) as last_chat_time 
        FROM chat_info WHERE sender_id = $1 OR receiver_id = $1 GROUP by room),
        chat_name_list AS
        (WITH user_info AS 
            (SELECT ci.sender_id, ci.receiver_id, ci.room, ci.send_at, m.username AS receiver_username
            FROM chat_info ci INNER JOIN members m ON ci.receiver_id = m.id)
        SELECT ui.sender_id, ui.receiver_id, ui.receiver_username, ui.room, ui.send_at, m.username AS sender_username 
        FROM user_info ui INNER JOIN members m ON ui.sender_id = m.id
        WHERE ui.sender_id = $1 OR receiver_id = $1)
    SELECT cnl.sender_id, cnl.receiver_id, cnl.receiver_username, cnl.sender_username
    FROM last_chat_by_room lcbr 
    LEFT JOIN chat_name_list cnl ON cnl.room = lcbr.room AND cnl.send_at = lcbr.last_chat_time 
    ORDER BY lcbr.last_chat_time;`;
    const selectedResult = await pgsqlPool
      .query(selectedQuery, [userId])
      .then((result) => {
        console.log({ selectedResult: result.rows });
        return result.rows;
      });
    return selectedResult;
  } catch (error) {
    log.error("CHAT-MODEL", "Error message: %j", error);
    throw error;
  }
};

const getRoomByUserIds = async (myUserId, theOtherUserId) => {
  try {
    const selectedQuery = `SELECT room FROM chat_info 
    WHERE (sender_id = $1 OR sender_id =$2) AND (receiver_id = $1 OR receiver_id =$2)
    GROUP BY room;`;
    const selectedResult = await pgsqlPool
      .query(selectedQuery, [myUserId, theOtherUserId])
      .then((result) => {
        console.log({ selectedResult: result.rows });
        return result.rows;
      });
    return selectedResult;
  } catch (error) {
    log.error("CHAT-MODEL", "Error message: %j", error);
    throw error;
  }
};

module.exports = {
  selectMessagesByRoom,
  saveChatMsgToDB,
  selectChattedUser,
  getRoomByUserIds,
};
