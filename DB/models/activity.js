import { model, Schema, Types } from "mongoose";

const activitySchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User' },
    action: { type: String, required: true }, // e.g., "Created Report"
    entityType: { type: String, required: true }, // "Session", "Report", etc.
    entityId: { type: Types.ObjectId }, // ID of the affected item
},{timestamps : true})

export const Activity = model("Activity" , activitySchema)