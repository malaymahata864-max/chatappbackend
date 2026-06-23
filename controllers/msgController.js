const User=require("../models/User");
const Message=require("../models/Message");
const { getSocketByUserId ,io} = require("../config/socketioConfig");
const {uploadOnCloudinary}=require("../utils/cloudinary");
const getUsers=async(req,res)=>{
    try{
        const userId=req.userId;
        const users=await User.find({_id:{$ne:userId}}).select("-password");
        res.status(200).json(users);
    }
    catch(error){
        res.status(500).json({message:"Error fetching users"});
    }
}
const getMessages=async(req,res)=>{
    try{
        const userId=req.userId;
        const otherUserId=req.params.id;
        const messages=await Message.find({
            $or:[
                {senderId:userId,receiverId:otherUserId},
                {senderId:otherUserId,receiverId:userId}
            ]
        }).sort({createdAt:1});
        res.status(200).json(messages);
    }
    catch(error){
        res.status(500).json({message:"Error fetching messages"});
    }
}
const sendMessage=async(req,res)=>{
    try{
        const senderId=req.userId;
        const receiverId=req.params.id;
       const {text,image}=req.body;
       let imageUrl="";
       if(image){
        const result=await uploadOnCloudinary(image);
        imageUrl=result;
       }
       const newMessage=new Message({
        senderId,
        receiverId,
        text,
        image:imageUrl
       });
       await newMessage.save();
       const receiverSocketId=getSocketByUserId(receiverId);
       if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",newMessage);
       }
       res.status(201).json(newMessage);
    }
    catch(error){
        res.status(500).json({message:"Error sending message"});
    }
}
module.exports={getUsers,getMessages,sendMessage};