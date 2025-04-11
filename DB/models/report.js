import { model, Schema, Types } from "mongoose";

const reportSchema = new Schema({
    
    session_id :{
        type :Types.ObjectId , 
        ref : "Session",
        required : true 
    },
    // ml models results
    similarity :{
        type : Number ,
        min : 0 , 
        max : 100,
        required : true 
    },
    bad_word : [{
        word : {type : String , required : true},
        // start_time : {type : String , required : true}
    }],
    // noise : [{
    //     start_time : {type : String , required : true},
    //     end_time : {type : String , required : true},
    // }],
    noisy_detection : {
        type :String,
        required :true
    },

    key_points: {
        type : String ,
        required : true 
    },

    summary: {
        type : String ,
        required : true 
    },
    transcript: {
        type : String ,
        required : true 
    },
    abnormal_times : [{
        start_time : {type : String , required : true},
        end_time :{type : String , required : true},
        // current_status : {type : String , required : true}
    }],
    time_tracking : [{
        start_frame : {type : String , required : true},
        end_frame : {type : String , required : true},
    }],
    transcript : {
        type : String,
        required : true
    },
    total_silence_duration: {type : String , required : true},


},{timestamps : true})

export const Report = model("Report" , reportSchema)