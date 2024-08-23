import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const MONGODBCONNECTION=async ()=>{
    try {
        const connectionDB=await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log(`\n connection is stablished at HOST : ${connectionDB.connection.host}`)
    } catch (error){
        console.error("MONGODB connection FAILED : ",error);
        process.exit(1);
    }
}
export default MONGODBCONNECTION;