// Footer.js
import React from "react";
import { FaLinkedin, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-10">
      <h2 className="text-3xl font-semibold text-gray-900 mt-8 text-center">
        Join the WorkNomad Community
      </h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Work</span>
              <span className="text-2xl font-bold text-gray-800">Nomad</span>
            </div>
            <p className="text-gray-600 mt-4">
              Empowering remote professionals with ideal workspaces and a thriving community
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-400">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-600">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <FaGithub size={24} />
              </a>
            </div>
          </div>

          {/* Workspace Solutions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Workspace Solutions
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Coworking Spaces
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Private Offices
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Coliving Spaces
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Virtual Offices
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Community
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Forum
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-center text-gray-600">
            {new Date().getFullYear()} WorkNomad. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
