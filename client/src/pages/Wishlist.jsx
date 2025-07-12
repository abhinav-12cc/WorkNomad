import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaWifi, FaHeart } from 'react-icons/fa';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistItems(items);
  }, []);

  const removeFromWishlist = (propertyId) => {
    const updatedWishlist = wishlistItems.filter(item => item._id !== propertyId);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setWishlistItems(updatedWishlist);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <FaHeart className="text-6xl text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-4">Start adding workspaces you like!</p>
        <Link 
          to="/properties" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Browse Workspaces
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Wishlisted Workspaces</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((property) => (
          <div 
            key={property._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
          >
            <button
              onClick={() => removeFromWishlist(property._id)}
              className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition"
            >
              <FaHeart className="text-red-500" />
            </button>
            <Link to={`/product/${property.slug}`}>
              <div className="relative h-48">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
