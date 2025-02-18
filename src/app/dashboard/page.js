"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [items, setItems] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !user._id) return;

    async function fetchDashboardData() {
      try {
        const res = await fetch(`/api/user/dashboard-data?userId=${user._id}`);
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Failed to fetch dashboard data");
        }
        const data = await res.json();
        setUserInfo(data.user);
        setItems(data.items);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        setErrorMsg(error.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      const res = await fetch('/api/user/deleteProfile', {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userID: user._id }),
      });

      if(!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Failed to delete profile');

      }
    } catch (error) {
      console.error('Error deleting Profile: ', error);
      setErrorMsg(error.message || "Could not delete profile.");
    }

    router.push('/');
  };

  const handleCreateListing = () => {
    router.push('/listing/create');
  };

  const handleEdit = (listingId) => {
    router.push(`/listing/update/${listingId}`);
  }

  const handleDelete = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const res = await fetch("/api/listing/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ listingID: listingId }),
      });
  
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to delete item");
      }
  
      // Remove deleted item from state
      setItems((prevItems) => prevItems.filter((item) => item._id !== listingId));
    } catch (error) {
      console.error("Error deleting item:", error);
      setErrorMsg(error.message || "Could not delete item.");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl shadow-xl text-center">
          <span className="mx-auto text-5xl mb-4">🔒</span>
          <p className="text-red-400 text-lg font-medium">Please log in to access your dashboard.</p>
          <Link 
            href="/auth/login"
            className="mt-4 inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition-all transform hover:-translate-y-0.5"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl shadow-xl text-center">
          <span className="mx-auto text-5xl mb-4">⚠️</span>
          <p className="text-red-400 text-lg font-medium">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500"></div>
          <p className="mt-4 text-xl text-gray-300 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-500 p-3 rounded-lg">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Dashboard
              </h2>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link
                href={userInfo?.aboutMe ? "/profile/setup" : "/profile/setup"}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-2 rounded-lg transition-all transform hover:-translate-y-0.5"
              >
                {userInfo?.aboutMe ? "Update Profile" : "Setup Profile"}
              </Link>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all transform hover:-translate-y-0.5"
              >
                Delete Account
              </button>
            </div>
          </div>
        </header>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl shadow-xl">
            <h3 className="text-lg font-medium text-gray-400">Total Items</h3>
            <p className="text-3xl font-bold text-indigo-400">{items.length}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl shadow-xl">
            <h3 className="text-lg font-medium text-gray-400">Profile Views</h3>
            <p className="text-3xl font-bold text-purple-400">0</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl shadow-xl">
            <h3 className="text-lg font-medium text-gray-400">Trade Requests</h3>
            <p className="text-3xl font-bold text-pink-400">0</p>
          </div>
        </div>

        {/* User Info and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl shadow-xl">
            <h3 className="text-2xl font-bold text-indigo-400 mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">👤</span>
                <span className="font-medium">{userInfo.username}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">📧</span>
                <span>{userInfo.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">📱</span>
                <span>{userInfo.phoneNumber || "Not set"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">📝</span>
                <span>{userInfo.aboutMe || "No bio yet"}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl shadow-xl">
            <h3 className="text-2xl font-bold text-indigo-400 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 text-gray-300">
                  <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                  <p>Activity {i + 1}</p>
                  <span className="text-gray-500 text-sm">Just now</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-indigo-400">Your Listed Items</h3>
            <button
              onClick={handleCreateListing}
              className="mt-4 md:mt-0 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2 rounded-lg transition-all transform hover:-translate-y-0.5"
            >
              Create New Listing
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">You have not listed any items yet.</p>
              <button
                onClick={handleCreateListing}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition-all transform hover:-translate-y-0.5"
              >
                Create Your First Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-700/50 rounded-xl shadow-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all"
                >
                  {item.images && item.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-600 flex items-center justify-center">
                      <span className="text-4xl">📷</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="text-xl font-semibold text-indigo-400 mb-2">{item.title}</h4>
                    <p className="text-gray-300 mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item._id)}
                        className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all transform hover:-translate-y-0.5">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all transform hover:-translate-y-0.5">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
