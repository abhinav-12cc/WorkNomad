import React from "react";

const NextTrip = () => {
  const workspaceFeatures = [
    {
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      title: "Smart Workspace Solutions",
      description:
        "Find and book your perfect workspace instantly. Get access to premium coworking spaces, meeting rooms, and private offices...",
    },
    {
      image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      title: "Community & Networking",
      description:
        "Join a thriving community of remote professionals. Connect with like-minded individuals and grow your network...",
    },
    {
      image: "https://images.unsplash.com/photo-1517502166878-35c93a0072f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      title: "Flexible Booking Options",
      description:
        "Choose from daily passes to monthly memberships. Book instantly and get immediate access to your workspace...",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-14 px-4">
      <h1 className="text-3xl font-semibold mb-6 ml-[10px]">
        Why Choose WorkNomad
      </h1>
      <div className="flex flex-wrap gap-6 justify-center mt-14">
        {workspaceFeatures.map((feature, index) => (
          <div
            key={index}
            className="relative w-[24rem] h-[15rem] rounded-lg overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300"
          >
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 p-6 flex flex-col justify-end group-hover:bg-opacity-60 transition-all duration-300">
              <h2 className="text-white text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-gray-200 text-sm leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextTrip;
