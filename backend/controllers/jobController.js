import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Job } from "../models/jobSchema.js";
import ErrorHandler from "../middlewares/error.js";

export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const postJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;

  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler("Please provide full job details.", 400));
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(
      new ErrorHandler(
        "Please either provide fixed salary or ranged salary.",
        400
      )
    );
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    return next(
      new ErrorHandler("Cannot Enter Fixed and Ranged Salary together.", 400)
    );
  }
  const postedBy = req.user._id;
  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });
  res.status(200).json({
    success: true,
    message: "Job Posted Successfully!",
    job,
  });
});

export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const myJobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    myJobs,
  });
});

export const updateJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }
  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Job Updated!",
  });
});

export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }
  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job Deleted!",
  });
});

export const getSingleJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler("Job not found.", 404));
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(new ErrorHandler(`Invalid ID / CastError`, 404));
  }
});






// ...............................explaination about above code................................................



// 🔧 Required Imports at the Top:

// import catchAsyncError from "../middlewares/catchAsyncError.js";
// import ErrorHandler from "../middlewares/error.js";
// import { Job } from "../models/jobSchema.js";
// What do these do?
// catchAsyncError: This is a wrapper function for handling errors in async functions without needing a try-catch every time.

// ErrorHandler: Custom class to send error messages in a structured format.

// Job: The Mongoose model representing a Job document in your MongoDB database.

// ✅ 1. getAllJobs Function

// export const getAllJobs = catchAsyncError(async(req, res, next)=>{
//     const jobs = await Job.find({expired:false})
//     res.status(200).json({
//         success:true,
//         jobs,
//     });
// });
// 🔍 What does it do?
// This function fetches all job posts from MongoDB where expired: false.

// It uses Job.find() to get matching documents from the jobs collection.

// Returns a JSON response with:

// success: true

// the list of jobs.

// ⚙️ MongoDB Query:

// Job.find({expired: false})
// This means only active job posts (not expired) are shown to the user.

// ✅ 2. postJobs Function

// export const postJobs = catchAsyncError(async(req, res, next)=>{
// This function handles posting/creating a new job. Let’s go line by line:

// 🔐 Step 1: Authorization

// const {role} = req.user;
// if(role=="job seeker"){
//     return next(ErrorHandler("job seeker is not allowed to access this resource", 400))
// }
// Only users with role = Employer are allowed to post jobs.

// If job seeker tries to post, an error is returned using ErrorHandler.

// 🔗 req.user is available because you've already used an authentication middleware that adds user info to the request after verifying the JWT.

// 📥 Step 2: Get Data from Request

// const {title, description, category, country, city, location, fixedSalary, salaryFrom, salaryTo} = req.body;
// Extract job details from req.body, which contains the data sent from the frontend form.

// ✅ Step 3: Check All Required Fields

// if(!title || !description || !category || !country || !city || !location || !fixedSalary || !salaryFrom || !salaryTo){
//     return next(ErrorHandler("please provide full job detail", 400))
// }
// Ensures all fields are filled.

// If any required field is missing, it returns an error message.

// ❌ Step 4: Salary Validation

// if((!salaryFrom || salaryTo) && fixedSalary){
//     return next(ErrorHandler("please either provide fixed salary or ranges salary", 400))
// }
// Either fixedSalary OR a salary range (salaryFrom + salaryTo) should be provided — not both.

// This prevents confusion on salary structure.

// 🧠 Step 5: Create the Job in DB

// const postedBy = req.user._id;
// Gets the ID of the currently logged-in user (Employer) to associate them with the job post.

// const job = await Job.create({
//     title, description, category, country, city, location, fixedSalary, salaryFrom, salaryTo, postedBy
// });
// Saves the job into MongoDB using the Mongoose .create() method.

// The document will have all job fields along with postedBy (user's ID).

// 📤 Step 6: Send Response

// res.status(200).json({
//     success: true,
//     message:"Job posted successfully",
//     job
// });
// Returns a success message with the job object that was created.

