import Joi from "joi"
import {isValidObjectId} from "../../middelware/validation.middleware.js"

export const idSchema = Joi.object({
    id: Joi.string().required(),
}).required()


export const updateReport = Joi.object({
    id: Joi.string().required(),
    session_id : Joi.string().custom(isValidObjectId),
    similarity: Joi.number().min(0).max(100),
    bad_word: Joi.array(),
    noisy_detection: Joi.string(),
    key_points: Joi.string(),
    summary: Joi.string(),
    transcript: Joi.string(),
    abnormal_times: Joi.array(),
    total_silence_duration : Joi.string(),
    plot: Joi.string(),
    time_tracking: Joi.array()
})


export const createReport = Joi.object({
    session_id : Joi.string().custom(isValidObjectId).required(),
    similarity: Joi.number().min(0).max(100).required(),
    bad_word: Joi.array().required(),
    noisy_detection: Joi.string().required(),
    key_points: Joi.string().required(),
    summary: Joi.string().required(),
    transcript: Joi.string().required(),
    abnormal_times: Joi.array().required(),
    total_silence_duration : Joi.string().required(),
    plot: Joi.string().required(),
    time_tracking: Joi.array().required() 
}).required()

