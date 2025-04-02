"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import Link from "next/link";
import { FiPlus, FiImage, FiX } from 'react-icons/fi';
import Categories from "../components/Categories";
import Map from "../../../components/Map";
import axios from 'axios';

export default function CreateListingPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState([]);

  useEffect(() => {
      async function fetchCategories() {
        try {
          const res = await fetch('/api/categories');
          if (!res.ok) {
            throw new Error('Failed to fetch categories');
          }
          const data = await res.json();
          setCategories(data);
        } catch (error) {
          console.error(error);
        }
      }
  
      fetchCategories();
    }, []);
  
    const handleCategoryChange = (e) => {
      const categoryId = e.target.value;
      setSelectedCategory(categoryId);
      setSelectedTags([]);
    };
  
    const handleTagChange = (e) => {
      const tag = e.target.value;
      if (e.target.checked) {
        setSelectedTags((prev) => [...prev, tag]);
      } else {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
      }
    };
  
    const selectedCategoryData = categories.find((cat) => cat._id === selectedCategory);
  
  //add get categories and tags
  
  if (!user || !user.token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">You must be logged in to create a listing.</p>
          <Link 
            href="/auth/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
          >
            Sign in to Continue
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          title,
          description,
          selectedCategory,
          selectedTags,
          images: images.filter(img => img.trim() !== ""),
          location: {
            type: "Point",
            coordinates: [selectedCoords[0], selectedCoords[1]], 
          }
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("✨ Listing created successfully!");
        setTimeout(() => {
          router.push(`/dashboard`);
        }, 2000);
      } else {
        setMessage(data.error || "Failed to create listing");
      }
    } catch (error) {
      console.error("Create listing error:", error);
      setMessage("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file selection and upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Barter'); // Replace with your Cloudinary upload preset

    try {
      setUploading(true);
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/ddpmfo9ey/image/upload',
        formData
      );

      setImages([...images, response.data.secure_url]); // Store Cloudinary URL
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Remove an image from the list
  const removeImage = (index) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleLocationSelect = (coords) => {
    setSelectedCoords(coords);
    console.log(coords)
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Create Your Listing
          </h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Share your item with the community
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {message && (
            <div className={`p-4 text-center font-medium ${
              message.includes("success") 
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                placeholder="What are you listing?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all min-h-[150px]"
                placeholder="Describe your item in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Categories</label>
              <div className="space-y-4">
      {/* Category Selector */}
      <div className="flex items-center gap-4">
        
        <select
          className="w-auto px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
          onChange={handleCategoryChange}
          value={selectedCategory || ''}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags Selection (Horizontal) */}
      {selectedCategoryData && (
        <div>
          <h3 className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Tags:</h3>
          <div className="mt-2 p-2 bg-gray-800 text-white border border-gray-600 rounded-md flex flex-wrap gap-4">
            {selectedCategoryData.tags.map((tag) => (
              <label key={tag} className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={handleTagChange}
                  className="accent-purple-500"
                />
                {tag}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
    
    </div>


        <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Images
        </label>
        <div className="space-y-3">
          {images.map((img, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <img src={img} alt={`Uploaded ${idx}`} className="w-16 h-16 rounded-lg" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="imageUpload" />
            <label
              htmlFor="imageUpload"
              className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiPlus /> {uploading ? 'Uploading...' : 'Upload Image'}
            </label>
          </div>
        </div>
      </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <div className="space-y-3">
              <Map onSelectLocation={handleLocationSelect} /> 

              {selectedCoords && (
                <p>Selected Coordinates: {selectedCoords[0]}, {selectedCoords[1]}</p>
              )}
            </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-lg text-white font-medium text-lg
                ${isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-0.5'
                } transition-all duration-200 shadow-lg hover:shadow-xl`}
            >
              {isSubmitting ? 'Creating...' : 'Create Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
