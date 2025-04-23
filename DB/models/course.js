import { model, Schema, Types } from "mongoose";

const CourseSchema = new Schema({
    title : {
        type : String,
        required : true,
        uniqe : true
    },
    num_of_lessons : {
        type : Number,
        required : true
    },
},{timestamps : true})

export const Course = model("Course" , CourseSchema)