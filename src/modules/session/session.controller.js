import axios from "axios";
import { Session } from "../../../DB/models/session.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { Notification } from "../../../DB/models/notification.js";



// Add a new session
export const createSession = asyncHandler(async (req, res, next) => {
    //check if title is exist
    const session_title = await Session.findOne({title : req.body.title}) 
    if(session_title) return next(new Error("this title is already exist", { cause: 400 }))
    // Check if file is provided
    if (!req.file) {
        return next(new Error("video file is required!", { cause: 400 }));
    }
    // Upload session to Cloudinary
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.CLOUD_FOLDER_NAME}/sessions`,
        resource_type: "video", // Ensures Cloudinary treats it as a document
    });
    console.log("file after uploading " , req.file);
    // Create session record in DB
    const session = await Session.create({
        title: req.body.title,
        tutor_id: req.body.tutor_id,
        assigned_to: req.body.assigned_to,
        session_id : req.body.session_id,
        lesson: req.body.lesson,
        pdf_id :req.body.pdf_id,
        date:req.body.date,
        video: { id: public_id, url: secure_url },
    });
    //send notification to qm 
    const notification = await Notification.create({
        message : `session \"${session.title}\" assigned to you`,
        user_id : session.assigned_to
    })
    
    return res.json({ success: true, message: "session added successfully" , session });
});



// Get All Sessions
export const getAllSessions = asyncHandler(async (req, res, next) => {
    const sessions = await Session.find().populate("tutor_id assigned_to");
    res.status(200).json({success :true ,sessions});
});

// Get Single Session by ID
export const getSessionById = asyncHandler(async (req, res, next) => {
    const session = await Session.findById(req.params.id).populate("tutor_id assigned_to");
    if (!session) return next(new Error("Session not found", { cause: 404 }));

    res.status(200).json({success:true,message:"fetched successfuly" ,session});
});

// Update Session with Video Upload
export const updateSession = asyncHandler(async (req, res, next) => {
    const session = await Session.findById(req.params.id);
    if (!session) return next(new Error("Session not found", { cause: 404 }));

    // Check if a new file is uploaded
    if (req.file) {
        // Delete old video from Cloudinary
        if (session.video && session.video.id) {
            await cloudinary.uploader.destroy(session.video.id, { resource_type: "video" });
        }

        // Upload new video to Cloudinary
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.CLOUD_FOLDER_NAME}/videos`,
            resource_type: "video",
        });

        session.video = { id: public_id, url: secure_url };
    }

    // Update other fields
    session.title = req.body.title ?? session.title;
    session.tutor_id = req.body.tutor_id ?? session.tutor_id;
    session.assigned_to = req.body.assigned_to ?? session.assigned_to;
    session.lesson = req.body.lesson ?? session.lesson;

    await session.save();
    res.status(200).json({ success:true ,message: "Session updated successfully", session });
});

export const updateStatus = asyncHandler(async (req, res, next) =>{
    
        const sessionId = req.params.id;
        const { status } = req.body;
    
        const updated = await Session.findByIdAndUpdate(
            sessionId,
            { status },
            { new: true }
        );
        
        if (!updated) return next(new Error("Session not found", { cause: 404 }));
        
        return res.json({ success: true, session: updated });
        
        
})

// Delete Session
export const deleteSession = asyncHandler(async (req, res, next) => {
    const session = await Session.findById(req.params.id);
    if (!session) return next(new Error("Session not found", { cause: 404 }));

    // Delete video from Cloudinary
    if (session.video && session.video.id) {
        await cloudinary.uploader.destroy(session.video.id, { resource_type: "video" });
    }

    // Delete session from DB
    await Session.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Session deleted successfully" });
});

// Search Sessions by Title or Lesson
export const searchSessions = asyncHandler(async (req, res, next) => {
    const { query } = req.query;

    const sessions = await Session.find({
        $or: [
            { title: { $regex: query, $options: "i" } }, // Case-insensitive search
            { status: { $regex: query, $options: "i" } }
        ]
    });

    if (sessions.length === 0) return next(new Error("No Sessions Found", { cause: 404 }));

    res.status(200).json(sessions);
});

// Get Sessions by Tutor ID
export const getSessionsByTutorId = asyncHandler(async (req, res, next) => {
    const sessions = await Session.find({ tutor_id: req.params.id }).populate("assigned_to");

    if (sessions.length === 0) return next(new Error("No sessions found for this tutor", { cause: 404 }));

    res.status(200).json(sessions);
});

// Get Sessions assigned to specific qm
export const getSessionsByUserId = asyncHandler(async (req, res, next) => {
    const sessions = await Session.find({ assigned_to: req.params.id }).populate("tutor_id");

    if (sessions.length === 0) {
        return next(new Error("No sessions found for this user", { cause: 404 }));
    }

    res.status(200).json({success: true,sessions});
});

//download video 
export const downloadVideo = asyncHandler(async (req, res, next) => {
    const session = await Session.findById(req.params.id);
    if (!session) return next(new Error("session not found", { cause: 404 }));
  
    const sessionUrl = session.video.url;
  
    // Use axios to get the file as stream
    const response = await axios.get(sessionUrl, {
      responseType: "stream",
    });
  
    // Set headers to simulate file download
    res.setHeader("Content-Disposition", `attachment; filename="${session.title}.mp4"`);
    res.setHeader("Content-Type", "application/mp4");
  
    // Pipe the stream directly to response
    response.data.pipe(res);
  });
