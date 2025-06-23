import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "https://job-seeking-mern-app-8ujq.vercel.app/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message), setIsAuthorized(true);
    }
  };

  return (
    <nav className={isAuthorized ? "navbarShow" : "navbarHide"}>
      <div className="container">
        <div className="logo">
          <img src="/JobZee-logos__white.png" alt="logo" />
        </div>
        <ul className={!show ? "menu" : "show-menu menu"}>
          <li>
            <Link to={"/"} onClick={() => setShow(false)}>
              HOME
            </Link>
          </li>
          <li>
            <Link to={"/job/getall"} onClick={() => setShow(false)}>
              ALL JOBS
            </Link>
          </li>
          <li>
            <Link to={"/applications/me"} onClick={() => setShow(false)}>
              {user && user.role === "Employer"
                ? "APPLICANT'S APPLICATIONS"
                : "MY APPLICATIONS"}
            </Link>
          </li>
          {user && user.role === "Employer" ? (
            <>
              <li>
                <Link to={"/job/post"} onClick={() => setShow(false)}>
                  POST NEW JOB
                </Link>
              </li>
              <li>
                <Link to={"/job/me"} onClick={() => setShow(false)}>
                  VIEW YOUR JOBS
                </Link>
              </li>
            </>
          ) : (
            <></>
          )}

          <button onClick={handleLogout}>LOGOUT</button>
        </ul>
        <div className="hamburger">
          <GiHamburgerMenu onClick={() => setShow(!show)} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;








// ................................code explaination.............................................................



// 🔁 IMPORTS SECTION

// import React, { useContext, useEffect, useState } from "react";
// import { Context } from "../../main";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { GiHamburgerMenu } from "react-icons/gi";
// ✅ What it does:
// React imports useState, useContext, etc.

// Context is your global context (most likely from main.jsx or similar) to manage authentication and user data.

// Link and useNavigate are from react-router-dom for navigation without page reloads.

// axios is used for making HTTP requests.

// toast is used to show notification messages.

// GiHamburgerMenu is a hamburger menu icon from react-icons.

// 📦 COMPONENT DECLARATION

// const Navbar = () => {
// This declares a React functional component named Navbar.

// 🧠 STATE AND CONTEXT

// const [show, setShow] = useState(false);
// const { isAuthorized, setIsAuthorized, user } = useContext(Context);
// const navigateTo = useNavigate();
// ✅ What it does:
// show: controls whether the mobile menu is shown or hidden (true shows menu).

// useContext(Context): accesses global state from context (e.g. user, isAuthorized).

// navigateTo: function to navigate programmatically (like window.location.href, but better in SPA).

// 🔐 LOGOUT HANDLER

// const handleLogout = async () => {
//   try {
//     const response = await axios.get(
//       "http://localhost:4000/api/v1/user/logout",
//       {
//         withCredentials: true,
//       }
//     );
//     toast.success(response.data.message);
//     setIsAuthorized(false);
//     navigateTo("/login");
//   } catch (error) {
//     toast.error(error.response.data.message), setIsAuthorized(true);
//   }
// };
// ✅ What it does:
// Sends GET request to logout route.

// If successful:

// Shows success toast.

// Sets isAuthorized to false (so user is logged out).

// Navigates to login page.

// If failed:

// Shows error toast.

// Still keeps isAuthorized as true.

// 🧭 RETURN - JSX RENDERING

// return (
//   <nav className={isAuthorized ? "navbarShow" : "navbarHide"}>
// Shows navbar only if isAuthorized is true.

// navbarShow and navbarHide are likely CSS classes.

// 📦 NAV CONTENT

//   <div className="container">
//     <div className="logo">
//       <img src="/JobZee-logos__white.png" alt="logo" />
//     </div>
// Contains the logo image.

// 📃 MENU ITEMS

//     <ul className={!show ? "menu" : "show-menu menu"}>
// Shows/hides the menu based on show state.

// In mobile view, toggling hamburger icon sets show.

// 🏠 ROUTING LINKS

//       <li>
//         <Link to={"/"} onClick={() => setShow(false)}>HOME</Link>
//       </li>
//       <li>
//         <Link to={"/job/getall"} onClick={() => setShow(false)}>ALL JOBS</Link>
//       </li>
//       <li>
//         <Link to={"/applications/me"} onClick={() => setShow(false)}>
//           {user && user.role === "Employer"
//             ? "APPLICANT'S APPLICATIONS"
//             : "MY APPLICATIONS"}
//         </Link>
//       </li>
// These are navigation links.

// Depending on user’s role, shows either:

// "MY APPLICATIONS" (for candidates)

// "APPLICANT'S APPLICATIONS" (for employers)

// 💼 EMPLOYER-SPECIFIC ROUTES

//       {user && user.role === "Employer" ? (
//         <>
//           <li>
//             <Link to={"/job/post"} onClick={() => setShow(false)}>
//               POST NEW JOB
//             </Link>
//           </li>
//           <li>
//             <Link to={"/job/me"} onClick={() => setShow(false)}>
//               VIEW YOUR JOBS
//             </Link>
//           </li>
//         </>
//       ) : (
//         <></>
//       )}
// These routes are only visible to users with role "Employer":

// Posting new jobs.

// Viewing their posted jobs.

// 🔓 LOGOUT BUTTON

//       <button onClick={handleLogout}>LOGOUT</button>
// Triggers handleLogout function.

// 🍔 HAMBURGER MENU ICON

//     </ul>
//     <div className="hamburger">
//       <GiHamburgerMenu onClick={() => setShow(!show)} />
//     </div>
//   </div>
// </nav>
// Hamburger icon for small screens.

// On click, it toggles show state to open/close mobile menu.

// 🔁 FLOW SUMMARY
// Navbar loads.

// Checks if user is isAuthorized.

// If not, hides navbar.

// If user is authorized:

// Shows links based on user.role.

// Displays logout.

// Hamburger toggle works for mobile view.

// Logout makes request to backend, clears auth, redirects.

// ✅ Functions Used and Their Purpose
// Function / Hook	Purpose
// useState	For managing internal component state (show)
// useContext	To access global context (auth/user info)
// useNavigate	For programmatic routing/navigation
// axios.get()	To call logout API
// toast.success/error	To show user feedback after logout success/failure
// <Link>	React Router's way to navigate without page refresh
// GiHamburgerMenu	Displays hamburger icon (used for mobile menu toggle)










