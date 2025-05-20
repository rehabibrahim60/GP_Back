import { TutorFlag } from "../../../DB/models/tutorFlag.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createTutorFlag = asyncHandler(async (req, res, next) => {
    const tutorFlag = await TutorFlag.create({
        session_id : req.body.session_id,
        flag_id : req.body.flag_id,
        comment : req.body.comment,
    });
    // Log activity
    await logActivity({
        userId: req.user.id, // assuming you have auth middleware
        action: 'Assign Flag to Tutor',
        entityType: 'Tutor Flag',
        entityId: tutorFlag._id,
    });
    res.status(201).json({success: true , message: "TutorFlag created successfully", tutorFlag });
});

export const getTutorFlags = asyncHandler(async (req, res , next) => {
    const tutorFlags = await TutorFlag.find().populate("flag_id")
    res.status(200).json({success : true,tutorFlags});
});

export const getTutorFlagById = asyncHandler(async (req, res , next) => {
    const tutorFlag = await TutorFlag.findById(req.params.id).populate("session_id flag_id");
    if (!tutorFlag) {
        return next(new Error("Tutor Flag not found" , {cause: 404})) 
    }
    res.status(200).json({success : true,tutorFlag});
});

export const updateTutorFlag = asyncHandler(async (req, res, next) => {
    const tutorFlag = await TutorFlag.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tutorFlag) {
        return next(new Error("Tutor Flag not found" , {cause: 404})) 
    }
    res.status(200).json({success: true , message: "TutorFlag updated successfully", tutorFlag });
});

export const deleteTutorFlag = asyncHandler(async (req, res) => {
    const tutorFlag = await TutorFlag.findByIdAndDelete(req.params.id);
    if (!tutorFlag) {
        return next(new Error("Tutor Flag not found" , {cause: 404})) 
    }
    // Log activity
    await logActivity({
        userId: req.user.id, // assuming you have auth middleware
        action: 'delete Tutor Flag',
        entityType: 'Tutor Flag',
        entityId: tutorFlag._id,
    });
    res.status(200).json({success:true , message: "TutorFlag deleted successfully" });
});

export const searchTutorFlags = asyncHandler(async (req, res) => {
    const { query } = req.query;
    const tutorFlags = await TutorFlag.find({ comment: { $regex: query, $options: "i" } }).populate("session_id flag_id");
    res.status(200).json(tutorFlags);
});

export const searchByFlagName = asyncHandler(async (req, res) => {
    const { query } = req.query;

    const tutorFlags = await TutorFlag.find()
        .populate({
            path: "flag_id",
            match: { flag_name: { $regex: query, $options: "i" } }, // Case-insensitive search
        })
        .populate("session_id");

    // Filter out null values (flags that didn’t match)
    const filteredTutorFlags = tutorFlags.filter((flag) => flag.flag_id !== null);

    if (filteredTutorFlags.length === 0) {
        return next(new Error("No TutorFlags found for this flag name" , {cause: 404})) 
    }

    res.status(200).json(filteredTutorFlags);
});

