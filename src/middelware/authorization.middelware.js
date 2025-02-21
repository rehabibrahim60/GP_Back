export const isAuthorized =(role)=>{
    return async(req,res,next)=>{
        if(req.user.role !== role) return next(new Error("you are not auhorized" ,{cause : 403}))
        next()
    }
}