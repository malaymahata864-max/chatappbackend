const mongoose=require("mongoose");
const dotenv=require("dotenv");
const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
    }
    catch(error){
        throw new Error(`Error in connecting to database ${error}`);
    }
}
module.exports=connectDB;