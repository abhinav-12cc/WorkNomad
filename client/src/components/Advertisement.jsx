import React from "react";
import smartphoneImage from "../assets/Isolated_right_hand_with_smartphone 2.png";

const Advertisement = () => {
  return (
    <div
      className="relative w-[94%] mx-auto h-64 md:h-[16rem] flex items-center justify-center mt-14 rounded-lg overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1925&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay with slight blue tint */}
      <div 
        className="absolute inset-0" 
        style={{ 
          background: 'linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7))',
        }}
      />

      <div className="relative flex items-center max-w-[45rem] z-10 px-6">
        <div className="flex flex-col space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            Download the mobile application for bonus <br /> coupons and travel codes
          </h2>
          <button className="w-[14rem] py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors">
            Download mobile app
          </button>
        </div>
        <img
          src={smartphoneImage}
          alt="Smartphone"
          className="hidden md:block w-[45rem] object-contain ml-8"
        />
      </div>
    </div>
  );
};

export default Advertisement;
