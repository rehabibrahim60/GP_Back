import {Router} from "express"
import {validation} from '../../middelware/validation.middleware.js'
import * as userController from './user.controller.js'
import * as userSchema from './user.schema.js'

const router = Router()

//register
router.post("/" , validation(userSchema.addUser) , userController.addUser)

//login
router.post("/login" , validation(userSchema.login) , userController.login)



export default router

