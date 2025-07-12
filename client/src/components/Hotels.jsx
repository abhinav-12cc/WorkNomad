import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaUsers } from "react-icons/fa";

const Hotels = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/post/get-all-post`);
        // Get 3 random properties
        const allProperties = response.data.posts;
        const shuffled = allProperties.sort(() => 0.5 - Math.random());
        setFeaturedProperties(shuffled.slice(0, 3));
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 mt-14">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Featured Workspaces</h1>
        <Link
          to="/properties"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredProperties.map((property) => (
          <Link
            to={`/product/${property.slug}`}
            key={property._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-48">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                ₹{property.price}/day
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {property.title}
              </h2>
              <div className="flex items-center mb-2 text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaUsers className="mr-2" />
                <span>Capacity: {property.capacity || 'Flexible'}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Hotels;
