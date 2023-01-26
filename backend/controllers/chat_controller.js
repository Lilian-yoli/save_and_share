const { selectMessagesByRoom } = require("../models/chat_model");
const { selectUserById } = require("../user/model");
const log = require("npmlog");

const chatRecordsFlow = async (req, res) => {
  const { theOtherUserId, room } = req.query;
  console.log({ room: room });
  const otherUserIdFromDb = await selectUserById(theOtherUserId);
  if (otherUserIdFromDb.length !== 1) {
    return res.status(422).send({ error: "No accessibility." });
  }
  const roomFormatChecker = checkRoomFormat(room);
  if (roomFormatChecker.error) {
    return res.status(422).send(roomFormatChecker);
  }
  const myUserId = req.user.id;
  const verifiedRoomIdObject = checkRoomAccess(room, myUserId, theOtherUserId);
  console.log({ verifiedRoomIdObject: verifiedRoomIdObject });
  if (verifiedRoomIdObject.error) {
    return res
      .status(422)
      .send({ error: "Something went wrong when getting chat records." });
  }
  const verifiedRoomId = verifiedRoomIdObject.room;
  const chatRecords = await selectMessagesByRoom(verifiedRoomId);
  const respondedChatInfo = {
    other_user_id: parseInt(theOtherUserId),
    my_user_id: myUserId,
    chat_records: chatRecords,
  };
  return res.status(200).send({ data: respondedChatInfo });
};

const checkRoomFormat = (room) => {
  const roomRegexFormat = /\d*[A][N][D]\d*/;
  const foundRoom = room.match(roomRegexFormat);
  if (foundRoom[0] == room) return room;
  else return { error: "No accessibility." };
};

const checkRoomAccess = (room, myUserId, theOtherUserId) => {
  try {
    if (!room) {
      return { roomId: generateChatRoom(myUserId, theOtherUserId) };
    } else {
      const roomUsers = room.split("AND");
      const qualifiedUserIdFromRoom = roomUsers.filter(
        (id) => parseInt(id) == myUserId || parseInt(id) == theOtherUserId
      );
      if (qualifiedUserIdFromRoom.length === 2) {
        return { roomId: room };
      } else {
        return { error: "No accessibility." };
      }
    }
  } catch (error) {
    log.error("CHAT-CONTROLLER", "Error message: %j", error);
    return { error: "Something went wrong when checking accessibility." };
  }
};

const generateChatRoom = (senderId, receiverId) => {
  if (senderId > receiverId) {
    return receiverId + "AND" + senderId;
  } else {
    return senderId + "AND" + receiverId;
  }
};

// const getChatUserListFlow = (req, res) => {
//   const myUserId = req.user.id
//   const
// }

module.exports = {
  chatRecordsFlow,
};
