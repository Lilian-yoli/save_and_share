const router = require("express").Router();
const { wrapAsync, authentication } = require("../utils");
const { chatMessagesFlow } = require("../controllers/chat_controller");

router
  .route("/chat/chat-messages")
  .get(authentication(), wrapAsync(chatMessagesFlow));

module.exports = router;
