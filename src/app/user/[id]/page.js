"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"; 
import { useAuth } from "../../../../context/AuthContext";
import { useParams } from "next/navigation";
import UserReview from "../../../components/UserReview";

export default function UserProfilePage() {
  const { user } = useAuth();
  const userId = user?._id; 
  const params = useParams();
  const { id } = params;


  const [ownerData, setOwnerData] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [userReviews, setUserReviews] = useState([]); 
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("listings"); 
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [loggedInUserId, setLoggedInUserId] = useState(userId); 

  // var total = 0;
  useEffect(() => {
    async function fetchUserData() {
      try {
        const [userRes, listingsRes, reviewsRes] = await Promise.all([
          fetch(`/api/user/${id}`),
          fetch(`/api/listing/user/${id}`),
          fetch(`/api/review/get/${id}`)
        ]);
  
        if (!userRes.ok || !listingsRes.ok || !reviewsRes.ok) {
          throw new Error("Failed to fetch user data");
        }
  
        const [userData, listingsData, reviewsData] = await Promise.all([
          userRes.json(),
          listingsRes.json(),
          reviewsRes.json()
        ]);
  
        setOwnerData(userData);
        setUserListings(listingsData);
        setUserReviews(reviewsData.reviews || []);
        setLoggedInUserId(userId); 

      } catch (error) {
        console.error("Error fetching user:", error);
        setErrorMsg(error.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    }
  
    if (id) fetchUserData();
  }, [id]);


// useEffect(() => {
 

// }}, [userReviews])
  


  const handleViewToggle = (view) => {
    setViewMode(view); // Toggle between 'listings' and 'reviews'
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return alert("Review cannot be empty.");
    if (!rating || rating < 1 || rating > 5) return alert("Rating must be between 1 and 5.");

    const newReview = {
      reviewerId: userId,
      reviewedId: id,
      notes: reviewText,
      rating: parseInt(rating),
    };

    if (newReview.reviewedId == newReview.reviewerId) return alert("You cannot write a review for yourself");

    try {
      const response = await fetch(`/api/review/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) return alert("You cannot write more than one review for another user");

      const savedReview = await response.json();
      setUserReviews((prev) => [...prev, savedReview]); 
      setReviewText(""); 
      setRating(5);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <p className="text-red-500 text-xl">{errorMsg}</p>
        </div>
      </div>
    );
  }

 

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-500/10 to-blue-500/10">
        {/* User Profile Card */}
        <div className=" bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Picture */}
              <div className="w-32 h-32 rounded-full overflow-hidden bg-purple-500 flex-shrink-0">
                {ownerData?.profilePicture ? (
                  <img
                    src={ownerData.profilePicture}
                    alt={ownerData.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    👤
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-4">{ownerData?.username}</h1>
                <div className="space-y-2 text-gray-300">
                  {ownerData?.email && (
                    <p className="flex items-center justify-center md:justify-start gap-2">
                      <span>📧</span> {ownerData.email}
                    </p>
                  )}
                  {ownerData?.phoneNumber && (
                    <p className="flex items-center justify-center md:justify-start gap-2">
                      <span>📱</span> {ownerData.phoneNumber}
                    </p>
                  )}
                  {ownerData?.address && (
                    <p className="flex items-center justify-center md:justify-start gap-2">
                      <span>📍</span> {ownerData.address}
                    </p>
                  )}
                </div>
                {ownerData?.aboutMe && (
                  <p className="mt-4 text-gray-400">{ownerData.aboutMe}</p>
                )}
              </div>

              <div className="flex-2 text-center md:text-left">
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <textarea
                  className="w-full p-3 text-gray-200 bg-gray-900 rounded-md border border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                  rows="4"
                  placeholder="Write your review here..."
                  value={reviewText}
                  maxLength={500}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                {/* <div className="flex items-center space-x-4">
                  <label className="text-gray-300">Rating:</label>
                  <select
                    className="p-2 bg-gray-900 border border-gray-700 text-white rounded-md"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div> */}
                <div className="flex items-center space-x-4">
                  <label className="text-gray-300">Rating:</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div
                        key={num}
                        className={`cursor-pointer text-2xl ${rating >= num ? 'text-yellow-500' : 'text-gray-400'}`}
                        onClick={() => setRating(num)} // Update rating on click
                      >
                        ★
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold p-2 rounded-md transition-all"
                >
                  Submit Review
                </button>
              </form>
              </div>

            </div>
          </div>
        </div>

        {/* Buttons to Toggle View */}
        <div className="pb-8 ">
          <button
            className="m-5 text-gray-200 hover:text-white p-2 rounded-lg bg-green-600/50 hover:bg-gray-700 transition-all"
            onClick={() => handleViewToggle("listings")}
          >
            View User Listings
          </button>
          <button
            className="m-5 text-gray-200 hover:text-white p-2 rounded-lg bg-green-600/50 hover:bg-gray-700 transition-all"
            onClick={() => handleViewToggle("reviews")}
          >
            View User Reviews
          </button>
        </div>

        {/* Conditionally Render Listings or Reviews */}
        {viewMode === "listings" && (
          <div className="space-y-6 m-5">
            <h2 className="text-2xl font-bold text-white mb-6">Listed Items</h2>
            {userListings.length === 0 ? (
              <div className="text-center py-12 bg-gray-800 rounded-xl">
                <p className="text-gray-400">This user has no items listed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userListings.map((item) => {
                  const itemId = item._id || item.id; 
                  return (
                    <Link
                      key={itemId}
                      href={`/listing/${itemId}`}
                      className="block group"
                    >
                      <div className="m-5 bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-200">
                        <div className="aspect-w-16 aspect-h-9">
                          {item.images && item.images[0] ? (
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-full h-48 object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                              <span className="text-4xl">📦</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-gray-400 mt-2 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="mt-4 flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              Posted: {new Date(item.datePosted).toLocaleDateString()}
                            </span>
                            <span className="text-purple-400 group-hover:text-purple-300">
                              View Details →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {viewMode === "reviews" ? (
          userReviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-xl">
              <p className="text-gray-400">This user has no reviews.</p>
            </div>
          ) : 
          (
            <div>
                <h2 className="m-5 pd-1 text-2xl font-bold text-white mb-6">User Reviews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {userReviews.map((review) => (
                <div key={review._id} className="m-5 grid grid-cols-2 bg-gray-800 p-4 rounded-xl shadow-lg">
                  


                  <div className="w-16 h-16 mb-2 rounded-full overflow-hidden bg-purple-500 flex-shrink-0">
                  {/* {true ? (
                  <img
                    src={reviewOwner.profilePicture}
                    alt={reviewOwner.username}
                    className="w-full h-full object-cover"
                  />
                ) : ( */}
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    👤
                  </div>
                {/* )} */}
              </div>
                  <p className="text-gray-400">{review.notes}</p>
                  <p className="text-white font-semibold">{review.reviewerId?.username}</p>
                  <p className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <span
                      key={num}
                      className={`text-2xl ${review.rating >= num ? 'text-yellow-500' : 'text-gray-400'}`}
                    >
                      ★
                    </span>
                  ))}
                </p>
                </div>
              ))}
            </div>
            </div>
          )
        ) : 
        (<div></div>) 
        }
      </div>
      {/* userReviews.forEach((e) =>{total += e.rating}) */}
      {/* <p>hey{total /= userListings.length}</p> */}
    </div>
  );
}
