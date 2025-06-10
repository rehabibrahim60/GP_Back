import { Router } from "express";
import { validation } from "../../middelware/validation.middleware.js";
import * as courseSchema from "./course.schema.js";
import * as courseController from "./course.controller.js"
import { isAuthenicated } from "../../middelware/authentication.middelware.js";
import { isAuthorized } from "../../middelware/authorization.middelware.js";

const router = Router()

//add new course 
router.post(
    '/',
    isAuthenicated,
    isAuthorized("admin"),
    validation(courseSchema.addCourse) ,
    courseController.addCourse 
)

//get all courses 
router.get(
    "/",
    isAuthenicated, 
    courseController.allCourses
)

//get one course
router.get(
    "/:id",
    isAuthenicated,
    validation(courseSchema.idSchema) , 
    courseController.getCourse
)

//get course by NID
router.get(
    "/lesson/:id",
    isAuthenicated,
    validation(courseSchema.idSchema) , 
    courseController.getCourseLessons
)
//get lessons by course
router.get(
    "/nid/:id",
    isAuthenicated,
    validation(courseSchema.idSchema) , 
    courseController.getCourseByTitle
)

//update course 
router.patch(
    "/:id" ,
    isAuthenicated,
    isAuthorized("admin"),
    validation(courseSchema.updateCourse), 
    courseController.updateCourse)

//delete course 
router.delete(
    "/:id" ,
    isAuthenicated,
    isAuthorized("admin"),
    validation(courseSchema.idSchema), 
    courseController.deleteCourse
)

export default router