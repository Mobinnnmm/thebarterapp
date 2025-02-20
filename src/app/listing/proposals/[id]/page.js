"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Proposals() {
  const params = useParams(); // Get the listing id from the route parameter
  const { id } = params;

  const [tradeDetails, setTradeDetails] = useState([]);
  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null); // Handle errors

  useEffect(() => {
    async function fetchProposals() {
      if (!id) return; // If no id, return early
      try {
        // fetch listing
        const listingRes = await fetch(`/api/listing/${id}`);
        if (!listingRes.ok) {
          const { error } = await listingRes.json();
          throw new Error(error || "Failed to fetch listing")
        }

        const listingData = await listingRes.json();
        setListing(listingData);

        // fetch proposals for listing
        const res = await fetch(`/api/listing/proposals/${id}`);
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Failed to fetch propsals for listing");
        }
        const data = await res.json();
        setTradeDetails(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching proposals for listing:", error);
      } finally {
        setLoading(false); // Stop loading once the request is done
      }
    }

    fetchProposals();
  }, [id]); // Dependency array to rerun only if the 'id' changes

  // If loading, display a loading message
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  // If there's an error, display an error message
  if (error) {
    return <div className="text-center py-4 text-red-600">Error: {error}</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long", // "Monday"
      year: "numeric", // "2025"
      month: "long", // "January"
      day: "numeric", // "24"
      hour: "numeric", // "10"
      minute: "numeric", // "40"
      second: "numeric", // "40"
      hour12: true, // Use 12-hour time format
    });
  };

  console.log(tradeDetails);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Target Item Section */}
      <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-semibold text-gray-100 mb-6">
          Your Listing
        </h1>
        <div className="flex items-center space-x-6">
          {/* Image Section */}
          <div className="w-1/3">
            {listing.images && listing.images[0] ? (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center rounded-lg shadow-lg">
                <span className="text-4xl text-white">📦</span>
              </div>
            )}
          </div>

          {/* Text Section */}
          <div className="w-2/3">
            <h2 className="text-xl font-semibold text-white">
              {listing.title}
            </h2>
            <p className="text-gray-400 mt-2">{listing.description}</p>
          </div>
        </div>
      </div>

      {/* Proposals Section */}
      <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-100 mb-4">
          Trade Offerings
        </h1>
        {tradeDetails.length > 0 ? (
          tradeDetails.map((proposal, index) => (
            <div
              key={index}
              className="bg-gray-700/50 backdrop-blur-lg p-6 rounded-lg shadow-md mb-6"
            >
              <div className="flex items-center space-x-6">
                {/* Image Section for Proposal */}
                <div className="w-1/3">
                  {proposal.proposedItemId.images &&
                  proposal.proposedItemId.images[0] ? (
                    <img
                      src={proposal.proposedItemId.images[0]}
                      alt={proposal.proposedItemId.title}
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center rounded-lg shadow-lg">
                      <span className="text-4xl text-white">📦</span>
                    </div>
                  )}
                </div>

                {/* Text Section for Proposal */}
                <div className="w-2/3">
                  {/* Item Details */}
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {proposal.proposedItemId.title}
                    </h2>
                    <p className="text-gray-400 mt-2">
                      {proposal.proposedItemId.description}
                    </p>
                  </div>

                  {/* Meeting Details */}
                  {proposal.currentProposal?.meetingDetails ? (
                    <div className="mt-4 bg-gray-700/50 p-4 rounded-lg shadow-md">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Meeting Details
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-300 w-24">
                            User:
                          </span>
                          <span className="text-gray-400">
                            {proposal.proposerId.username}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-300 w-24">
                            Date:
                          </span>
                          <span className="text-gray-400">
                            {formatDate(
                              proposal.currentProposal.meetingDetails.date
                            )}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-300 w-24">
                            Location:
                          </span>
                          <span className="text-gray-400">
                            {proposal.currentProposal.meetingDetails.location}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-300 w-24">
                            Note:
                          </span>
                          <span className="text-gray-400">
                            {
                              proposal.currentProposal.meetingDetails
                                .instructions
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 mt-4">
                      No meeting details available
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-400">No proposals yet</div>
        )}
      </div>
    </div>
  );
}
