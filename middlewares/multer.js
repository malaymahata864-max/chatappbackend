const multer=require("multer");
const storage=multer({dest:"uploads/"});
module.exports=storage;