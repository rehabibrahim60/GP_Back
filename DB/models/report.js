import { model, Schema, Types } from "mongoose";

const reportSchema = new Schema({
    
    session_id :{
        type :Types.ObjectId , 
        ref : "Session",
        required : true 
    },
    // ml models results
    session_text : {
        type : string ,
        required : true 
    },
    similarity :{
        type : Number ,
        min : 0 , 
        max : 100,
        required : true 
    },
    bad_word : [{
        word : {type : String , required : true},
        start_time : {type : String , required : true}
    }],
    noise : [{
        start_time : {type : String , required : true},
        end_time : {type : String , required : true},
    }],
    upnormal_behaviour : [{
        start_time : {type : String , required : true},
        end_time : {type : String , required : true},
    }],
    time_tracking : [{
        start_time : {type : String , required : true},
        end_time : {type : String , required : true},
    }],


},{timestamps : true})

export const Session = model("Report" , reportSchema)