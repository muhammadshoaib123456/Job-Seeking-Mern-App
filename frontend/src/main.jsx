import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

export const Context = createContext({
  isAuthorized: false,
});

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});

  return (
    <Context.Provider
      value={{
        isAuthorized,
        setIsAuthorized,
        user,
        setUser,
      }}
    >
      <App />
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);







// 🔍 Now, Let’s Understand the Code

// import { createContext, StrictMode, useState } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
// createContext: Used to create a context.

// StrictMode: Helps catch potential problems in an application (only during development).

// useState: React hook to manage state.

// createRoot: React 18+ way to render your app.

// App: Main app component.

// 📦 Context Definition

// export const Context = createContext({isAuthorized:false});
// This creates a context with default value { isAuthorized: false }.

// You’ll use this context in child components to access or change isAuthorized or user.

// 🔁 AppWrapper Component

// const AppWrapper = ()=>{
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [user, setUser] = useState({});

//   return(
//     <Context.Provider value={{isAuthorized, setIsAuthorized, user, setUser}}> 
//       <App />
//     </Context.Provider>
//   )
// }
// useState(false) → holds whether the user is logged in.

// useState({}) → holds the user object (e.g., name, email).

// Context.Provider makes these values available to any component inside <App />.

// So any component inside App can now consume isAuthorized, user, or update them via setIsAuthorized or setUser.

// 🧱 Render Root

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <AppWrapper/>
//   </StrictMode>,
// )
// This renders the AppWrapper (and inside it, the App component) into the HTML <div id="root">.

// StrictMode is a helper for identifying issues in development.

// 🧠 How to Use the Context in Other Components
// In any component under App, you can do:


// import { useContext } from 'react'
// import { Context } from './path/to/context'

// const MyComponent = () => {
//   const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);

//   return (
//     <div>
//       {isAuthorized ? `Welcome ${user.name}` : "Please log in"}
//     </div>
//   );
// };
// 🧾 Summary
// Concept	Explanation
// createContext()	Creates a context object
// Context.Provider	Wraps components to give them access to context values
// useContext()	Hook used inside components to access context values
// useState()	Hook to hold and manage component state
// StrictMode	Tool to highlight potential issues in development
// createRoot()	React 18+ method for rendering the root of the app
// AppWrapper	A wrapper component that sets up shared state and provides it to <App />

// 🔚 Final Thought
// React Context is perfect for global state sharing when your app grows and prop-passing becomes messy.
//  For larger apps with complex state logic, libraries like Redux or Zustand might be better. But for auth, 
//  theme, language, etc., Context is ideal.