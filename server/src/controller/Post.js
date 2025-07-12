import cloudinary from "../config/cloudinary.js";
import Post from "../models/Post.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";

export const createPostController = async (req, res) => {
  try {
    const {
      title,
      location,
      description,
      facilities,
      nearbyArea,
      category,
      capacity,
      availability,
      price,
    } = req.body;
    const files = req.files;

    // Validate required fields
    if (
      !title ||
      !description ||
      !facilities ||
      !nearbyArea ||
      !location ||
      !category ||
      !capacity ||
      !price
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate facilities
    const validFacilities = [
      'wifi',
      'canteen',
      'restrooms',
      'lounge_area',
      'smoking_area',
      'printing_scanning',
      'parking'
    ];
    
    const facilitiesArray = JSON.parse(facilities);
    if (!Array.isArray(facilitiesArray) || !facilitiesArray.every(facility => validFacilities.includes(facility))) {
      return res.status(400).json({ message: "Invalid facilities selected" });
    }

    // Validate category
    const validCategories = [
      'coworking',
      'coliving',
      'meeting_rooms',
      'business_hall'
    ];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category selected" });
    }

    // Validate images
    if (!files || !files.images) {
      return res.status(400).json({ message: "Please upload 1-3 images." });
    }

    let imageFiles = files.images;
    // Convert to array if single file
    if (!Array.isArray(imageFiles)) {
      imageFiles = [imageFiles];
    }

    if (imageFiles.length === 0 || imageFiles.length > 3) {
      return res.status(400).json({ message: "Please upload 1-3 images." });
    }

    // Upload images to Cloudinary
    const imageUrls = await Promise.all(
      imageFiles.map((file) =>
        cloudinary.uploader
          .upload(file.tempFilePath)
          .then((result) => result.secure_url)
      )
    );

    // Create new post
    const newPost = new Post({
      title,
      location,
      description,
      facilities: facilitiesArray,
      nearbyArea,
      category,
      capacity,
      availability,
      price,
      images: imageUrls,
    });

    // Save post to MongoDB
    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getPostController = async (req, res) => {
  try {
    const product = await Post.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

export const getAllPostController = async (req, res) => {
  try {
    const posts = await Post.find({}).populate("category");
    res.status(200).send({
      success: true,
      message: "All Products Fetched",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting all products",
      error,
    });
  }
};

export const updatePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      location,
      description,
      facilities,
      nearbyArea,
      category,
      capacity,
      availability,
      price,
    } = req.body;
    const files = req.files?.images;

    // Find the existing post
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Validate fields (optional for update)
    if (
      !title &&
      !location &&
      !description &&
      !facilities &&
      !nearbyArea &&
      !category &&
      !capacity &&
      availability === undefined &&
      !price &&
      !files
    ) {
      return res.status(400).json({ message: "No fields provided to update." });
    }

    // Handle image update
    let updatedImages = post.images;
    if (files && files.length > 0 && files.length <= 3) {
      // Delete old images from Cloudinary
      await Promise.all(
        post.images.map((url) => {
          const publicId = url.split("/").pop().split(".")[0];
          return cloudinary.uploader.destroy(publicId);
        })
      );

      // Upload new images
      updatedImages = await Promise.all(
        files.map((file) =>
          cloudinary.uploader
            .upload(file.tempFilePath)
            .then((result) => result.secure_url)
        )
      );
    } else if (files && (files.length === 0 || files.length > 3)) {
      return res
        .status(400)
        .json({ message: "Please upload 1-3 images." });
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(location && { location }),
        ...(description && { description }),
        ...(facilities && { facilities }),
        ...(nearbyArea && { nearbyArea }),
        ...(category && { category }),
        ...(capacity && { capacity }),
        ...(availability !== undefined && { availability }),
        ...(price && { price }),
        ...(files && { images: updatedImages }),
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Post updated successfully!", post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePostController = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.pid);
    res.status(200).send({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

export const relatedPostController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await Post.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-photo")
      .limit(2)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

export const postFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;

    // Build query object
    let args = {};
    if (checked?.length) args.capacity = { $in: checked }; // Match capacity
    if (radio?.length === 2) args.price = { $gte: radio[0], $lte: radio[1] }; // Match price range

    // Fetch filtered posts
    const products = await Post.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error while filtering products:", error);
    res.status(400).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

export const popularPostController = async (req, res) => {
  try {
    const popularPosts = await Post.find({}).sort({ views: -1 }).limit(5);

    res.status(200).send({
      success: true,
      message: "Top 5 popular posts fetched successfully",
      posts: popularPosts,
    });
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    res.status(500).send({
      success: false,
      message: "Error while fetching popular posts",
      error,
    });
  }
};

export const searchPosts = async (req, res) => {
  try {
    const { keyword } = req.query;
    
    const searchQuery = {
      $or: [
        { location: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } }
      ]
    };

    const posts = await Post.find(searchQuery)
      .select('-photo')
      .limit(12);

    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in search",
      error,
    });
  }
};
