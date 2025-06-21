// this middleware for usercontrller which hndle aysnc errors
export const catchAsyncErrors = (theFunction) => {
  return (req, res, next) => {
    Promise.resolve(theFunction(req, res, next)).catch(next);
  };
};





// a reusable middleware called catchAsyncError, which is commonly used in Node.js Express applications to
//  handle async/await errors in your controllers automatically, so your app doesn't crash or leave errors unhandled.




// 📌 What It Does (In Simple Terms):
// Takes any async function (theFunction) — usually a controller function like registerUser, loginUser, etc.

// Wraps it in a try/catch-like behavior using Promise.resolve(...).catch(next)

// Automatically catches any error from async code and passes it to Express's error handler using next(error).

// 🔍 WHY DO WE NEED IT?
// ❌ The problem without it:
// In Express, if you throw an error inside an async function without try...catch, the server won’t catch it by default.

// js
// Copy
// Edit
// app.get("/test", async (req, res) => {
//   const user = await User.findById("invalidID"); // Throws error
//   res.send(user);
// });
// This will crash the app or show unhandled promise rejection.

// ✅ The solution with catchAsyncError:
// You wrap your controller like this:

// js
// Copy
// Edit
// app.get("/test", catchAsyncError(async (req, res) => {
//   const user = await User.findById("invalidID"); // error caught!
//   res.send(user);
// }));
// Now any error goes directly to your global error handler (next(error)), like:

// js
// Copy
// Edit
// app.use((err, req, res, next) => {
//   res.status(500).json({ success: false, message: err.message });
// });
// ✅ HOW TO USE IT IN CONTROLLER FILE
// Instead of this:

// js
// Copy
// Edit
// export const registerUser = async (req, res) => {
//   // logic here
// };
// Do this:

// js
// Copy
// Edit
// import catchAsyncError from "../middleware/catchAsyncError.js";

// export const registerUser = catchAsyncError(async (req, res) => {
//   // logic here
// });
// No need to write try...catch manually in every controller!

// 🔁 What each part does:
// js
// Copy
// Edit
// const catchAsyncError = (theFunction) => {
// Takes a controller function like:

// js
// Copy
// Edit
// async (req, res, next) => { /* ... */ }
// js
// Copy
// Edit
//   return (req, res, next) => {
//     Promise.resolve(theFunction(req, res, next)).catch(next);
//   }
// Runs the controller function

// If it returns a rejected Promise (an error), it goes to .catch(next)

// next(error) passes error to Express error handler

// 🧠 Summary
// Part	Purpose
// catchAsyncError(fn)	A higher-order function that wraps your controller
// Promise.resolve(fn(...)).catch(next)	Catches async errors and sends them to error middleware
// next(error)	Sends error to global error handler middleware

// 🏆 Benefits
// ✅ No need to write try/catch in every async controller
// ✅ Centralized error handling
// ✅ Cleaner, reusable, and production-standard practice