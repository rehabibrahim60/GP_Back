import {Router} from "express"
import {validation} from '../../middelware/validation.middleware.js'
import * as userController from './user.controller.js'
import * as userSchema from './user.schema.js'

const router = Router()

//register
router.post("/" , validation(userSchema.addUser) , userController.addUser)

//login
router.post("/login" , validation(userSchema.login) , userController.login)

//delete user
router.delete("/:id" , validation(userSchema.deleteUser) , userController.deleteUser)

//update user
router.patch("/:id" , validation(userSchema.updateUser) , userController.updateUser)

//find one user
router.get("/:id" , validation(userSchema.getUser) , userController.getUser)

//get all tutors
router.get("/" , userController.allUsers)

export default router

