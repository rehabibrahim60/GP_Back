import { model, Schema } from "mongoose";

const pdfSchema = new Schema({
    title : {
        type : String , 
        required : true , 
        unique : true 
    },
    file : {
        id : {type : String , required : true},
        url : {type : String , required : true},
    },
    grade: String , 
    lesson : String , 
    semester : String, 

},{timestamps : true})

export const Pdf = model("Pdf" , pdfSchema)