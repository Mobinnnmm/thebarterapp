"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../../../context/AuthContext";
import Link from "next/link";

export default function EditListingPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [listingInfo, setListingInfo] = useState({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;  // Prevent fetching if listingId is not yet available

    // Fetch listing data when listingId is available
    async function fetchListingData() {
      try {
        const response = await fetch(`/api/listing/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch listing data");
        }
        const data = await response.json();
        setListingInfo(data);  // Set the fetched data
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching listing:", err);
        setMessage("Failed to load listing data.");
        setIsLoading(false);
      }
    }

    fetchListingData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`/api/listing/update`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}` 
        },
        body: JSON.stringify(listingInfo),
      });

      if (!res.ok) throw new Error("Failed to update listing");
      setMessage("Listing updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 text-center max-w-md w-full">
          <span className="text-5xl mb-4">🔒</span>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-6">Please log in to edit this listing.</p>
          <Link href="/auth/login" className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all transform hover:-translate-y-0.5">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6">Edit Your Listing</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div className={`text-center py-3 ${message.includes("Failed") ? "text-red-500" : "text-green-500"}`}>
              {message}
            </div>
          )}

          <div className="flex flex-col">
            <label htmlFor="title" className="text-white mb-2">Listing Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={listingInfo.title}
              onChange={handleChange}
              className="px-4 py-3 bg-gray-700 text-white rounded-lg"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="text-white mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              value={listingInfo.description}
              onChange={handleChange}
              className="px-4 py-3 bg-gray-700 text-white rounded-lg"
              rows="4"
              required
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all transform hover:-translate-y-0.5">
            Update Listing
          </button>
        </form>
      </div>
    </div>
  );
}