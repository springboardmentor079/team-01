const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors || {})
      .map((validationError) => validationError.message)
      .join(", ");

    return res.status(400).json({
      success: false,
      message,
    });
  }

  if (err.code === 11000) {
    const duplicateField = err.keyValue
      ? Object.keys(err.keyValue)[0]
      : "field";

    return res.status(409).json({
      success: false,
      message: `Duplicate value for field: ${duplicateField}`,
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorMiddleware;
