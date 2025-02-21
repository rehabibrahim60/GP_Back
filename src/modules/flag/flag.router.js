import express from "express";
import * as flagController from "./flag.conroller.js";
import * as flagSchema from "./flag.schema.js";
import { validation } from "../../middelware/validation.middleware.js";
import { isAuthenicated } from "../../middelware/authentication.middelware.js";
import { isAuthorized } from "../../middelware/authorization.middelware.js";

const router = express.Router();

router.post(
    "/",
    isAuthenicated,
    isAuthorized("admin"),
    validation(flagSchema.createFlag),
    flagController.createFlag
    );

router.get(
    "/",
    isAuthenicated,
    flagController.getFlags
    );

router.get(
    "/search",
    isAuthenicated,
    flagController.searchFlags
    );

router.patch(
    "/:id",
    isAuthenicated,
    isAuthorized("admin"),
    validation(flagSchema.updateFlag), 
    flagController.updateFlag
    );
router.delete(
    "/:id", 
    isAuthenicated,
    isAuthorized("admin"),
    validation(flagSchema.deleteFlag), 
    flagController.deleteFlag
    );

export default router;
