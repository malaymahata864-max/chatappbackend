const User = require("../models/userModel");
const Message = require("../models/messageModel");
const { getSocketByUserId, io } = require("../config/socketioConfig");
const { uploadOnCloudinary } = require("../utils/cloudinary");

// Get all users except the logged-in user
const getUsers = async (req, res) => {
    try {
        const userId = req.userId;
        const users = await User.find({ _id: { $ne: userId } }).select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

// Get all messages between logged-in user and another user
const getMessages = async (req, res) => {
    try {
        const userId = req.userId;
        const otherUserId = req.params.id;
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages" });
    }
};

// Send a message (text and/or image)
const sendMessage = async (req, res) => {
    try {
        const senderId = req.userId;
        const receiverId = req.params.id;
        const { text } = req.body;

        let imageUrl = "";
        // Fixed: image file comes via req.file (multipart upload), not req.body.image
        if (req.file) {
            imageUrl = await uploadOnCloudinary(req.file);
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        await newMessage.save();

        // Emit to receiver via Socket.IO if they are online
        const receiverSocketId = getSocketByUserId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: "Error sending message" });
    }
};

module.exports = { getUsers, getMessages, sendMessage };