// 🔁 Summary of Full Flow
// Step	What Happens
// 🔐 Auth	Middleware checks JWT and adds user data to req.user.
// 🛑 Role Check	If role is job seeker, send error.
// 📥 Data Extraction	Gets job data from frontend (req.body).
// ✅ Validation	Checks if all fields are provided and salary is correctly structured.
// 💾 Save to DB	Creates a new document in MongoDB via Job.create().
// 📤 Response	Sends back job post confirmation and created job data.




// ✅ 1. updateJob Function — Update Existing Job
// 🔧 Function Purpose:
// This function allows an employer to update the details of a job post (like title, description, salary, etc.) by providing the job ID and new data.

// 🔍 Step-by-Step Explanation:

// export const updateJob = catchAsyncError(async(req, res, next)=>{
// The controller is wrapped in catchAsyncError() to handle async errors without needing a try-catch block.


// const {role} = req.user;
// if(role == "Job Seeeker"){
//    return next(new ErrorHandler("job seeker is not allowed to access this resource", 400))
// }
// First, it checks if the user is a Job Seeker.

// If yes, they are not allowed to update job posts — only Employers can.

// Note: "Job Seeeker" has a spelling mistake. It should be "Job Seeker" (Fix this or it will break the condition).


// const {id} = req.params;
// It extracts the job ID from the URL route, like:
// PUT /api/v1/job/update/:id


// let job = await Job.findById(id);

// if(!job){
//     return next(new ErrorHandler("oops, job not found", 404))
// }
// It checks if a job with the given ID exists in MongoDB using findById.

// If not found, return a 404 error.


// job = await Job.findByIdAndUpdate(id, req.body, {
//     new : true,
//     runValidators : true,
//     useFindAndModify : false
// })
// Now it updates the job using:

// req.body: The updated data sent from frontend or Postman.

// new: true: Returns the updated document instead of the old one.

// runValidators: true: Ensures all Mongoose validators (like required fields, enums) are enforced.

// useFindAndModify: false: Avoids deprecated MongoDB method usage.


// res.status(200).json({
//     success:true,
//     job,
//     message:"job updated successfully"
// })
// Finally, it sends a success response with the updated job.

// ✅ 2. deleteJob Function — Delete Job Posting
// 🔧 Function Purpose:
// This function deletes a job post from the database using its ID.

// 🔍 Step-by-Step Explanation:

// export const deleteJob = catchAsyncError(async(req, res, next)=>{
// Again, using catchAsyncError to handle errors without try-catch.


// const {role} = req.user;
// if (role == "Job Seeker"){
//     return next(new ErrorHandler("job seeker is not allowed to access this resource"))
// }
// Prevents Job Seekers from deleting jobs — only Employers can.


// const {id} = req.params;
// Gets the job ID from the URL:
// DELETE /api/v1/job/delete/:id


// let job = await Job.findById(id);
// if(!job){
//     return next(new ErrorHandler("oops job not found", 400))
// }
// Checks if the job with the given ID exists.


// job = await Job.deleteOne();
// ❌ This line is wrong. You're deleting any job, not the one found by ID.

// ✅ Fix this line:
// Replace it with:


// await job.deleteOne();
// ✅ This deletes the specific job document that was found earlier.


// res.status(200).json({
//     success:true,
//     message:"job deleted successfully"
// })
// Sends a success response.


// 🧠 How Data Is Handled Through DB (MongoDB):
// Job model is connected to MongoDB using Mongoose.

// Job.findById(), Job.findByIdAndUpdate() and job.deleteOne() interact with the MongoDB database.

// When user sends data via frontend or Postman:

// Express reads it from req.body

// The controller updates/deletes job documents based on req.params.id.

// Responses are sent back with JSON — this makes it ready for frontend usage.

// ✅ Summary Tips:
// Function	Checks Role	Checks Job Exists	DB Operation Used	Sends Response
// updateJob	Yes	Yes	findByIdAndUpdate()	Updated Job
// deleteJob	Yes	Yes	findById() + deleteOne()	Success Message



