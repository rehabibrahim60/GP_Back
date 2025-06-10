import { model, Schema , Types } from "mongoose";

const pdfSchema = new Schema({
    course_id : {
        type : Types.ObjectId,
        ref : "Course", 
        required : true , 
    },
    title : {
        type : String, 
        // required : true , 
    },
    file : {
        id : {type : String , required : true},
        url : {type : String , required : true},
    },
    lesson_id : {
        type : Types.ObjectId,
        ref : "Lesson", 
        required : true , 
    },
    

},{timestamps : true})

export const Pdf = model("Pdf" , pdfSchema)