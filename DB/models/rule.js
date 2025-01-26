import { model, Schema } from "mongoose";


const ruleSchema = new Schema({
    rule :{
        type :String ,
        required : true ,
        unique : true ,
    },
})

export const rule = model("Rule" , ruleSchema)