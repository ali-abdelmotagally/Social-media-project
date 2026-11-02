
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthCotext";
import defaultPFP from "../../assets/defaultPFP.svg";
import LogoutModal from "../../LogoutModal/LogoutModal";

export default function Navbar() {
  const { userToken, setUserToken } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollUpButton, setShowScrollUpButton] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 300;

      setShowScrollUpButton((prev) =>
        prev === shouldShow ? prev : shouldShow
      );
    };

    function closeMenu(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", closeMenu);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  // Logout
function handleLogout() {
  localStorage.removeItem("userToken");
  setUserToken(null);
  setIsOpen(false);
  setShowLogoutModal(false);
  navigate("/login");
}
  // Navigation link styles
  const registerNavLinkStyle = ({ isActive }) =>
    `inline-block px-4 py-2 m-[-12px] rounded-full transition-colors ${
      isActive ? "bg-blue-200" : "hover:bg-blue-100"
    }`;

  const loginNavLinkStyle = ({ isActive }) =>
    `inline-block px-4 py-2 m-[-12px] rounded-full transition-colors ${
      isActive ? "bg-gray-300" : "hover:bg-gray-100"
    }`;

  return (
    <>
      <nav className="w-full flex items-center justify-between px-4 sticky top-0 z-1000 bg-white/50 backdrop-blur-xl">

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

      
        {!userToken && (
          <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-fit h-12 bg-white border border-[#f1f1f1] rounded-3xl shadow-md shadow-[#dddcdc] p-4 justify-between items-center">
            <ul className="list-none flex gap-8 mx-auto">
              <li>
                <NavLink to="/register" className={registerNavLinkStyle}>
                  Register
                </NavLink>
              </li>

              <li>
                <NavLink to="/login" className={loginNavLinkStyle}>
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
                    className="block px-4 py-2 hover:bg-blue-200 rounded-t-lg border-b border-gray-300"
                  >
                    Profile
                  </Link>

          <button
          type="button"
          onClick={() => {
          setIsOpen(false);
          setShowLogoutModal(true);
        }}
        className="cursor-pointer block w-full text-left px-4 py-2 hover:bg-red-300 rounded-b-lg"
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

      {/* Scroll-up button */}
      {showScrollUpButton && (
        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          aria-label="Scroll to top"
          className="cursor-pointer fixed bottom-4 right-4 z-50 flex items-center justify-center text-xl w-10 h-10 rounded-full bg-black text-white shadow-lg hover:bg-black/80 transition-colors animate-in fade-in slide-in-from-bottom-8 duration-500
          "
        >
          ↑
        </button>
      )}

        {showLogoutModal && (
  <LogoutModal
    onConfirm={handleLogout}
    onCancel={() => setShowLogoutModal(false)}
   />
  )}
    </>
  );
}
