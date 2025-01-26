import mongoose from "mongoose"
export const connectDB = async ()=>{
    return await 
    mongoose.connect(process.env.DB_CONNECTION_URL)
    .then(()=>console.log("connected successfully"))
    .catch((err)=> console.log("failed to connect " , err)
    )
    

}