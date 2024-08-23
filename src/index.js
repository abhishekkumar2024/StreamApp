import dotenv from "dotenv"
import MONGODBCONNECTION from "./db/db.js"
import {app} from "./app.js"

dotenv.config({path:'./env'})

MONGODBCONNECTION().then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`Mongodb is connected at port : ${process.env.PORT}`)
    })
}).catch((error)=>{
    console.log(`mongodb is not connected sucessfully, Error: ${error}`)
})
