import mongoose from "mongoose"
import bcrpyt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema= new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowecase:true,
            trim:true,
            index:true 
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowecase:true,
            trim:true,
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true 
        },
        avatar:{
            type:String,
            required:true
        },
        coverImage:{
            type:String
        },
        watchHistory:[{
           type: mongoose.Schema.Types.ObjectId,
           ref:"Video"
        }],
        password:{
            type:String,
            required:[true,'password is required']
        },
        refreshToken:{
            type:String
        }
    },
    {
        timestamps:true
    }
);


userSchema.pre("save",async function(next){
    if(!this.isModified("password"))  return next()
    this.password=await bcrpyt.hash(this.password,10)
    next();
})

userSchema.methods.isPasswordCorrect= async function(password){
    return await bcrpyt.compare(password,this.password);
}
userSchema.methods.generateAccessToken=async function(){
    return  jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.access_WebToken_Secure,
        {
            expiresIn: process.env.access_WebToken_Expiry
        }
    )

}
userSchema.methods.generaterefreshToken=async function(){

       return  jwt.sign(
        {
            _id:this._id
        },
        process.env.refresh_WebToken_Secure,
        {
            expiresIn: process.env.refresh_WebToken_Expiry
        }
    )
}

const User= mongoose.model("User",userSchema)
export default User