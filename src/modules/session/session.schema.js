import Joi from "joi";
import mongoose from "mongoose";
import { isValidObjectId } from "../../middelware/validation.middleware.js";



export const createSession = Joi.object({
    title: Joi.string().optional(),
    tutor_id: Joi.string().custom(isValidObjectId).required(),
    // pdf_link: Joi.string().uri().required(),
    pdf_id : Joi.string().custom(isValidObjectId).required(),
    assigned_to: Joi.string().custom(isValidObjectId).required(),
    grade: Joi.string().optional(),
    lesson: Joi.string().optional(),
    date: Joi.date().required(),
    status: Joi.string().valid("not reviewed", "reviewed" , "inProgress" ,"done").optional(),
});

export const updateSession = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
    title: Joi.string().optional(),
    pdf_link: Joi.string().uri().optional(),
    grade: Joi.string().optional(),
    lesson: Joi.string().optional(),
    date: Joi.date().optional(),
    status: Joi.string().valid("not reviewed", "reviewed" , "inProgress" ,"done").optional(),
});

//used in get session by id && delete session
export const idSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required(),
});

