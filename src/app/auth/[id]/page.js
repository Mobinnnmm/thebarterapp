"use client";

import React, { useEffect, useState, use } from "react";

export default function PublicProfile(props) {
  const params = use(props.params);
  const [userData, setUserData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const userId = params.id; // from [id]

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/user/${userId}`, {
          headers: {
          Authorization: `Bearer ${user.token}`}}, { cache: "no-store" });
        
        const data = await res.json();
        if (res.ok) {
          setUserData(data);
        } else {
          setErrorMsg(data.error || "Could not fetch user");
        }
      } catch (error) {
        console.error("Error fetching user", error);
        setErrorMsg("Something went wrong.");
      }
    }
    fetchUser();
  }, [userId]);

  if (errorMsg) {
    return <p className="text-red-500">{errorMsg}</p>;
  }

  if (!userData) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Public Profile</h2>
      {/* Example Fields */}
      <img
        src={userData.profilePicture || "/default-profile.png"}
        alt="Profile"
        className="w-32 h-32 object-cover rounded-full mb-4 mx-auto"
      />
      <div className="space-y-2">
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Phone:</strong> {userData.phoneNumber}</p>
        <p><strong>Address:</strong> {userData.address}</p>
        <p><strong>About Me:</strong> {userData.aboutMe}</p>
        <p><strong>Rating:</strong> {userData.rating || 0}</p>
        <p><strong>Verified:</strong> {userData.isVerified ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}
