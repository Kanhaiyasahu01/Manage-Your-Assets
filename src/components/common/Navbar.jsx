import React from 'react';
import { useSelector } from 'react-redux';
import { ProfileDropdown } from './ProfileDropdown';
import { Link } from 'react-router-dom';
import logo from "../../assets/logo-white.jpg";

export default function Navbar() {
  const { token } = useSelector((state) => state.auth);

  return (
    <div className="w-full flex justify-between items-center bg-richblue-600 text-white p-2 shadow-lg border-b-2 border-richblack-25">
      {/* LOGO Section */}
      <div className="flex items-center gap-2">
        <img 
          src={logo} 
          alt="LOGO" 
          className="w-10 h-10 transition-transform transform hover:scale-110 rounded-full"
        />
        <p className="font-inter text-2xl font-bold tracking-wide">
          <span className="text-3xl">A</span>SSET <span className="text-3xl">M</span>ATE
        </p>
      </div>

      {/* Login / Signup / Profile */}
      <div className="flex gap-4">
        {token === null ? (
          <>
            <Link to="/login">
              <button className="font-medium text-lg px-4 py-1 rounded-md bg-blue-200 text-blue-800 hover:bg-blue-300 transition duration-200">
                Log in
              </button>
            </Link>
            <Link to="/signup">
              <button className="font-medium text-lg px-4 py-1 rounded-md bg-blue-200 text-blue-800 hover:bg-blue-300 transition duration-200">
                Sign up
              </button>
            </Link>
          </>
        ) : (
          <ProfileDropdown />
        )}
      </div>
    </div>
  );
}
