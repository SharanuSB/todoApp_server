import express from "express"
import cors from "cors"
import {config} from "dotenv"
import { connectDB } from "./config/database.js";
import router from "./config/routes.js";
import cookieParser from "cookie-parser"


const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(router)



config({
    path:"./config/config.env"
})

connectDB()

app.listen(process.env.PORT, ()=>{
    console.log("server is running on the port", process.env.PORT)
})