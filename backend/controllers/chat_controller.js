const { selectMessagesByRoom } = require("../models/chat_model");

const chatMessagesFlow = async (req, res) => {
  const { receiverId } = req.query;
  const senderId = req.user.id;
  const room = generateChatRoom(senderId, receiverId);
  const historyMessages = await selectMessagesByRoom(room);
  const respondedChatInfo = {
    receiver_id: receiverId,
    sender_id: senderId,
    history_messages: historyMessages,
  };
  return res.status(200).send({ data: respondedChatInfo });
};

const generateChatRoom = (senderId, receiverId) => {
  if (senderId > receiverId) {
    return receiverId + "&" + senderId + "room";
  } else {
    return senderId + "&" + receiverId + "room";
  }
};

module.exports = {
  chatMessagesFlow,
};
