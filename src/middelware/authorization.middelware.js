export const isAuthorized = (role) => {
    return async (req, res, next) => {
        try {
            // Admin: proceed if role matches
            if (req.user.role === role) {
                return next();
            }

            // User: allow only if accessing their own data
            const userIdFromParam = req.params.id; // assuming you're using /users/:id route
            if (req.user.role === 'quality_member' && req.user._id.toString() === userIdFromParam) {
                return next();
            }

            // Otherwise unauthorized
            return next(new Error("You are not authorized", { cause: 403 }));
        } catch (err) {
            return next(err);
        }
    };
};
