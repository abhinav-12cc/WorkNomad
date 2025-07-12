import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosHeartEmpty } from "react-icons/io";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  console.log("This is the auth user", auth?.user);

  // Redirect logic
  const redirectDashboard = (e) => {
    e.stopPropagation();
    if (auth?.user?.role === "admin") {
      navigate("/admin/details");
    } else {
      navigate("/user");
    }
  };

  // Handle dropdown toggle
  const handleDropdownToggle = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Close dropdown when mouse leaves
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Handle logout logic
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
      {/* Brand Logo and Name */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center ml-[7rem]">
          <span className="text-2xl font-bold text-blue-600">Work</span>
          <span className="text-2xl font-bold text-gray-800">Nomad</span>
        </div>
      </div>

      {/* Navbar Links */}
      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>
        <Link to="/properties" className="text-gray-700 hover:text-blue-600">
          Workspaces
        </Link>
        <Link to="/about" className="text-gray-700 hover:text-blue-600">
          About
        </Link>
        <Link to="/query" className="text-gray-700 hover:text-blue-600">
          Contact Us
        </Link>
      </div>

      {/* Notification and Profile */}
      <div className="flex items-center space-x-4 mr-[9rem] relative">
        <IoIosHeartEmpty
          size={20}
          className="cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => navigate("/wishlist")}
        />
        <FaUser
          className="cursor-pointer"
          size={20}
          onClick={handleDropdownToggle}
        />
        {isDropdownOpen && (
          <div
            className="absolute right-0 mt-36 w-48 bg-white border border-gray-200 rounded shadow-lg z-50"
            onMouseLeave={closeDropdown}
          >
            <ul>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={redirectDashboard}
              >
                Your Profile
              </li>
              {auth?.user ? (
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Sign Out
                </div>
              ) : (
                <div
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Sign In
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
