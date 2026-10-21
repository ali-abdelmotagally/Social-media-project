import React from 'react'
import { NavLink } from 'react-router-dom'
import Register from './../Register/Register';

export default function Navbar() {
  return (
    <div className="w-[60%] mx-auto mt-2 h-12 bg-white border border-[#f1f1f1] rounded-3xl shadow-md shadow-[#dddcdc] p-4
    flex justify-between items-center">
      <h1>
     <NavLink 
      to='/home'
      className={({isActive}) => 
        isActive ? "border-b-2" : "hover:border-b-2"
      }
      >Home</NavLink></h1>

      <ul className="list-none flex gap-4">
  <li>
    <NavLink
      to="/register"
      className={({ isActive }) =>
        isActive ? "border-b-2" : "hover:border-b-2"
      }
    >
      Register
    </NavLink>
  </li>

  <li>
    <NavLink
      to="/login"
      className={({ isActive }) =>
        isActive ? "border-b-2" : "hover:border-b-2"
      }
    >
      Login
    </NavLink>
  </li>

  <li>
    <NavLink
      to="/about"
      className={({ isActive }) =>
        isActive ? "border-b-2" : "hover:border-b-2"
      }
    >
      About
    </NavLink>
  </li>

  <li>
    <NavLink
      to="/contact"
      className={({ isActive }) =>
        isActive ? "border-b-2" : "hover:border-b-2"
      }
    >
      Contact
    </NavLink>
  </li>
</ul>
</div>
  )}