import { Session } from "../../../DB/models/session.js";
import {asyncHandler} from "../../utils/asyncHandler.js";


// Create Session
export const createSession = asyncHandler(async (req, res , next) => {

    const { video } = req.body;

    // Check if video is provided
    if (!video || !video.id || !video.url) {
        return next(new Error("Video is required and must include an ID and URL." , {cause : 400}));
    }

    const newSession = await Session.create(req.body);
    res.status(201).json({ message: "Session created successfully", session: newSession });
});

// Get All Sessions
export const getAllSessions = asyncHandler(async (req, res , next) => {
    const sessions = await Session.find().populate("tutor_id assigned_to");
    res.status(200).json(sessions);
});

// Get Single Session by ID
export const getSessionById = asyncHandler(async (req, res , next) => {
    const session = await Session.findById(req.params.id).populate("tutor_id assigned_to");
    if (!session) return next(new Error("Session not found" , {cause : 404})) 

    res.status(200).json(session);
});

// Update Session
export const updateSession = asyncHandler(async (req, res , next) => {

    const updatedSession = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSession) return next(new Error("Session not found" , {cause : 404}))

    res.status(200).json({ message: "Session updated successfully", session: updatedSession });
});

// Delete Session
export const deleteSession = asyncHandler(async (req, res , next) => {
    const deletedSession = await Session.findByIdAndDelete(req.params.id);
    if (!deletedSession) return next(new Error("Session not found" , {cause : 404}))

    res.status(200).json({ message: "Session deleted successfully" });
});

// Search Sessions by Title or Lesson
export const searchSessions = asyncHandler(async (req, res , next) => {
    const { query } = req.query;

    const sessions = await Session.find({
        $or: [
            { title: { $regex: query, $options: "i" } }, // Case-insensitive search
            { lesson: { $regex: query, $options: "i" } }
        ]
    });

    if (sessions.length === 0) return next(new Error("No Sessions Found" , {cause : 404}))

    res.status(200).json(sessions);
});

// Get Sessions by Tutor ID
export const getSessionsByTutorId = asyncHandler(async (req, res , next) => {
    const sessions = await Session.find({ tutor_id: req.params.id }).populate("assigned_to");

    if (sessions.length === 0) return next(new Error("No sessions found for this tutor"  , {cause : 404})) 

    res.status(200).json(sessions);
});

// Get Sessions assigned to specific qm
export const getSessionsByUserId = asyncHandler(async (req, res , next) => {
    const sessions = await Session.find({ assigned_to: req.params.id }).populate("tutor_id");

    if (sessions.length === 0) {
        return next(new Error("No sessions found for this user" , {cause : 404})) 
    }

    res.status(200).json(sessions);
});
