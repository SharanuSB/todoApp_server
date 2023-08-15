import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { config } from "dotenv"
import bcrypt from "bcrypt"
config()

const {Schema} = mongoose

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:[8, "Password must be atleast 8 characters long"],
        select:false
    },

    avatar:{
        public_id:String,
        url:String
    },
    verified:{
        type:Boolean,
        default:false
    },

    tasks:[
        {
            title:String,
            description:String,
            completed:Boolean,
            createdAt:Date
        }
    ],
    otp:Number,
    otp_expiry:Date
},{timestamps:true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt()
    this.password= await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.getJWTToken = function(){
    return jwt.sign({_id:this._id}, process.env.JWT_SECRET, {
        expiresIn:60*1000*24*60
    })
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.index({otp_expiry:1}, {expireAfterSeconds:0})

export const User = mongoose.model("User", userSchema)