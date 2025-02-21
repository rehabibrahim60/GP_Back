import {Router} from "express"
import {validation} from '../../middelware/validation.middleware.js'
import * as userController from './user.controller.js'
import * as userSchema from './user.schema.js'
import { isAuthenicated } from "../../middelware/authentication.middelware.js";
import { isAuthorized } from "../../middelware/authorization.middelware.js";

const router = Router()

//add user
router.post(
    "/" , 
    isAuthenicated,
    isAuthorized("admin"),
    validation(userSchema.addUser) , 
    userController.addUser
    )

//login
router.post(
    "/login" ,
    validation(userSchema.login) , 
    userController.login
    )

//delete user
router.delete(
    "/:id" ,
    isAuthenicated,
    isAuthorized("admin"), 
    validation(userSchema.deleteUser) , 
    userController.deleteUser
)

//update user
router.patch(
    "/:id" ,
    isAuthenicated,
    isAuthorized("admin"), 
    validation(userSchema.updateUser) , 
    userController.updateUser
)

//find one user
router.get(
    "/:id" ,
    isAuthenicated,
    isAuthorized("admin"), 
    validation(userSchema.getUser) , 
    userController.getUser
)

//get all users
router.get(
    "/" ,
    isAuthenicated,
    isAuthorized("admin"),
    userController.allUsers
)

export default router

