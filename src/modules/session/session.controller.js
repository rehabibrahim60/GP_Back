import { log } from "console";
import { Session } from "../../../DB/models/session.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";

// // Create Session with Video Upload
// export const createSession = asyncHandler(async (req, res, next) => {
//     // Check if file is provided
//     console.log("📂 File Uploaded:", req.file);
//     console.log("📄 Request Body:", req.body);

//     if (!req.file) {
//         return next(new Error("Video file is required!", { cause: 400 }));
//     }
    
    

//     // Upload Video to Cloudinary
//     try {
//         console.log("⏳ Uploading video to Cloudinary...");
    
//         const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
//             folder: `${process.env.CLOUD_FOLDER_NAME}/videos`,
//             resource_type: "auto",
//             timeout: 60000
//         });
    
//         console.log("✅ Cloudinary upload successful:", secure_url);
//     } catch (error) {
//         console.error("❌ Cloudinary Upload Error:", error);
//         return next(new Error("Cloudinary upload failed", { cause: 500 }));
//     }
    

//     // Create session record in DB
//     console.time("DB Save");
//     const newSession = await Session.createIndexes({
//         title: req.body.title,
//         tutor_id: req.body.tutor_id,
//         assigned_to: req.body.assigned_to,
//         lesson: req.body.lesson,
//         video: { id: public_id, url: secure_url },
//     });
//     console.timeEnd("DB Save");
//     clearTimeout(timeout); // Clear timeout if DB operation is fast

//     console.log("✅ Session created:", newSession);

//     res.status(201).json({ message: "Session created successfully", session: newSession });
// });



// Add a new PDF
export const createSession = asyncHandler(async (req, res, next) => {
    // Check if file is provided
    console.log("file1 " , req.file);
    
    if (!req.file) {
        return next(new Error("video file is required!", { cause: 400 }));
    }
    console.log("file2 " , req.file);
    // Upload PDF to Cloudinary
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.CLOUD_FOLDER_NAME}/sessions`,
        resource_type: "video", // Ensures Cloudinary treats it as a document
    });
    console.log("file after uploading " , req.file);
    // Create PDF record in DB
    const session = await Session.create({
        title: req.body.title,
        tutor_id: req.body.tutor_id,
        assigned_to: req.body.assigned_to,
        pdf_id : req.body.pdf_id,
        lesson: req.body.lesson,
        date:req.body.date,
        video: { id: public_id, url: secure_url },
    });
    console.log(session);
    
    return res.json({ success: true, message: "session added successfully" });
});



// Get All Sessions
export const getAllSessions = asyncHandler(async (req, res, next) => {
    const sessions = await Session.find().populate("tutor_id assigned_to pdf_id");
    res.status(200).json({success :true ,sessions});
});

// Get Single Session by ID
export const getSessionById = asyncHandler(async (req, res, next) => {
    const session = await Session.findById(req.params.id).populate("tutor_id assigned_to");
    if (!session) return next(new Error("Session not found", { cause: 404 }));

    res.status(200).json(session);
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
    res.status(200).json({ message: "Session updated successfully", session });
});

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
            { lesson: { $regex: query, $options: "i" } }
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

    res.status(200).json(sessions);
});
