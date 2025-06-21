import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import cloudinary from "cloudinary";

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer not allowed to access this resource.", 400)
    );
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume File Required!", 400));
  }

  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(
      new ErrorHandler("Invalid file type. Please upload a PNG file.", 400)
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    resume.tempFilePath
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
  }
  const { name, email, coverLetter, phone, address, jobId } = req.body;
  const applicantID = {
    user: req.user._id,
    role: "Job Seeker",
  };
  if (!jobId) {
    return next(new ErrorHandler("Job not found!", 404));
  }
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  const employerID = {
    user: jobDetails.postedBy,
    role: "Employer",
  };
  if (
    !name ||
    !email ||
    !coverLetter ||
    !phone ||
    !address ||
    !applicantID ||
    !employerID ||
    !resume
  ) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }
  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
});

export const employerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);










//..............................code explaiantion...............................................................


// 📁 File Overview
// This controller handles Job Applications:

// Who can submit (Job Seekers),

// Who can view (Employers or Job Seekers themselves),

// And deletion of applications.

// You’re using:

// catchAsyncError: to catch and forward async errors.

// ErrorHandler: to return errors in a standard way.

// Applicationnn and Job: Mongoose models.

// cloudinary: to upload resume files.

// ✅ 1. employerGetAllApplication
// 🧠 What it does:
// Allows employers to get all applications that were submitted for their jobs.

// 📦 Frontend Request:

// GET /api/application/employer/getall
// // with token => req.user populated by auth middleware
// 🔧 Backend Logic:

// const {role} = req.user;
// Gets the user role from token (set by isAuthorized middleware).


// if(role == "Job Seeker") return error;
// Job seekers are denied access.

// const {_id} = req.user;
// const applications = await Applicationnn.find({"employerID.user":_id});
// Fetch all applications where employerID.user matches current user ID.

// 📤 Response:
// Returns list of applications sent to this employer.

// ✅ 2. jobseekerGetAllApplication
// 🧠 What it does:
// Allows job seekers to view the applications they submitted.

// 📦 Frontend Request:

// GET /api/application/jobseeker/getall
// // with token => req.user populated
// 🔧 Backend Logic:

// if(role == "Employer") return error;
// Employers aren't allowed to access this.

// const applications = await Applicationnn.find({"applicantID.user":_id});
// Finds all applications where current user is the applicant.

// 📤 Response:
// Returns list of applications submitted by the job seeker.

// ✅ 3. jobseekerDeleteApplication
// 🧠 What it does:
// Allows job seekers to delete their own submitted application.

// 📦 Frontend Request:

// DELETE /api/application/jobseekerdelete/:id
// // where :id = application ID
// 🔧 Backend Logic:

// const {id} = req.params;
// const application = await Applicationnn.findById(id);
// Finds application by ID.


// if(!application) return error;
// await Applicationnn.deleteOne();
// If found, deletes it. (❗Small bug: deleteOne() should pass the filter. Use Applicationnn.findByIdAndDelete(id) instead)

// 📤 Response:
// Confirmation message with deleted application details.





// ✅ Full Explanation – Line by Line: of 4th function

// export const postApplication = catchAsyncError(async(req, res, next)=>{
// This is an Express.js route controller function wrapped in catchAsyncError, a middleware that catches any errors inside async functions and passes them to your global error handler.


// const {role} = req.user;
// if(role == "Employer"){
//     return next(new ErrorHandler("employer dont have access to this resource"))
// }
// Only Job Seekers are allowed to submit applications.

// If the user is an Employer, return a 400 Bad Request with a message.


// if(!req.files || Object.keys(req.files).length === 0){
//     return next(new ErrorHandler("Resume file required", 400))
// }
// Check if the request contains any uploaded files.

// If not, return an error saying the resume is required.


// const {resume} = req.files;
// const allowedFormates = ["image/png", "image/jpg", "image/webp"];
// if(!allowedFormates.includes(resume.mimetype)){
//     return next(new ErrorHandler("invalid file type!. please provide resume in png, jpg nd webp formate only", 400))
// }
// Destructure the uploaded resume file.

// Validate the file MIME type. Only PNG, JPG, WEBP files are allowed.

// If it’s an invalid format → send a 400 error.


