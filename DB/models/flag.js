import { model, Schema, Types } from "mongoose";

const flagSchema = new Schema({
    flag_name : {
        type : String , 
        required : true , 
    },
    
    
},{timestamps : true})

export const Flag = model("Flag" , flagSchema)