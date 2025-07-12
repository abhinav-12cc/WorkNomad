import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaWifi } from 'react-icons/fa';

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/post/get-all-post`);
        setProperties(response.data.posts); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">All Available Workspaces</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
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
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{property.title}</h2>
              <div className="flex items-center mb-2 text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                <span>{property.hotelLocation}</span>
              </div>
              <div className="flex items-center mb-3 text-gray-600">
                <FaWifi className="mr-2" />
                <span className="text-sm">{property.facilities[0]}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {property.facilities.slice(1, 4).map((facility, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm"
                  >
                    {facility}
                  </span>
                ))}
                {property.facilities.length > 3 && (
                  <span className="text-blue-600 text-sm">+{property.facilities.length - 3} more</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllProperties;
