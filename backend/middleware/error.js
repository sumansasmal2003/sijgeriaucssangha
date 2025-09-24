const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Log the error for debugging purposes
  console.error(`[ERROR] ${statusCode} - ${message}\n${err.stack}`);

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 400;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    statusCode = 400;
  }

  // --- NEW: Mongoose Validation Error Handler ---
  if (err.name === 'ValidationError') {
    // Extract the first error message from the errors object
    const validationMessage = Object.values(err.errors).map(e => e.message)[0];
    message = validationMessage || 'Invalid input data.';
    statusCode = 400;
  }


  // Wrong JWT error
  if (err.name === 'JsonWebTokenError') {
    message = `Json Web Token is invalid, Try again`;
    statusCode = 400;
  }

  // JWT EXPIRE error
  if (err.name === 'TokenExpiredError') {
    message = `Json Web Token is Expired, Try again`;
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

export default errorHandler;
