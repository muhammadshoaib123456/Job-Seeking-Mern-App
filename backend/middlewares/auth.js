
// use this file for authorization of user when he login so it authorize through his token match it and authorize the user

import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  // ✅ Token must be present
  if (!token) {
    return next(new ErrorHandler("User Not Authorized", 401));
  }

  // ✅ Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // ✅ Find user and attach to req
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  req.user = user;
  next();
});










// 🧠 WHAT YOU HAVE
// 1. auth.js
// Checks if user is logged in via JWT token (authorization)

// 2. catchAsyncError.js
// Catches async errors in your controllers and passes them to error middleware

// 3. error.js (or errorMiddleware.js)
// Global error handler that sends nice error messages to frontend

// 📦 1. auth.js — 🔐 isAuthorized Middleware
// export const isAuthorized = catchAsyncError(async (req, res, next) => {
//   const { token } = req.cookies; // token from browser cookies

//   if (!token) {
//     return next(new ErrorHandler("User not authorized", 400));
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//   req.user = await User.findById(decoded.id);

//   next();
// });
// 🔍 What This Does:
// This middleware protects private routes like /profile, /dashboard, etc.

// It:

// Gets the token from browser cookies

// Verifies it with jwt.verify()

// Finds the user from database (User.findById(decoded.id))

// Attaches the user to req.user

// Calls next() to move to the next controller

// If any step fails → throws error using next(new ErrorHandler(...))

// 🔁 Full Request Flow
// Let’s say frontend sends a request to:

// bash
// Copy
// Edit
// GET /api/v1/me
// You have this route:

// js
// Copy
// Edit
// router.get("/me", isAuthorized, getMyProfile);
// Here’s what happens:
// User requests /me from frontend (in browser or postman)

// isAuthorized runs first:

// It checks if token is valid

// If not → throws error via next(new ErrorHandler(...))

// If yes → calls next()

// getMyProfile controller runs:

// Uses req.user to send back the user info

// If any error occurs in controller (async error), it’s caught by catchAsyncError

// That error is passed to the global error middleware (error.js)

// error.js sends JSON response back to frontend like:

// json
// Copy
// Edit
// {
//   "success": false,
//   "message": "User not authorized"
// }
// 🔁 How All Middleware Files Work Together
// File	Role
// catchAsyncError.js	Wraps async functions so you don’t have to use try-catch
// auth.js	Middleware to check if JWT is present and valid
// error.js	Global error handler that sends proper error messages to frontend
// ErrorHandler.js	Custom class to create error objects with message + status


// 💡 Tips to Remember
// Tip	Explanation
// Always use catchAsyncError() in your controllers	Avoids writing try-catch blocks manually
// Use ErrorHandler() to throw errors	With message + status
// Use errorMiddleware at the bottom in app.js	It should catch all errors
// Use next(error) to pass error to global handler	So your code is clean
// Use token to protect private routes	Like profile, dashboard, etc





// ✅ TL;DR Summary
// Question	Answer
// Which error file runs last?	error.js (global error middleware)
// Is controller connected to these?	Yes — directly uses catchAsyncError and ErrorHandler
// Is model connected to these?	No direct import, but errors from model are passed to same error system
// Why use catchAsyncError?	So you don't need try/catch in every controller
// Why use ErrorHandler?	To throw errors with custom message & status
// Why use error.js?	To format & send final error response to frontend


