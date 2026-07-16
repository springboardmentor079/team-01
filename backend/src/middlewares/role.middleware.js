const allowRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user && req.user.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: insufficient permissions",
      });
    }

    return next();
  };
};

module.exports = { allowRoles };
