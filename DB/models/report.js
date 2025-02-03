import { model, Schema, Types } from "mongoose";

const reportSchema = new Schema({
    file : {
        id : {type : String , required : true},
        url : {type : String , required : true},
    },
    session_id :{
        type : Types.ObjectId,
        ref : "Session"
    }

},{timestamps : true})

export const Report = model("Report" , reportSchema)