// TODO: apply saveChatMsgToDB in socket event
const { saveChatMsgToDB } = require("../models/chat_model");

// This is a file to manage socket event
const socketCon = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);
    socket.on("test_message", (data) => {
      console.log("Data of test_message: " + data.message);
    });
  });
};

module.exports = {
  socketCon,
};
