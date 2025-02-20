import Joi from "joi";

//add user
export const addUser = Joi.object({
    id_by_organization : Joi.string().required() ,
    name : Joi.string().required() ,
    email : Joi.string().email().required(),
    password : Joi.string().required(),
    phone : Joi.string().required(),
}).required()


//login
export const login = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().required(),
}).required()

//delete user
export const deleteUser = Joi.object({
    id: Joi.string().required(),
}).required()

//get one user
export const getUser = Joi.object({
    id: Joi.string().required(),
}).required()

//update user
export const updateUser = Joi.object({
    id : Joi.string().required(),
    id_by_organization : Joi.string(),
    name : Joi.string() ,
    email : Joi.string().email(),
    password : Joi.string(),
    phone : Joi.string(),
}).required()

