
// 🔁 Summary Flowchart

// [ User Logs In ]
//         |
//         v
// [ JWT Created (contains user ID) ]
//         |
//         v
// [ JWT Sent to Browser via Cookie ]
//         |
//         v
// [ Browser stores cookie "token" ]
//         |
//         v
// [ On next request: cookie sent automatically ]
//         |
//         v
// [ Middleware reads token, verifies, and finds user ]
//         |
//         v
// [ User is allowed access to protected route ]




//.......................................... code..............................................................
export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTTOKEN();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Set httpOnly to true
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token,
  });
};

//..................................................................................................................









// ✅ Code Explanation – Line by Line

// export const sendToken = (user, statusCode, res, message) => {
// 📌 This exports a function named sendToken.

// user → the logged-in or newly registered user.

// statusCode → the HTTP status code (e.g., 200 for success).

// res → the Express response object (used to send back data).

// message → custom message like "Login successful".

// const token = user.getJWTToken();
// 🧠 Calls the method getJWTToken() from your user model (you defined it in userSchema.methods), which generates a JWT token for that user.

// 🔑 This token will be used for authorization.

// const options = {
//     expires: new Date(
//         Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 
//     ),
//     httpOnly: true,
// };
// 🧠 options define how the token will be saved as a cookie in the browser:

// expires: Sets cookie expiration based on .env value (e.g., 5 days).

// httpOnly: true: Secures the cookie so JavaScript on frontend cannot access it, which protects from XSS (cross-site scripting) attacks.

// res.status(statusCode)
//    .cookie("token", token, options)
//    .json({
//        success: true,
//        user,
//        message,
//        token
//    });
// ✅ This line does three things:

// res.status(statusCode) → sets the response status (e.g., 200 OK).

// .cookie("token", token, options) → sets a cookie named token with the JWT.

// .json({...}) → sends back a JSON response to the frontend.

// 💡 The frontend receives the token both as a cookie and in the JSON body.

// ✅ In Short – What This Code Does
// After login or registration, it:

// Creates a JWT token for the user

// Sets that token as a cookie

// Returns the user + token + message in the response










