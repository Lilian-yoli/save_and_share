const router = require("express").Router();
const { wrapAsync, authentication } = require("../utils");
const {
  chatRecordsFlow,
  getChatUserListFlow,
} = require("../controllers/chat_controller");

router
  .route("/chat/chat-records")
  .get(authentication(), wrapAsync(chatRecordsFlow));

router
  .route("/chat/chat-user-list")
  .get(authentication(), wrapAsync(getChatUserListFlow));

module.exports = router;
