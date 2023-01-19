// This is a file to manage socket event
const socketCon = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);
  });
};

module.exports = {
  socketCon,
};
