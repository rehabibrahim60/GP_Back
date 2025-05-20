import { asyncHandler } from "../../utils/asyncHandler.js";
import {Course} from "../../../DB/models/course.js"
import { Lesson } from "../../../DB/models/lesson.js";

//add course
export const addCourse = asyncHandler(async (req,res,next)=>{
    const isExist = await Course.findOne({title:req.body.title })
        if(isExist) {
            return next(new Error("course already exists!", { cause: 409 }));
        }
    //add course in db
    const course = await Course.create({
        title : req.body.title,
        num_of_lessons : req.body.num_of_lessons,
    })
    //add course lessons to db
    for (let i = 1; i < req.body.num_of_lessons+1; i++) {
        const lesson = await Lesson.create({
            course_id: course._id,
            lesson: i
        })
        
    }
    //response
    return res.json({success : true , message : "course added successfuly" , course})
})

//get all courses
export const allCourses = asyncHandler(async (req,res,next)=>{
    const courses = await Course.find()
    return res.json({success : true , courses})
})

//update course
export const updateCourse = asyncHandler(async (req , res , next) =>{
    //check course in database
    const course = await Course.findById(req.params.id)
    if(!course) return next(new Error("course not found" , {cause: 404}))
    
    //update course
    course.num_of_lessons = req.body.num_of_lessons ? req.body.num_of_lessons : course.num_of_lessons
    course.title = req.body.title ? req.body.title : course.title
    //save course
    await course.save()
    //send response
    return res.json({success: true , message: "course updated successfully"})
})


//delete course
export const deleteCourse = asyncHandler(async (req , res , next) =>{
    //check course in database
    const course = await Course.findById(req.params.id)
    if(!course) return next(new Error("course not found" , {cause: 404}))
    await course.findByIdAndDelete(course._id)
    //send response
    return res.json({success: true , message: "course deleted successfully"})
})


//find one course
export const getCourse = asyncHandler(async (req,res,next)=>{
    const course = await Course.findById( req.params.id)
    if(!course) return next(new Error("course not found" , {cause: 404}))
    return res.json({success : true , course})
})

//find  course by user id
export const getCourseByTitle = asyncHandler(async (req,res,next)=>{
    const course = await Course.findOne({title : req.params.id})
    if(!course) return next(new Error("course not found" , {cause: 404}))
    return res.json({success : true , course})
})






