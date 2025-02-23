"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import Link from "next/link";
import { FiPlus, FiImage, FiX } from 'react-icons/fi';
import Categories from "../components/Categories";

export default function CreateListingPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([""]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);


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
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("✨ Listing created successfully!");
        setTimeout(() => {
          router.push(`/profile`);
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

  const handleImageChange = (index, value) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const addImageField = () => {
    setImages([...images, ""]);
  };

  const removeImageField = (index) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
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
              {/* <select
              id="selectCategory"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
              value={selected}
              onChange={(e) => setCategories(e.target.value)}
              //className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              >
              <option className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" value="">No Data</option>
              {options.map((opt) => (
              <option className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select> */}
          {/* {selected && <p className="text-sm mt-2">You selected: {selected}</p>} */}
        </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Images
              </label>
              <div className="space-y-3">
                {images.map((img, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="flex-1 relative">
                      <FiImage className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                        placeholder="Enter image URL"
                        value={img}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                      />
                    </div>
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(idx)}
                        className="p-3 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <FiX size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiPlus /> Add another image
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Images
              </label>
              <div className="space-y-3">
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
