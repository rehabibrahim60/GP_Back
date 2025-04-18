import { asyncHandler } from "../../utils/asyncHandler.js";
import {Tutor} from "../../../DB/models/tutor.js"

//add tutor
export const addTutor = asyncHandler(async (req,res,next)=>{
    
    //add tutor in db
    await Tutor.create({
        id_by_organization : req.body.id_by_organization,
        name : req.body.name,
        national_id : req.body.national_id,
        phone : req.body.phone,
    })
    //response
    return res.json({success : true , message : "Tutor added successfuly"})
})

//get all tutors
export const allTutors = asyncHandler(async (req,res,next)=>{
    const tutors = await Tutor.find()
    return res.json({success : true , tutors})
})

//update tutor
export const updateTutor = asyncHandler(async (req , res , next) =>{
    //check tutor in database
    const tutor = await Tutor.findById(req.params.id)
    if(!tutor) return next(new Error("tutor not found" , {cause: 404}))
    console.log(tutor);
    
    //update Tutor
    tutor.name = req.body.name ? req.body.name : tutor.name
    tutor.id_by_organization = req.body.id_by_organization ? req.body.id_by_organization : tutor.id_by_organization
    tutor.phone = req.body.phone ? req.body.phone : tutor.phone
    tutor.national_id = req.body.national_id ? req.body.national_id : tutor.national_id
    //save tutor
    await tutor.save()
    //send response
    return res.json({success: true , message: "Tutor updated successfully"})
})

//find one tutor
export const getTutor = asyncHandler(async (req,res,next)=>{
    const tutor = await Tutor.findById( req.params.id)
    if(!tutor) return next(new Error("Tutor not found" , {cause: 404}))
    return res.json({success : true , tutor})
})

//find  tutor by NID
export const getTutorByNID = asyncHandler(async (req,res,next)=>{
    const tutor = await Tutor.findOne({national_id : req.params.id})
    if(!tutor) return next(new Error("Tutor not found" , {cause: 404}))
    return res.json({success : true , tutor})
})

//delete Tutor
export const deleteTutor = asyncHandler(async (req , res , next) =>{
    //check Tutor in database
    const tutor = await Tutor.findById(req.params.id)
    if(!tutor) return next(new Error("Tutor not found" , {cause: 404}))
    await Tutor.findByIdAndDelete(tutor._id)
    //send response
    return res.json({success: true , message: "Tutor deleted successfully"})
})




