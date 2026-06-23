const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middlewares/isLoggedIn");
const { getUsers, getMessages, sendMessage } = require("../controllers/msgController");
const multer = require("../middlewares/multer");

router.get("/users", isLoggedIn, getUsers);
router.get("/:id", isLoggedIn, getMessages);
router.post("/send/:id", isLoggedIn, multer().single("image"), sendMessage);

module.exports = router;