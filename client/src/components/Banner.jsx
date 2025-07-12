import React, { useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser } from "react-icons/fa";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { useSearch } from "../context/Serach";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useSearch();

  const handelSerach = async (e) => {
    e.preventDefault();
    if (!search.keyword) {
      console.error("Search keyword is missing");
      return;
    }
    try {
      // Convert spaces to underscores for category names
      const searchTerm = search.keyword.toLowerCase().includes('coworking') ? 'coworking' :
                        search.keyword.toLowerCase().includes('coliving') ? 'coliving' :
                        search.keyword.toLowerCase().includes('meeting rooms') ? 'meeting_rooms' :
                        search.keyword.toLowerCase().includes('business hall') ? 'business_hall' :
                        search.keyword;

      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/post/search?keyword=${encodeURIComponent(searchTerm)}`);
      
      navigate('/search', { 
        state: { 
          results: data.posts,
          keyword: search.keyword 
        } 
      });
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <div
      className="relative w-full h-[500px] bg-cover bg-center"
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')`,
        backgroundPosition: 'center 30%'
      }}
    >
      {/* Overlay with slightly less opacity for better readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-white h-full px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Your Perfect Remote Workspace Awaits
        </h1>
        <p className="text-base sm:text-lg mt-2 text-center">
          Discover curated coworking spaces, coliving options, and private offices designed specifically for remote developers and freelancers across India.
        </p>

        {/* Search Bar */}
        <form onSubmit={handelSerach} className="mt-8 w-full max-w-[57rem] sm:w-[80%] md:w-[60%]">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by city or category (e.g., Mumbai, Coworking)"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={search.keyword}
                onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Banner;
