import React, { useEffect, useContext } from 'react';
import "./App.css";
import { Context } from './main';
import Login from './components/Auth/login';
import Register from './components/Auth/register';
import Navbar from './components/Layout/navbar';
import Footer from './components/Layout/footer';
import Home from './components/Home/home';
import Jobs from './components/Job/jobs';
import JobDetails from './components/Job/jobDetails';
import MyJobs from './components/Job/myJobs';
import PostJobs from './components/Job/postJobs';
import Application from './components/Application/application';
import MyApplications from './components/Application/myApplications';
import NotFound from './components/NotFound/notFound';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const App = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://job-seeking-mern-app-8ujq.vercel.app/api/v1/user/getuser",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, [isAuthorized]);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/job/getall" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/application/:id" element={<Application />} />
          <Route path="/applications/me" element={<MyApplications />} />
          <Route path="/job/post" element={<PostJob />} />
          <Route path="/job/me" element={<MyJobs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster />
      </Router>
    </>
  );
};

export default App;




// ..............................explaination of App function..................................................


// 🧠 Let’s Break It Down
// ✅ 1. useContext(Context)

// const [isAuthorized, setIsAuthorized, setUser] = useContext(Context);
// This line is trying to extract values from your global Context, which you likely defined like this:

// <Context.Provider value={{ isAuthorized, setIsAuthorized, user, setUser }}>
// ❌ Problem: You're destructuring incorrectly!

// It should be:


// const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
// You need to destructure the object, not use array destructuring.

// ✅ 2. What is useEffect?

// useEffect(() => {
//   // some code
// }, [isAuthorized]);
// useEffect is a React hook used for side effects, such as:

// API calls

// Event listeners

// Timers

// Local storage access

// It runs after the component mounts or updates, depending on the dependency array.

// In your case:

// useEffect(() => {
//   fetchUser();
// }, [isAuthorized]);
// This means:

// fetchUser will run whenever isAuthorized changes.

// But also note: on first render, isAuthorized is false, so it runs once on mount too.

// ⚠️ Warning: This could cause an infinite loop! More on that in a second.

// ✅ 3. fetchUser Function
// This function makes an HTTP request to fetch user info (like profile data or session info):


// const response = await axios.get("", { withCredentials: true });
// axios.get(""): This is an API call — but the URL is missing!

// You should put something like /api/v1/me or /user here.

// { withCredentials: true }: Sends cookies/session tokens with the request

// Required for auth with cookies (e.g., using JWT stored in cookies)

// ✅ On Success:
// js
// Copy
// Edit
// setUser(response.data.user);
// setIsAuthorized(true);
// Saves the user info in state

// Marks the user as logged in (true)

// ❌ On Failure:

// setIsAuthorized(false);
// Means the user is not authenticated (no valid session/token)

// 🔐 How Authorization Works Here
// Step	What happens
// 1.	Component mounts
// 2.	useEffect runs fetchUser()
// 3.	axios.get() tries to get current user info from backend
// 4.	If request succeeds, user is logged in → update state
// 5.	If request fails, mark as not logged in

// This is a session check pattern. It auto-logs in users if they have a valid session/cookie.




