import express from 'express'
import dotenv from 'dotenv'
import cors from "cors"
import { connectDB } from './DB/dbConnection.js'
import tutorRouter from "./src/modules/tutor/tutor.router.js"
import userRouter from "./src/modules/user/user.router.js"
import flagRouter from "./src/modules/flag/flag.router.js"
import tutorFlagRouter from "./src/modules/tutorFlag/tutorFlag.router.js"
import sessionRouter from "./src/modules/session/session.router.js"
import pdfRouter from "./src/modules/pdf/pdf.router.js"
import reportRouter from "./src/modules/report/report.router.js"
import notificationRouter from "./src/modules/notification/notification.router.js"
import courseRouter from "./src/modules/course/course.router.js"
import { v2 as cloudinary } from 'cloudinary';
dotenv.config()

const app = express()
const port = process.env.PORT
app.timeout = 900000;


const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'token'],
  credentials: true,
};

app.use(cors(corsOptions));

//parsing
app.use(express.json())

app.use(express.json({ limit: "100mb" }));  // Increase request size limit
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use((req, res, next) => {
  console.log(`[TRACE] Incoming: ${req.method} ${req.url}`);
  next();
});


app.use((req, res, next) => {
  req.setTimeout(900000, () => {  // 10 minutes timeout
      console.log("Request Timeout");
      res.status(408).json({ message: "Request Timeout" });
  });
  next();
});

  app.use((req, res, next) => {
    const start = Date.now(); // Record request start time
  
    // Log the incoming request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log(`Headers:`, JSON.stringify(req.headers, null, 2));
    console.log(`Body:`, JSON.stringify(req.body, null, 2));
  
    // Capture response data
    const originalSend = res.json;
    res.json = function (data) {
      console.log(`Response (${Date.now() - start}ms):`, JSON.stringify(data, null, 2));
      originalSend.call(this, data);
    };
  
    next();
  });
  

//routers
app.use("/tutor" , tutorRouter)
app.use("/user" , userRouter)
app.use("/flag" , flagRouter)
app.use("/tutorFlag" , tutorFlagRouter)
app.use("/session", sessionRouter);
app.use("/pdf", pdfRouter);
app.use("/report", reportRouter);
app.use("/notification", notificationRouter);
app.use("/course", courseRouter);


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


cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
});



app.listen(port, () => console.log(`Example app listening on port ${process.env.PORT}!`))