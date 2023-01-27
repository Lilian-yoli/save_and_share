const {
  selectMessagesByRoom,
  selectChattedUser,
  getRoomByUserIds,
} = require("../models/chat_model");
const { selectUserById } = require("../user/model");

const chatRecordsFlow = async (req, res) => {
  const { theOtherUserId } = req.query;
  const otherUserIdFromDb = await selectUserById(theOtherUserId);
  const myUserId = req.user.id;
  const roomFromDb = await getRoomByUserIds(myUserId, theOtherUserId);
  if (otherUserIdFromDb.length !== 1 || theOtherUserId == myUserId) {
    return res.status(422).send({ error: "No accessibility." });
  }
  const verifiedRoom = checkRoomAccess(roomFromDb, myUserId, theOtherUserId);
  console.log({ verifiedRoom: verifiedRoom });

  const chatRecords = await selectMessagesByRoom(verifiedRoom);
  const respondedChatInfo = {
    other_user_id: parseInt(theOtherUserId),
    my_user_id: myUserId,
    chat_records: chatRecords,
  };
  return res.status(200).send({ data: respondedChatInfo });
};

const checkRoomAccess = (room, myUserId, theOtherUserId) => {
  if (room.length !== 1) return generateChatRoom(myUserId, theOtherUserId);
  else return room[0].room;
};

const generateChatRoom = (senderId, receiverId) => {
  if (senderId > receiverId) {
    return receiverId + "AND" + senderId;
  } else {
    return senderId + "AND" + receiverId;
  }
};

const getChatUserListFlow = async (req, res) => {
  const myUserId = req.user.id;
  const chattedUsers = await selectChattedUser(myUserId);
  res.status(200).send({ data: { chatted_users: chattedUsers } });
};

module.exports = {
  chatRecordsFlow,
  getChatUserListFlow,
};
