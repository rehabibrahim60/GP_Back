import { model, Schema, Types } from "mongoose";

const LessonSchema = new Schema({
    pdf_id :{
        type :Types.ObjectId , 
        ref : "Pdf",
    },
    course_id :{
        type :Types.ObjectId , 
        ref : "Course",
        required : true 
    },
    lesson : {
        type : Number , 
        required : true , 
    },
},{timestamps : true})

export const Lesson = model("Lesson" , LessonSchema)