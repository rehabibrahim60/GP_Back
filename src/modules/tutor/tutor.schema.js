import Joi from "joi";

//add new tutor schema
export const addTutor = Joi.object({
    id_by_organization : Joi.string().required() ,
    name : Joi.string().required() ,
    national_id : Joi.string().min(14).max(14).required(),
    phone : Joi.string().required(),
}).required()

//update Tutor
export const updateTutor = Joi.object({
    id: Joi.string().required(),
    id_by_organization : Joi.string() ,
    name : Joi.string() ,
    national_id : Joi.string().min(14).max(14),
    phone : Joi.string(),

}).required()

//Get one Tutor
export const getTutor = Joi.object({
    id: Joi.string().required(),
}).required()

//delete Tutor
export const deleteTutor = Joi.object({
    id: Joi.string().required(),
}).required()