// const cloudinaryResponse = await cloudinary.uploader.upload(
//     resume.tempFilePath
// );
// Upload the file to Cloudinary (a cloud-based image and file hosting service).

// It uses the tempFilePath generated by the file upload middleware (like express-fileupload or multer).

// ❓What is Cloudinary doing here?
// Cloudinary uploads the file from your server to the cloud and returns the file's public URL and a public_id you can use to manage it (view, delete, etc.).


// if(!cloudinaryResponse || cloudinaryResponse.error){
//     console.error("cloudinary error:", cloudinaryResponse.error || "unknown cloudinary error")
//     return next(new ErrorHandler("Faoled to upload resume", 500))
// }
// Check if the Cloudinary upload succeeded.

// If not, log the error and return a 500 (internal server error).


// const {name, email, coverLetter, phone, address, jobId} = req.body;
// const applicantID = {
//     user:req.user._id,
//     role:"Job Seeker"
// }
// Extract data sent by the user from the request body.

// Save the user’s ID and role in applicantID.


// if(!jobId){
//     return next(new ErrorHandler("Job not found", 404));
// }
// If jobId is missing in the request body → return a 404.


// const jobDetails = await Job.findById(jobId);
// if(!jobDetails){
//     return next(new ErrorHandler("job not found", 404))
// }
// Query the database to find the job with this ID.

// If the job doesn't exist → return a 404.

// const employerID = {
//     user: jobDetails.postedBy,
//     role:"Employer"
// }
// Extract the postedBy field (Employer's ID) from the job.

// Save that as employerID.


// if(!name || !email || !coverLetter || !address || !phone ||!employerID || !applicantID || !resume){
//     return next(new ErrorHandler("please fill all field", 400))
// }
// Final validation: ensure all required fields are present.

// If anything is missing, send a 400 error.


// const application = await Applicationnn.create({
//     name,
//     email,
//     coverLetter,
//     address,
//     phone,
//     employerID,
//     applicantID,
//     resume:{
//         public_id: cloudinaryResponse.public_id,
//         url: cloudinaryResponse.secure_url
//     }
// })
// Save the application in the Applicationnn collection.

// Store applicant/employer info, text fields, and Cloudinary resume file (URL + public_id).


// res.status(200).json({
//     success:true,
//     message: "application submitted successfully",
//     application       
// })
// Send a success response with the created application data.

// ✅ Purpose:
// It handles job application submission by a Job Seeker.

// ✅ Main Steps:
// Validates that only Job Seekers can apply.

// Verifies that a resume file is attached and valid.

// Uploads the resume to Cloudinary.

// Fetches the related job and employer.

// Validates form fields.

// Saves the application in the database with all required info.

// Responds with success if everything goes fine.

// 🙋 Who is Responsible for this Function?
// ✅ Job Seeker (Applicant)

// Only the Job Seeker can trigger this function.

// Employer has no access to it and is blocked by a role check at the start.


// fourth function end here



// ☁️ What is Cloudinary doing?
// Cloudinary stores media files like images, videos, PDFs.

// You upload a resume via the API → Cloudinary saves it.

// It returns a public_id (used to delete it later) and secure_url (to show/download file).

// The uploaded file is public by default unless you configure privacy in Cloudinary settings.

// 👤 Who uses each function?
// Function	Used by	Purpose
// postApplication	✅ Job Seeker	Submit application
// jobseekerGetAllApplication	✅ Job Seeker	View own applications
// jobseekerDeleteApplication	✅ Job Seeker	Delete submitted application
// employerGetAllApplication	✅ Employer	View all received applications

// 💬 Summary in simple terms
// This controller is the brain for job application features:

// Employers can view applications sent to them.

// Job Seekers can submit, view, and delete their own applications.

// Resume files are uploaded to Cloudinary (online file storage).

// Mongoose is used to store all application data in MongoDB.

// Middleware handles roles and async errors.



// If you're building the frontend:

// A job seeker logs in, selects a job, fills a form, uploads resume → postApplication.

// They can go to "My Applications" → call jobseekerGetAllApplication.

// Can delete an application → call jobseekerDeleteApplication.

// Employers can go to "Received Applications" → call employerGetAllApplication.






