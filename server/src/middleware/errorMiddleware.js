import { AppError } from "../utils/AppError.js";

export const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler = (err, req, res, next) => {
  // Keep Express default behavior when headers already sent.
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || res.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource id";
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value detected";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  return res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};

