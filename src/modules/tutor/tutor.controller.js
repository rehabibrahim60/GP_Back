import { asyncHandler } from "../../utils/asyncHandler.js";
import {Tutor} from "../../../DB/models/tutor.js"

//add tutor
export const addTutor = asyncHandler(async (req,res,next)=>{
    const tutorExist = await Tutor.findOne({
        $or: [
            { national_id: req.body.national_id },
            { id_by_organization: req.body.id_by_organization }
            ]
        })
    if(tutorExist) {
        return next(new Error("Tutor already exists!", { cause: 409 }));
    }
    //add tutor in db
    const tutor = await Tutor.create({
        id_by_organization : req.body.id_by_organization,
        name : req.body.name,
        national_id : req.body.national_id,
        phone : req.body.phone,
    })
    // Log activity
    await logActivity({
        userId: req.user.id, // assuming you have auth middleware
        action: 'Add a new Tutor',
        entityType: 'Tutor',
        entityId: tutor._id,
    });
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
    // Log activity
    await logActivity({
        userId: req.user.id, // assuming you have auth middleware
        action: 'Update Tutor',
        entityType: 'Tutor',
        entityId: tutor._id,
    });
    //send response
    return res.json({success: true , message: "Tutor updated successfully"})
})


//delete Tutor
export const deleteTutor = asyncHandler(async (req , res , next) =>{
    //check Tutor in database
    const tutor = await Tutor.findById(req.params.id)
    if(!tutor) return next(new Error("Tutor not found" , {cause: 404}))
    await Tutor.findByIdAndDelete(tutor._id)
    // Log activity
    await logActivity({
        userId: req.user.id, // assuming you have auth middleware
        action: 'Delete Tutor',
        entityType: 'Tutor',
        entityId: tutor._id,
    });
    //send response
    return res.json({success: true , message: "Tutor deleted successfully"})
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






