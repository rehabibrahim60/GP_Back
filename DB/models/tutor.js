import { model, Schema } from "mongoose";

const tutorSchema = new Schema({
    id_by_organization :{
        type : String, 
        required : true ,
        unique : true
    },
    name :{
        type : String , 
        required : true , 
    },
    national_id :{
        type : String , 
        unique : true,
        required : true, 
    },
    phone : {
        type : String , 
        required : true
    }

},{timestamps : true})

export const Tutor = model("Tutor" , tutorSchema)