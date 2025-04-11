import Joi from "joi";

// Add New PDF Schema
export const addPdf = Joi.object({
    title: Joi.string().required(),
    grade: Joi.string().optional(),
    lesson: Joi.string().optional(),
    semester: Joi.string().optional(),
}).required();

// Update PDF Schema
export const updatePdf = Joi.object({
    id: Joi.string().required(),
    title: Joi.string(),
    grade: Joi.string(),
    lesson: Joi.string(),
    semester: Joi.string(),
}).required();

// Get One PDF Schema
export const idSchema = Joi.object({
    id: Joi.string().required(),
}).required();


