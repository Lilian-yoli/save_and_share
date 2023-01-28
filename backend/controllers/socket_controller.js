const { saveChatMsgToDB } = require("../models/chat_model");

// This is a file to manage socket event

// bind userId with socketId and vice versa
const userId_socketId = {};
const socketId_userId = {};

const socketCon = (io) => {
  io.on("connection", (socket) => {
    socket.on("click-inbox", (userId) => {
      if (userId_socketId[userId]) {
        userId_socketId[userId] = new Set(userId_socketId[userId]);
        userId_socketId[userId].add(socket.id);
        userId_socketId[userId] = [...userId_socketId[userId]];
      } else {
        userId_socketId[userId] = [socket.id];
      }
      socketId_userId[socket.id] = userId;
      console.log("table", userId_socketId);
      console.log("r-table", socketId_userId);
    });

    // listen send event from client and emit another event for both the sender and receiver to get the msg
    socket.on("sendMsg", (data) => {
      const receiverList = userId_socketId[data.receiver_id];
      if (typeof receiverList === "object" && receiverList.length > 0) {
        receiverList.forEach((socketId) => {
          io.to(socketId).emit("receiveMsg", data);
        });
      }

      console.log("reciver", receiverList);
      console.log("db", data);

      const senderList = userId_socketId[data.sender_id];
      if (typeof senderList === "object" && senderList.length > 0) {
        senderList.forEach((socketId) =>
          io.to(socketId).emit("receiveMsg", data)
        );
      }

      saveChatMsgToDB(data);
    });

    socket.on("disconnect", () => {
      console.log("leave");
      const userId = socketId_userId[socket.id];
      let socketIdList = userId_socketId[userId];
      socketIdList = socketIdList.filter((socketId) => socketId !== socket.id);

      if (!socketIdList.length) delete userId_socketId[userId];
      delete socketId_userId[socket.id];
    });
  });
};

module.exports = {
  socketCon,
};
