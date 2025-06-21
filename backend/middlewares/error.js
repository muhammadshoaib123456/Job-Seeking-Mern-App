
// errorhandler are custom create error we can use it inother file and call it there in next functio n so it will display error message and status code and then  it finally goes to globel error and this error send to fronten
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`,
      err = new ErrorHandler(message, 400);
  }
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`,
      err = new ErrorHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again!`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again!`;
    err = new ErrorHandler(message, 400);
  }
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;









// 🧠 How it All Fits Together
// User sends request to /register or /login

// Controller handles it and calls DB functions

// If there's an error (like email exists, invalid password), we call next(new ErrorHandler(...))

// catchAsyncError wraps the controller, catches async errors and sends to next()

// errorMiddleware catches it and sends clean JSON response to frontend






