import {Activity} from '../../DB/models/activity.js'

export const logActivity = async ({
    userId,
    action,
    entityType,
    entityId,
    details = {},
}) => {
    try {
        await Activity.create({ userId, action, entityType, entityId, details });
    } catch (err) {
        console.error('Failed to log activity:', err);
    }
};
