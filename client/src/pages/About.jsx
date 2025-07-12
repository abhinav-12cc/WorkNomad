import React from 'react';
import { FaUsers, FaBuilding, FaGlobe, FaHandshake } from 'react-icons/fa';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About WorkNomad</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Empowering remote professionals with flexible workspace solutions and a thriving community.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600">
            To revolutionize the way professionals work by providing flexible, inspiring workspaces
            that foster collaboration, innovation, and productivity.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-gray-600">
            To create a global network of workspace solutions that enables professionals to work
            from anywhere while being part of a supportive community.
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-8">Why Choose WorkNomad</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-blue-600 text-2xl" />
            </div>
            <h3 className="font-semibold mb-2">Community First</h3>
            <p className="text-gray-600">Join a network of like-minded professionals</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBuilding className="text-blue-600 text-2xl" />
            </div>
            <h3 className="font-semibold mb-2">Premium Spaces</h3>
            <p className="text-gray-600">Work from carefully curated locations</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaGlobe className="text-blue-600 text-2xl" />
            </div>
            <h3 className="font-semibold mb-2">Nationwide Network</h3>
            <p className="text-gray-600">Access spaces across India</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHandshake className="text-blue-600 text-2xl" />
            </div>
            <h3 className="font-semibold mb-2">Flexible Terms</h3>
            <p className="text-gray-600">Choose plans that work for you</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div>
        <h2 className="text-3xl font-semibold text-center mb-8">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="font-semibold text-lg">John Doe</h3>
            <p className="text-gray-600">Founder & CEO</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="font-semibold text-lg">Jane Smith</h3>
            <p className="text-gray-600">Operations Director</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="font-semibold text-lg">Mike Johnson</h3>
            <p className="text-gray-600">Community Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
