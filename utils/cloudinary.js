const cloudinary=require("cloudinary").v2;
const fs=require("fs");
const uploadOnCloudinary=async(file)=>{
    try{
        const result=await cloudinary.uploader.upload(file.path);
        if(result){
            fs.unlinkSync(file.path);
            return result.secure_url;
        }
        else{
            throw new Error("Error uploading file to Cloudinary");
        }
       
    }
    catch(error){
        throw new Error("Error uploading file to Cloudinary");
    }

}
module.exports={uploadOnCloudinary};