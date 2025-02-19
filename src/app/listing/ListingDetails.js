"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
export default function ListingDetails({ id, initialData }) {
    const { user } = useAuth();
    const router = useRouter();
    const [listing, setListing] = useState(initialData || null);
    const [owner, setOwner] = useState(null);
    const [isLoading, setIsLoading] = useState(!initialData);
    const [error, setError] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showImageModal, setShowImageModal] = useState(false);
  
    useEffect(() => {
      async function fetchOwnerData(ownerId) {
        try {
          const res = await fetch(`/api/user/${ownerId}`);
          if (!res.ok) throw new Error('Failed to fetch owner data');
          const data = await res.json();
          setOwner(data);
        } catch (err) {
          console.error('Error fetching owner:', err);
        }
      }
  
      if (listing?.ownerID) {
        fetchOwnerData(listing.ownerID);
      }
    }, [listing?.ownerID]);
  
    useEffect(() => {
      if (!initialData && id) {
        async function fetchListing() {
          try {
            const res = await fetch(`/api/listing/${id}`);
            if (!res.ok) throw new Error('Failed to fetch listing');
            const data = await res.json();
            setListing(data);
          } catch (err) {
            console.error('Error fetching listing:', err);
            setError(err.message);
          } finally {
            setIsLoading(false);
          }
        }
        fetchListing();
      }
    }, [id, initialData]);
  
    const handleViewProfile = () => {
      if (owner?._id) {
        console.log('Navigating to profile:', `/profile/${owner._id}`);
        router.push(`/profile/${owner._id}`);
      } else {
        console.log('No owner data available');
      }
    };
  
    const handleChat = () => {
      console.log('Chat button pressed');
    };
  
    const handleProposeTrade = () => {
      console.log('Propose Trade button pressed');
      if (!user) {
        router.push('/login');
        return;
      }

      if (!listing?.ownerID) {
        setError("Listing owner not found");
        return;
      }

      const targetUserId = listing.ownerID.toString();
      router.push(`/trade/select-item?targetItem=${id}&targetUserId=${targetUserId}`);
    };
  
    const handleReport = () => {
      console.log('Report button pressed');

      if (!user) {
        router.push('/login');
        return;
      }

      if (!listing?.ownerID) {
        setError("Listing owner not found");
        return;
      }

      const targetUserId = listing.ownerID.toString();
      router.push(`/report?targetItem=${id}&targetUserId=${targetUserId}`);
    };
  
    const handleShare = () => {
      console.log('Share button pressed');
    };
  
    const handleContactOwner = () => {
      console.log('Contact Owner button pressed');
    };
  
    const handleDelete = async () => {
      if (window.confirm("Are you sure you want to delete this listing?")) {
        console.log('Delete button pressed');
      }
    };
  
    // Update the Quick Actions section
    const quickActions = (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {owner ? (
          <Link href={`/user/${owner._id}`}>
            <button 
              className="w-full flex flex-col items-center justify-center p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all"
            >
              <span className="text-2xl mb-2">👁️</span>
              <span className="text-sm text-gray-300">View Profile</span>
            </button>
          </Link>
        ) : (
          <button 
            className="flex flex-col items-center justify-center p-4 bg-gray-700/30 rounded-lg opacity-50 cursor-not-allowed"
            disabled
          >
            <span className="text-2xl mb-2">👁️</span>
            <span className="text-sm text-gray-300">View Profile</span>
          </button>
        )}
        
        <button 
          onClick={handleChat}
          className="flex flex-col items-center justify-center p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all"
        >
          <span className="text-2xl mb-2">💬</span>
          <span className="text-sm text-gray-300">Chat</span>
        </button>
        <button 
          onClick={handleProposeTrade}
          className="flex flex-col items-center justify-center p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all"
        >
          <span className="text-2xl mb-2">🔄</span>
          <span className="text-sm text-gray-300">Propose Trade</span>
        </button>
        <button 
          onClick={handleReport}
          className="flex flex-col items-center justify-center p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all"
        >
          <span className="text-2xl mb-2">⚠️</span>
          <span className="text-sm text-gray-300">Report</span>
        </button>
      </div>
    );
  
    // Update the Action Buttons section
    const actionButtons = (
      <div className="flex flex-wrap gap-4">
        {user && listing && user._id === listing.owner ? (
          <>
            <button
              onClick={() => router.push(`/listing/edit/${listing._id}`)}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>✏️</span>
              <span>Edit Listing</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>🗑️</span>
              <span>Delete Listing</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleContactOwner}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>💬</span>
              <span>Contact Owner</span>
            </button>
            <button
              onClick={handleProposeTrade}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>🤝</span>
              <span>Propose Trade</span>
            </button>
          </>
        )}
      </div>
    );
  
    // Update the Share and Report section
    const shareAndReport = (
      <div className="flex justify-center space-x-4 mt-8 pt-8 border-t border-gray-700">
        <button 
          onClick={handleShare}
          className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
        >
          <span>📤</span>
          <span>Share</span>
        </button>
        <button 
          onClick={handleReport}
          className="text-gray-400 hover:text-red-400 transition-colors flex items-center space-x-2"
        >
          <span>⚠️</span>
          <span>Report</span>
        </button>
      </div>
    );
  
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        </div>
      );
    }

    if (error || !listing) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 text-center max-w-md">
            <span className="text-5xl mb-4">⚠️</span>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
            <p className="text-gray-300">{error || "Listing not found"}</p>
          </div>
        </div>
      );
    }

    const handlePrevImage = () => {
      setCurrentImageIndex((prev) => 
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    };

    const handleNextImage = () => {
      setCurrentImageIndex((prev) => 
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery Section */}
            <div className="space-y-4">
              <div className="relative group">
                <div className="relative aspect-w-16 aspect-h-12 rounded-xl overflow-hidden bg-gray-800">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[currentImageIndex]}
                      alt={`${listing.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover cursor-pointer transform transition-transform duration-300 group-hover:scale-105"
                      onClick={() => setShowImageModal(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <span className="text-6xl">📷</span>
                    </div>
                  )}
                  
                  {listing.images && listing.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                      >
                        ←
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {listing.images && listing.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {listing.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-purple-500 opacity-100"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Listing Details Section */}
            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl">
                <h1 className="text-3xl font-bold text-white mb-4">
                  {listing?.title}
                </h1>

                {/* Owner Information */}
                {owner && (
                  <Link 
                    href={`/user/${owner._id}`}
                    className="flex items-center space-x-4 mb-6 group hover:bg-gray-700/30 p-3 rounded-lg transition-all"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500">
                      <img
                        src={owner.profilePicture || "https://via.placeholder.com/100"}
                        alt={owner.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Listed by</p>
                      <p className="text-white font-medium group-hover:text-purple-400 transition-colors">
                        {owner.username}
                      </p>
                    </div>
                  </Link>
                )}

                <div className="prose prose-invert max-w-none mb-8">
                  <p className="text-gray-300 leading-relaxed">
                    {listing?.description}
                  </p>
                </div>

                {/* Quick Actions */}
                {quickActions}

                {/* Contact Information */}
                <div className="bg-gray-700/30 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Contact Information
                  </h3>
                  {owner && (
                    <div className="space-y-3">
                      {owner.phoneNumber && (
                        <p className="text-gray-300 flex items-center space-x-3">
                          <span className="text-xl">📱</span>
                          <span>{owner.phoneNumber}</span>
                        </p>
                      )}
                      {owner.email && (
                        <p className="text-gray-300 flex items-center space-x-3">
                          <span className="text-xl">📧</span>
                          <span>{owner.email}</span>
                        </p>
                      )}
                      {owner.address && (
                        <p className="text-gray-300 flex items-center space-x-3">
                          <span className="text-xl">📍</span>
                          <span>{owner.address}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {actionButtons}

                {/* Share and Report */}
                {shareAndReport}
              </div>
            </div>
          </div>
        </div>

        {/* Full Screen Image Modal */}
        {showImageModal && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            <div className="relative max-w-6xl w-full">
              <img
                src={listing.images[currentImageIndex]}
                alt={listing.title}
                className="w-full h-auto max-h-[90vh] object-contain"
              />
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full backdrop-blur-sm"
                  >
                    ←
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-4 rounded-full backdrop-blur-sm"
                  >
                    →
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
