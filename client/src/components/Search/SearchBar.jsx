import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    try {
      // Convert spaces to underscores for category names
      const searchTerm = keyword.toLowerCase().includes('coworking') ? 'coworking' :
                        keyword.toLowerCase().includes('coliving') ? 'coliving' :
                        keyword.toLowerCase().includes('meeting rooms') ? 'meeting_rooms' :
                        keyword.toLowerCase().includes('business hall') ? 'business_hall' :
                        keyword;

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/post/search?keyword=${encodeURIComponent(searchTerm)}`);
      
      if (response.data.success) {
        navigate('/search', { 
          state: { 
            results: response.data.posts,
            keyword: keyword 
          } 
        });
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mt-8">
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by city or category (e.g., Mumbai, Coworking Space)"
            className="w-full px-4 py-3 pl-12 pr-4 text-gray-700 bg-white border rounded-lg focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          type="submit"
          className="ml-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
