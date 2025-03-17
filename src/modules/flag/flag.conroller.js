import { Flag } from "../../../DB/models/flag.js";
import { asyncHandler } from "../../utils/asyncHandler.js";


export const createFlag = asyncHandler(async (req, res , next) => {
    let flag = await Flag.findOne({flag_name : req.body.flag_name})
    if(flag) return next(new Error("flag name already exists" , {cause: 409}))
    flag = await Flag.create({
        flag_name : req.body.flag_name
    });
    res.status(201).json({success : true , message: "Flag created successfully", flag });
});

export const getFlags = asyncHandler(async (req, res,next) => {
    const flags = await Flag.find();
    res.status(200).json({success: true ,flags});
});


//find flag by id
export const getFlag = asyncHandler(async (req,res,next)=>{
    const flag = await Flag.findById( req.params.id)
    if(!flag) return next(new Error("flag not found" , {cause: 404}))
    return res.json({success : true , flag})
})

export const updateFlag = asyncHandler(async (req, res , next) => {
    const flag = await Flag.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!flag) {
        return next(new Error("Flag not found" , {cause: 404})) 
    }
    res.status(200).json({success:true , message: "Flag updated successfully", flag });
});

export const deleteFlag = asyncHandler(async (req, res , next ) => {
    const flag = await Flag.findByIdAndDelete(req.params.id);
    if (!flag) {
        return next(new Error("Flag not found" , {cause: 404})) 
    }
    res.status(200).json({success: true , message: "Flag deleted successfully" });
});

export const searchFlags = asyncHandler(async (req, res , next) => {
    const { query } = req.query;
    const flags = await Flag.find({ flag_name: { $regex: query, $options: "i" } });
    res.status(200).json(flags);
});
