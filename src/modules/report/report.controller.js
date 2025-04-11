import { asyncHandler } from "../../utils/asyncHandler.js";
import {Report} from "../../../DB/models/report.js";
import { Session } from "../../../DB/models/session.js";
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import multer from "multer";
import { Pdf } from "../../../DB/models/pdf.js";


//add report
export const addReport = asyncHandler(async (req,res,next)=>{
    
    if (!req.files?.video || !req.files?.pdf) {
        return res.status(400).json({ success: false, message: 'Both video and PDF files are required.' });
    }

    const { session_id } = req.body;

    const video = req.files.video[0];
    const pdf = req.files.pdf[0];

    const form = new FormData();
    form.append('video', fs.createReadStream(video.path), video.originalname);
    form.append('pdf', fs.createReadStream(pdf.path), pdf.originalname);

    

    
        const response = await axios.post(
            'https://645d-34-82-174-130.ngrok-free.app/analyze-content',
            form,
            { headers: form.getHeaders() }
        );
        const data = response.data;

    // Example: parse flag list to match bad_word format
    const bad_word = (data.flag || []).map(word => ({
        word: word,
        start_time: "00:00" // You can customize this if your model returns timestamps
    }));


    //add report in db
    const report = await Report.create({
        session_id,
        similarity: data.similarity,
        bad_word: bad_word,
        noisy_detection:data.noisy_detection , // Adjust based on your logic
        key_points: (data.key_points || []).join('\n'),
        summary: data.summary,
        transcript: data.transcript,
        abnormal_times: (data.abnormal_times || []).map(t => ({
            start_time: t.start,
            end_time: t.end
        })),
        total_silence_duration : data.total_silence_duration,
        
        time_tracking: data.silence_intervals        // Add actual values if available
    })
    
    



    
    //response
    return     res.status(200).json({ message: 'Report saved', report , plot : data.image_base64});
})




