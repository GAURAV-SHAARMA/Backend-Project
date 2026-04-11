import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try{
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST:${connectionInstance.connection.host}`);
    }
    catch(error){
        console.log("MONGODB connection ERROR",error);
        process.exit(1);// like our AAPLICATION EXIT HO JAYEGA AGAR MONGODB SE CONNECT NA HO PAYE TOH 
        //PROCESS ->> like our application is running at a particular instance and w can exit that instance by using process.exit() method and we can also pass a code to it like 0 means success and 1 means failure
    }
}

export default connectDB;

    