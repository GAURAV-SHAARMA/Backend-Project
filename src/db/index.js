// import mongoose from "mongoose";
// import { DB_NAME } from "../constants.js";

// const connectDB = async () => {
//     try{
//         const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         console.log(`\n MongoDB connected !! DB HOST:${connectionInstance.connection.host}`);
//     }
//     catch(error){
//         console.log("MONGODB connection ERROR",error);
//         process.exit(1);// like our AAPLICATION EXIT HO JAYEGA AGAR MONGODB SE CONNECT NA HO PAYE TOH 
//         //PROCESS ->> like our application is running at a particular instance and w can exit that instance by using process.exit() method and we can also pass a code to it like 0 means success and 1 means failure
//     }
// }

// export default connectDB;

    



import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRoutes from "./routes/user.routes.js";

// ✅ FIXED (added /)
app.use("/api/v1/user", userRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});