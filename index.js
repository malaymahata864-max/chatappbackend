const express=require("express");
const dotenv=require("dotenv");
dotenv.config();
const connectDB=require("./config/databaseConfig");
connectDB();
const connectCloudinary=require("./config/cloudinaryConfig");
connectCloudinary();
const authRoutes=require("./routes/authRoutes");
const msgRoutes=require("./routes/msgRoutes");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
const corsOptions={
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials:true,

}
const { io, getSocketByUserId, server,app } = require("./config/socketioConfig");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(cors(corsOptions));
app.use("/api/auth",authRoutes);
app.use("/api/messages",msgRoutes);
const port=process.env.PORT || 5000;
server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})