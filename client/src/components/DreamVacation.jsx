import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image1 from "../assets/Post/Rectangle 8.png";
import Image2 from "../assets/Post/Rectangle 9.png";
import Image3 from "../assets/Post/Rectangle 10.png";
import Image4 from "../assets/Post/Rectangle 11.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DreamVacation = () => {
  const [category, setCategory] = useState([]);
  const navigation = useNavigate();
  console.log("Category", category);

  const getAllCategory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/category/get-category`
      );
      setCategory(response.data.category);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Images to associate with categories
  const categoryImages = [
    { name: "Coworking Spaces", image: Image1 },
    { name: "Private Offices", image: Image2 },
    { name: "Coliving Spaces", image: Image3 },
    { name: "Virtual Offices", image: Image4 },
  ];

  // Function to find the image for a category
  const getImageForCategory = (categoryName) => {
    const categoryImage = categoryImages.find(
      (item) => item.name === categoryName
    );
    return categoryImage ? categoryImage.image : Image1; // Default to first image if no match
  };

  return (
    <div className="flex flex-col mt-14 px-4 mx-auto max-w-screen-xl sm:ml-[175px]">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center sm:text-left sm:ml-0">
        Find Your Ideal Workspace
      </h1>
      <p className="text-gray-600 mb-8 text-center sm:text-left">
        Choose from our diverse range of workspace solutions tailored for remote professionals
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {category.map((cat) => (
          <div
            key={cat._id}
            onClick={() => navigation(`/category/${cat.slug}`)}
            className="relative cursor-pointer group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <img
              src={getImageForCategory(cat.name)}
              alt={cat.name}
              className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300">
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-xl font-semibold">{cat.name}</h3>
                <p className="text-white text-sm mt-1">
                  {cat.properties?.length || 0} spaces available
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DreamVacation;
