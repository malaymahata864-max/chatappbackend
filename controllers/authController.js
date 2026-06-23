//imports
const User=require("../models/userModel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {uploadOnCloudinary}=require("../utils/cloudinary");
const cookieOptions={
    httpOnly:true,
    secure:process.env.NODE_ENV==="production"?true:false,
    sameSite:process.env.NODE_ENV==="production"?"none":"lax",
    maxAge:30*24*60*60*1000
};
//register user
const registerUser=async (req,res)=>{
    try{
        const {fullName,email,password}=req.body;
        if(!fullName || !email || !password){
            return res.status(400).json({message:"Please provide all required fields"});
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({
            fullName,
            email,
            password:hashedPassword
        });
        if(newUser){
            await newUser.save();
            const token=jwt.sign({userId:newUser._id},process.env.JWT_SECRET,{expiresIn:"30d"});
            res.cookie("token",token,cookieOptions);
            res.status(201).json({message:"User registered successfully",user:{fullName:newUser.fullName,email:newUser.email,profilePic:newUser.profilePic}});
        }
        else{
            res.status(400).json({message:"Error in registering user"});
        }
    }
    catch(error){
        res.status(500).json({message:"Error in registering user",error:error.message});
    }
}
//login user
const loginUser=async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"Please provide all required fields"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User does not exist"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"30d"});
        res.cookie("token",token,cookieOptions);
        res.status(200).json({message:"User logged in successfully",user:{fullName:user.fullName,email:user.email,profilePic:user.profilePic}});
    }
    catch(error){
        res.status(500).json({message:"Error in logging in user",error:error.message});
    }
}
//logout user
const logoutUser=async (req,res)=>{
    try{
        res.clearCookie("token",cookieOptions);
        res.status(200).json({message:"User logged out successfully"});
    }
    catch(error){
        res.status(500).json({message:"Error in logging out user",error:error.message});
    }
}
//update user
const updateUser=async (req,res)=>{
    try{
        const {userId}=req.userId;
        const {image}=req.file;
        
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({message:"User does not exist"});
        }
        if(image){
            const result=await uploadOnCloudinary(image);
            user.profilePic=result;
            await user.save();
            res.status(200).json({message:"User updated successfully",user:{fullName:user.fullName,email:user.email,profilePic:user.profilePic}});
        }
        else{
            res.status(400).json({message:"Please provide an image"});
        }
    }
    catch(error){
        res.status(500).json({message:"Error in updating user",error:error.message});
    }
}
//get profile
const getProfile=async (req,res)=>{
    try{
        const {userId}=req.userId;
        const user=await User.findById(userId);
        if(!user){
            return res.status(400).json({message:"User does not exist"});
        }
        res.status(200).json({message:"User profile fetched successfully",user:{fullName:user.fullName,email:user.email,profilePic:user.profilePic}});
    }
    catch(error){
        res.status(500).json({message:"Error in fetching user profile",error:error.message});
    }
}