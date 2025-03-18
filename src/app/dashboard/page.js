// Dashboard page

// Dashboard page for users to view their profile information and recent activity
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [items, setItems] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [tradedItems, setTradedItems] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !user._id) return;

    async function fetchDashboardData() {
      try {
        const [dashboardRes, notificationsRes] = await Promise.all([
          fetch(`/api/user/dashboard-data?userId=${user._id}`),
          fetch(`/api/Notifications/getNotifications?userID=${user._id}&limit=3`)
        ]);

        if (!dashboardRes.ok || !notificationsRes.ok) {
          const error = await dashboardRes.json() || await notificationsRes.json();
          throw new Error(error.error || "Failed to fetch dashboard data");
        }

        const [dashboardData, notificationsData] = await Promise.all([
          dashboardRes.json(),
          notificationsRes.json()
        ]);

        setUserInfo(dashboardData.user);
        setItems(dashboardData.items);
        setFavourites(dashboardData.favourites);
        setTradedItems(dashboardData.tradedItems);
        setRecentNotifications(notificationsData.notifications);
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

  const handleViewProposals = (listingId) => {
    router.push(`/listing/proposals/${listingId}`);
  };

  // Helper function to get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'TRADE_PROPOSED':
        return '🤝';
      case 'TRADE_COMPLETED':
        return '✅';
      case 'OFFER_ACCEPTED':
        return '👍';
      default:
        return '📢';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-2xl">
                  {user?.username?.[0]?.toUpperCase() || '👤'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-800"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Welcome back, {user?.username}!
                </h1>
                <p className="text-gray-400">Manage your items and trades</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/profile/setup"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-indigo-500/25"
              >
                {userInfo?.aboutMe ? "Update Profile" : "Complete Profile"}
              </Link>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-red-500/25"
              >
                Delete Profile
              </button>
              <button
                onClick={handleCreateListing}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-emerald-500/25"
              >
                New Listing
              </button>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Recent Activity */}
          <div className="lg:col-span-1 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Listed Items</p>
                    <p className="text-2xl font-bold text-white">{items.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Favorites</p>
                    <p className="text-2xl font-bold text-white">{favourites.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                <Link href="/notification" className="text-sm text-indigo-400 hover:text-indigo-300">
                  View all →
                </Link>
              </div>
              <div className="space-y-4">
                {recentNotifications.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No recent activity</p>
                ) : (
                  recentNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="group flex items-start gap-4 p-4 rounded-lg bg-gray-700/20 hover:bg-gray-700/30 transition-all border border-gray-700/50"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-300 line-clamp-2">{notification.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(notification.dateSent), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Listed Items */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-6">Your Listed Items</h2>
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-gray-400 mb-4">No items listed yet</p>
                  <button
                    onClick={handleCreateListing}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:-translate-y-0.5"
                  >
                    Create Your First Listing
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="group bg-gray-700/20 rounded-xl overflow-hidden border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
                    >
                      <div className="relative aspect-video">
                        {item.images && item.images[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                            <span className="text-4xl">📷</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/90 text-white backdrop-blur-sm">
                            Available
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-white mb-2 group-hover:text-indigo-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{item.description}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item._id)}
                            className="flex-1 px-3 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-300 transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="flex-1 px-3 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-red-300 transition-colors text-sm"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleViewProposals(item._id)}
                            className="flex-1 px-3 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500 text-indigo-400 hover:text-white transition-colors text-sm"
                          >
                            View Proposals
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

        {/* Favorites Section */}
        <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6">Favorite Items</h2>
          {favourites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No favorites yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favourites.map((listing) => (
                <Link href={`/listing/${listing._id}`} key={listing._id}>
                  <div className="group bg-gray-800/50 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      {listing.images && listing.images[0] ? (
                        <>
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2">
                            <span className="px-3 py-1 bg-green-500/80 backdrop-blur-sm text-white text-sm rounded-full">
                              Available
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                          <span className="text-4xl">📦</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span className="px-3 py-1 bg-purple-500/80 backdrop-blur-sm text-white text-sm rounded-full">
                          {listing.category || 'Other'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                        {listing.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {listing.description}
                      </p>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                            👤
                          </div>
                          <span className="text-sm text-gray-400">
                            {listing.ownerName || 'Anonymous'}
                          </span>
                        </div>
                        <span className="text-purple-400 text-sm">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Traded Items Section */}
        <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6">Traded Items</h2>
          {tradedItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No traded items yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tradedItems.map((item) => (
                <div
                  key={item._id}
                  className="group bg-gray-800/50 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    {item.images && item.images[0] ? (
                      <>
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="px-3 py-1 bg-gray-500/80 backdrop-blur-sm text-white text-sm rounded-full">
                            Traded
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                        <span className="text-4xl">📦</span>
                      </div>
                    )}
                    {item.category && (
                      <div className="absolute top-2 left-2">
                        <span className="px-3 py-1 bg-purple-500/80 backdrop-blur-sm text-white text-sm rounded-full">
                          {item.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                          📅
                        </div>
                        <span className="text-sm text-gray-400">
                          Traded on {new Date(item.datePosted).toLocaleDateString()}
                        </span>
                      </div>
                      <Link 
                        href={`/listing/${item._id}`}
                        className="text-purple-400 text-sm hover:text-purple-300 transition-colors"
                      >
                        View Details →
                      </Link>
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
