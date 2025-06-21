import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();
  useEffect(() => {
    try {
      axios
        .get("http://localhost:5000/api/v1/job/getall", {
          withCredentials: true,
        })
        .then((res) => {
          setJobs(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  if (!isAuthorized) {
    navigateTo("/login");
  }

  return (
    <section className="jobs page">
      <div className="container">
        <h1>ALL AVAILABLE JOBS</h1>
        <div className="banner">
          {jobs.jobs &&
            jobs.jobs.map((element) => {
              return (
                <div className="card" key={element._id}>
                  <p>{element.title}</p>
                  <p>{element.category}</p>
                  <p>{element.country}</p>
                  <Link to={`/job/${element._id}`}>Job Details</Link>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Jobs;






// ✅ Big Picture: How Data Flows    =====>         (in  jobs.js   and postjobs.js)
// Step	Action	Who Does It?	What Happens
// 1	User fills job form	PostJob.jsx	Sends data to backend via axios.post(...)
// 2	Backend receives job data	Express API	Saves the job to database (MongoDB)
// 3	User navigates to jobs list	Jobs.jsx	Calls axios.get(...) to fetch all jobs
// 4	Jobs are displayed	Jobs.jsx	Uses .map() to show them on the screen

// ✅ Let's Dive into Each Step
// 🟩 1. Posting the Job (in PostJob.jsx)
// You send job data like this:

// js
// Copy
// Edit
// await axios.post("http://localhost:5000/api/v1/job/post", { ...jobData }, {
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
// This request hits the backend route /api/v1/job/post.

// 🔧 On the backend, this POST route should take the data and save it in MongoDB (or whatever DB you’re using) using a Mongoose model like:

// js
// Copy
// Edit
// await Job.create({ title, description, ... });
// ✅ Once this job is saved, it exists in your database.

// 🟩 2. Fetching All Jobs (in Jobs.jsx)
// When the Jobs component loads:

// js
// Copy
// Edit
// useEffect(() => {
//   axios.get("http://localhost:5000/api/v1/job/getall", { withCredentials: true })
//     .then((res) => {
//       setJobs(res.data); // updates React state with jobs from backend
//     });
// }, []);
// This calls the backend's GET route: /api/v1/job/getall

// 🔧 On the backend, this route should look like:

// js
// Copy
// Edit
// const jobs = await Job.find(); // fetches all jobs from MongoDB
// res.status(200).json({ jobs });
// ✅ This returns all jobs, including the new one just posted, because it was saved in the same database.

// 🟩 3. Rendering All Jobs
// After setJobs(res.data) runs, the component re-renders. You use:

// js
// Copy
// Edit
// jobs.jobs.map((element) => {
//   return (
//     <div className="card" key={element._id}>
//       <p>{element.title}</p>
//       ...
//     </div>
//   );
// });
// ✅ This loops through each job in the array and renders them on the screen.

// ✅ Why It Works Automatically
// You might be confused:

// “I didn’t tell the Jobs component that I added a job — how does it show up?”

// That's the beauty of client-server architecture!

// The Jobs component doesn’t know what happened in PostJob.

// It just calls the backend: “Give me all jobs you have.”

// Since the new job is now saved in the database, the backend includes it in the response.

// ➡️ So there's no need to manually pass job data between pages. The database is the single source of truth.

// 📦 Summary in Simple Terms
// PostJob.jsx
// 📝 → ✉️ Sends job info →
// Backend
// 💾 Saves job to DB →
// Jobs.jsx
// 🔍 Requests all jobs from DB →
// 👀 Displays them with .map()

