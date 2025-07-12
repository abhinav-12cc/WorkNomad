import React, { useState } from "react";
import { FaImage } from "react-icons/fa";
import Navbar from "./Navbar";
import axios from "axios";
import { toast } from "react-toastify";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [facilities, setFacilities] = useState([]);
  const [nearbyArea, setNearbyArea] = useState("");
  const [category, setCategory] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [availability, setAvailability] = useState(true);
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);

  const facilityOptions = [
    { value: 'wifi', label: 'WiFi' },
    { value: 'canteen', label: 'Canteen' },
    { value: 'restrooms', label: 'Rest Rooms' },
    { value: 'lounge_area', label: 'Lounge Area' },
    { value: 'smoking_area', label: 'Smoking Area' },
    { value: 'printing_scanning', label: 'Printing & Scanning Services' },
    { value: 'parking', label: 'Parking' }
  ];

  const categoryOptions = [
    { value: 'coworking', label: 'Coworking' },
    { value: 'coliving', label: 'Coliving' },
    { value: 'meeting_rooms', label: 'Meeting Rooms' },
    { value: 'business_hall', label: 'Business Hall' }
  ];

  const handleFacilityChange = (facility) => {
    if (facilities.includes(facility)) {
      setFacilities(facilities.filter(f => f !== facility));
    } else {
      setFacilities([...facilities, facility]);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      toast.warn("You can only upload a maximum of 3 images.");
    } else {
      setImages(files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !location ||
      !description ||
      facilities.length === 0 ||
      !nearbyArea ||
      !category ||
      !capacity ||
      !price
    ) {
      return toast.error("All fields are required.");
    }

    if (images.length === 0 || images.length > 3) {
      return toast.error("Please upload 1-3 images.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("facilities", JSON.stringify(facilities));
    formData.append("nearbyArea", nearbyArea);
    formData.append("category", category);
    formData.append("capacity", capacity);
    formData.append("availability", availability);
    formData.append("price", price);

    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/post/create-post`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Post created successfully!");
      // Reset form
      setTitle("");
      setLocation("");
      setDescription("");
      setFacilities([]);
      setNearbyArea("");
      setCategory("");
      setCapacity(1);
      setAvailability(true);
      setPrice("");
      setImages([]);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(error.response?.data?.message || "Failed to create post.");
    }
  };

  return (
    <div className="flex justify-between text-black">
      <div className="ml-[4rem]">
        <Navbar />
      </div>
      <div className="flex flex-col p-8 w-[81%]">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[81%] p-3 border bg-white border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
          
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-[81%] bg-white p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-[81%] bg-white p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 h-32"
            required
          />

          <div className="w-[81%]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Facilities
            </label>
            <div className="grid grid-cols-2 gap-2 p-3 border border-gray-300 rounded bg-white">
              {facilityOptions.map((facility) => (
                <label key={facility.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={facilities.includes(facility.value)}
                    onChange={() => handleFacilityChange(facility.value)}
                    className="form-checkbox h-4 w-4 text-blue-500"
                  />
                  <span>{facility.label}</span>
                </label>
              ))}
            </div>
          </div>

          <input
            type="number"
            placeholder="Price (in RS)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-[81%] bg-white p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />

          <input
            type="text"
            placeholder="Nearby Area"
            value={nearbyArea}
            onChange={(e) => setNearbyArea(e.target.value)}
            className="w-[81%] bg-white p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />

          <div className="w-[81%]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2 p-3 border border-gray-300 rounded bg-white">
              {categoryOptions.map((cat) => (
                <label key={cat.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={category === cat.value}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-radio h-4 w-4 text-blue-500"
                  />
                  <span>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="w-[81%]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Capacity (number of people)
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              min="1"
              className="w-full bg-white p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="w-[81%]">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={availability}
                onChange={(e) => setAvailability(e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-500"
              />
              <span className="text-gray-700">Available</span>
            </label>
          </div>

          <div className="w-[81%]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Images (1-3)
            </label>
            <div className="flex items-center space-x-2">
              <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <FaImage className="text-gray-400 text-3xl" />
              </label>
              <div className="flex space-x-2">
                {images.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors w-[81%]"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
