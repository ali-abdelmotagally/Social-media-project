import React from "react";
import { Navigate } from "react-router-dom";


// Now that we've built the Register and Login pages, imagine a user changes the path manually by typing "/path" in the url.
// for example, when an unlogged user might type "/home", which they normally shouldn't access, they will be directed to it.
// this is NOT actually handled by the react-router, we need to manually handle it using what's called a "Protected Route".

 export default function ProtectedRoute({children}) {

  if (localStorage.getItem("userToken")) {
    return children;
  }

  return <Navigate to="/login"/>; // this is different from the useNavigate() hook, this redirects the user to the login page and changes the path to the login page automatically instead of staying at /home.
}
