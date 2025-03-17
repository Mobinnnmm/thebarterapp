/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import Link from "next/link";

export default function ProfileSetupPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [userInfo, setUserInfo] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("about"); // 'about' or 'listings'

  useEffect(() => {
    if (!user?._id) return;

    async function fetchUserData() {
      try {
        const [profileRes, listingsRes] = await Promise.all([
          fetch(`/api/user/${user._id}`),
          fetch(`/api/listing/user/${user._id}`)
        ]);

        if (!profileRes.ok) {
          let errorMessage = profileRes.statusText;
          try {
            const errorData = await profileRes.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {
            errorMessage = `HTTP ${profileRes.status}: ${profileRes.statusText}`;
          }
          throw new Error(`Failed to fetch profile: ${errorMessage}`);
        }

        if (!listingsRes.ok) {
          let errorMessage = listingsRes.statusText;
          try {
            const errorData = await listingsRes.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {
            errorMessage = `HTTP ${listingsRes.status}: ${listingsRes.statusText}`;
          }
          throw new Error(`Failed to fetch listings: ${errorMessage}`);
        }

        const [profileData, listingsData] = await Promise.all([
          profileRes.json(),
          listingsRes.json()
        ]);

        console.log('Listings data:', listingsData); // Debug log

        // Ensure each listing has an id
        const sanitizedListings = listingsData.map(listing => ({
          ...listing,
          id: listing._id || listing.id // Ensure we have an id
        }));

        setUserInfo(profileData);
        setUserListings(sanitizedListings);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [user?._id]);


const [messageType, setMessageType] = useState(""); // "success" or "error"

const handlePasswordChange = async (e) => {
  e.preventDefault();
  setMessage("");
  setMessageType("");

  const formData = new FormData(e.target);
  const oldPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");

  if (newPassword !== confirmPassword) {
    setMessage("Passwords do not match.");
    setMessageType("error");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You must be logged in to change your password.");
      setMessageType("error");
      return;
    }

    const res = await fetch("/api/user/updatePassword", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed to update password");

    setMessage("Password updated successfully!");
    setMessageType("success");
  } catch (error) {
    setMessage(error.message);
    setMessageType("error");
  }
};

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 text-center max-w-md w-full">
          <span className="text-5xl mb-4">🔒</span>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-6">Please log in to view this profile.</p>
          <Link 
            href="/auth/login"
            className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all transform hover:-translate-y-0.5"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/user/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          email: user.email,
          ...userInfo
        }),
      });
      
      if (!res.ok) throw new Error("Failed to update profile");
      
      setMessage("Profile updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500">
                <img
                  src={userInfo?.profilePicture || "https://via.placeholder.com/200"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{userInfo?.username}</h1>
              <p className="text-gray-400 mb-4">{userInfo?.email}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {userInfo?.phoneNumber && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <span>📱</span>
                    {userInfo.phoneNumber}
                  </div>
                )}
                {userInfo?.address && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <span>📍</span>
                    {userInfo.address}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab("about")}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === "about"
                  ? "bg-purple-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("Change Password")}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === "Change Password"
                  ? "bg-purple-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              Change Password
            </button>
          </div>

          <div className="p-6">
            {activeTab === "about" ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-4">About Me</h3>
                  <p className="text-gray-300">
                    {userInfo?.aboutMe || "No bio available"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {message && (
                    <div className={`p-4 rounded-lg ${
                      message.includes("success")
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}>
                      {message}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={userInfo?.phoneNumber || ""}
                        onChange={(e) => setUserInfo({...userInfo, phoneNumber: e.target.value})}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={userInfo?.address || ""}
                        onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      About Me
                    </label>
                    <textarea
                      value={userInfo?.aboutMe || ""}
                      onChange={(e) => setUserInfo({...userInfo, aboutMe: e.target.value})}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userInfo?.email || ""}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter Your Email..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profile Picture URL
                    </label>
                    <input
                      type="text"
                      value={userInfo?.profilePicture || ""}
                      onChange={(e) => setUserInfo({...userInfo, profilePicture: e.target.value})}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="http://..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all transform hover:-translate-y-0.5"
                  >
                    Update Profile
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-white text-center">Change Password</h2>
                
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-gray-300">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      required
                      className="w-full mt-1 p-2 rounded bg-gray-700 text-white focus:ring focus:ring-purple-500"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      required
                      className="w-full mt-1 p-2 rounded bg-gray-700 text-white focus:ring focus:ring-purple-500"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      className="w-full mt-1 p-2 rounded bg-gray-700 text-white focus:ring focus:ring-purple-500"
                      placeholder="Confirm new password"
                    />
                  </div>

                  {message && (
                    <p className={`mt-2 text-sm ${messageType === "success" ? "text-green-500" : "text-red-500"}`}>
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all"
                  >
                    Change Password
                  </button>
                </form>
              </div>

            )}
          </div>
        </div>
      </div>
    </div>
  );
}