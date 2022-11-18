function requireUser(req, res, next) {
  console.log("in require user")
console.log(req.user)
    if (!req.user) {
      console.log("no user")
      res.status(401)
      next({
        error: 'No user',
        name: "MissingUserError",
        message: "You must be logged in to perform this action"
      });
    }
    next();
  }

  function requireAdmin(req, res, next) {
    if (!req.user.isAdmin) {
      res.status(401);
      next({
        error: "Not an admin",
        name: "MissingAdminError",
        message: "You must be an Admin to perform this action",
      });
    }
    next();
  }
  
  module.exports = {
    requireUser,
    requireAdmin,
  }
