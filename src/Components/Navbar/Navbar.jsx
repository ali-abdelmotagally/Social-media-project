import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthCotext";
import defaultPFP from "../../assets/defaultPFP.svg";


export default function Navbar() {
  const { userToken, setUserToken } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function closeMenu(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeMenu);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("userToken");
    setUserToken(null);
    setIsOpen(false);
    navigate("/login");
  }

  const navLinkStyle = ({ isActive }) =>
  `inline-block px-4 py-2 m-[-12px] rounded-full transition-colors ${
    isActive ? "bg-gray-300" : "hover:bg-gray-100"
  }`;

  return (
    <nav className="w-full flex items-center justify-between px-4 sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Logo */}
      <Link
        to="/home"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        className="text-[2.5rem] font-bold block"
      >
        LinkUp
      </Link>

      {/* Register/Login: visible on web, hidden on mobile */}
     {!userToken && (
  <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-fit h-12 bg-white border border-[#f1f1f1] rounded-3xl shadow-md shadow-[#dddcdc] p-4 justify-between items-center">
    <ul className="list-none flex gap-8 mx-auto">
      <li>
        <NavLink to="/register" className={navLinkStyle}>
          Register
        </NavLink>
      </li>

      <li>
        <NavLink to="/login" className={navLinkStyle}>
          Login
        </NavLink>
      </li>
    </ul>
  </div>
)}

      {/* Profile menu */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          className="w-10 h-10 rounded-full border-2 overflow-hidden opacity-80 hover:opacity-100 transition-opacity"
          aria-label="Open profile menu"
          aria-expanded={isOpen}
        >
          <img
            src={defaultPFP}
            alt="Profile"
            className="w-10 h-10 object-cover rounded-full cursor-pointer"
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white border border-[#f1f1f1] rounded-lg shadow-md">
            {userToken ? (
              <>
                <Link
                  to="/Profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 hover:bg-blue-200 rounded-t-lg"
                >
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-red-300 rounded-b-lg"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 hover:bg-blue-200 rounded-t-lg"
                >
                  Register
                </Link>

                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-300 rounded-b-lg"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}