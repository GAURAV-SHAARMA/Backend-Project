import {v2 as cloudinary} from "cloudinary"

import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadToCloudinary = async (localfilePath) => {
    try{
        if(!localfilePath){
            return null;
        }
            //upload file on cloudinary

            const response = await cloudinary.uploader.upload(localfilePath ,{
                resource_type:"auto",
            })
            // file has benn uploaded successfully
            console.log("File uploaded successfully. Cloudinary URL:", response.url);
            return response;
    }

    catch(error){
        fs.unlinkSync(localfilePath);// sync -> hona hi chahiye , agar error aata hai to file ko delete kar denge
        //remove locally shared file as upload operartion failes

        return null;

    }
}

export {uploadToCloudinary}

cloudinary.uploader.upload("path/to/your/image.jpg", 
    {public_id:"TheCoders"},
function(error , result){console.log(result);})

