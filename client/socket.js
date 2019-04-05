const io = require("socket.io-client");

export default () => {
  const socket = io.connect("http://localhost:3000");

  const registerHandler = onMessageReceived => {
    socket.on("message", onMessageReceived);
  };

  const unregisterHandler = () => {
    socket.off("message");
  };

  socket.on("error", function(err) {
    console.log("received socket error:");
    console.log(err);
  });

  const register = (name, cb) => {
    socket.emit("register", name, cb);
  };

  const join = (chatroomName, cb) => {
    socket.emit("join", chatroomName, cb);
  };

  const leave = (chatroomName, cb) => {
    socket.emit("leave", chatroomName, cb);
  };

  const message = (chatroomName, msg, cb) => {
    socket.emit("message", { chatroomName, message: msg }, cb);
  };

  const getChatrooms = cb => {
    socket.emit("chatrooms", null, cb);
  };

  const getAvailableUsers = cb => {
    socket.emit("availableUsers", null, cb);
  };

  return {
    register,
    join,
    leave,
    message,
    getChatrooms,
    getAvailableUsers,
    registerHandler,
    unregisterHandler
  };
};
