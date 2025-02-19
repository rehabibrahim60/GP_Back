import { model, Schema, Types } from "mongoose";

const flagSchema = new Schema({
    flag_name : {
        type : String , 
        required : true , 
        enum : ["red" , "yellow"]
    },
    
    
},{timestamps : true})

export const Flag = model("Flag" , flagSchema)