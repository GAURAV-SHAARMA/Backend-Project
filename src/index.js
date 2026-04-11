
import dotenv from "dotenv";
import connectDB from "./db/index.js";
//Now proffessional Appproach
import express from "express";

const app = express();

dotenv.config({
    path:"./.env"
})



connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    })
 })
.catch((error)=>{
    console.log("MongoDB connection failed",error);
})














/*


import express from "express";
const app = express();

(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_Name}`);
        app.on("error" ,(error)=>{
            console.log("ERROR", error);
            throw error;
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        })

    }catch(error){
        console.log("ERROR",error)
        throw error;
    }

})()

*/