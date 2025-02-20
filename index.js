import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './DB/dbConnection.js'
import tutorRouter from "./src/modules/tutor/tutor.router.js"
import userRouter from "./src/modules/user/user.router.js"
dotenv.config()

const app = express()
const port = process.env.PORT

//parsing
app.use(express.json())

//routers
app.use("/tutor" , tutorRouter)
app.use("/user" , userRouter)

//connect db
await connectDB()

//page not found handler
app.all('*' ,(req , res , next)=>{
    next(new Error("page not found" , {cause : 404}))
}) 

//global error handling
app.use((error,req,res,next)=>{
    const statusCode = error.cause || 500
    return res.status(statusCode).json({
        success : false ,
        message : error.message ,
        stack : error.stack
    })

}) 

app.listen(port, () => console.log(`Example app listening on port ${process.env.PORT}!`))