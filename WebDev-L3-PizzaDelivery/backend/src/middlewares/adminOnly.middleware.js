/**
 * @adminOnly - restricts access to admin-only routes. Must run AFTER
 * userAuthentication, since it relies on req.user already being set.
 * @param {*} req - expects req.user.role to be populated
 * @param {*} res
 * @param {*} next
 */

export async  function adminOnlyMiddleware(req ,res ,next){
      if(!req.user){
            /**
             * @safty check from @authMiddleware 
             * @GUARD used from auth against this middleware being used out of order
             */
            return res.status(401).json({
                  message:"UNAUTHORIZED ⚠️"
            })
      }

      if(req.user.role !== "admin"){
            return res.status(403).json({
                  message:"Access denied ⚠️ — admin only"
            })
      }

      next();
}