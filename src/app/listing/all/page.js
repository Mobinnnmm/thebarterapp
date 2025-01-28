"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../../../context/AuthContext";

export default function AllListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/listing/all");
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Failed to fetch listings");
        }
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setErrorMsg(error.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchListings();
  }, []);

  const filteredListings = listings.filter(listing => 
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "all" || listing.category === selectedCategory)
  );

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-red-500/10 backdrop-blur-lg rounded-xl p-8 text-center">
          <span className="text-5xl mb-4">⚠️</span>
          <p className="text-red-400 text-lg font-medium">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-800/50 backdrop-blur-lg py-16 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Discover Amazing Items
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Browse through our collection of unique items available for trade
            </p>
            
            {/* Search and Filter Section */}
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-white"
                />
                <span className="absolute right-3 top-3 text-gray-400">🔍</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-auto px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-2">No listings found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <Link href={`/listing/${listing._id}`} key={listing._id}>
                <div className="group bg-gray-800/50 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    {listing.images && listing.images[0] ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                        <span className="text-4xl">📦</span>
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="px-3 py-1 bg-purple-500/80 backdrop-blur-sm text-white text-sm rounded-full">
                        {listing.category || 'Other'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {listing.description}
                    </p>
                    
                    {/* Footer */}
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

      {/* Floating Action Button for Create Listing */}
      {user && (
        <Link href="/listing/create">
          <button className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </Link>
      )}
    </div>
  );
}