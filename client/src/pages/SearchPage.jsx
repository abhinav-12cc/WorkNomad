import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FaMapMarkerAlt, FaWifi } from "react-icons/fa";

const SearchPage = () => {
  const location = useLocation();
  const { results = [], keyword = "" } = location.state || {};

  if (!results || results.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Results Found</h2>
        <p className="text-gray-500 mb-4">
          No properties found for "{keyword}". Try a different search term.
        </p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Search Results</h1>
      <p className="text-gray-600 mb-8 text-center">
        Found {results.length} properties for "{keyword}"
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((property) => (
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
                <span>{property.location}</span>
              </div>
              <div className="flex items-center mb-3 text-gray-600">
                <FaWifi className="mr-2" />
                <span className="text-sm capitalize">{property.category.replace('_', ' ')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {property.facilities.slice(0, 3).map((facility, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm capitalize"
                  >
                    {facility.replace('_', ' ')}
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

export default SearchPage;
