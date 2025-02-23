// Trade Summary Page
// Shows both items (proposed and target) side by side with confirmation options
// Rendered after user selects their item to trade

"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from "../../../../context/AuthContext";

function TradeSummaryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState(null);
  const [targetItem, setTargetItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedItemId = searchParams.get('selectedItem');
  const targetItemId = searchParams.get('targetItem');
  const targetUserId = searchParams.get('targetUserId');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchItems() {
      try {
        setIsLoading(true);
        setError(null);

        // Validate IDs
        if (!selectedItemId || !targetItemId) {
          throw new Error('Missing item IDs');
        }

        console.log('Fetching items:', { selectedItemId, targetItemId });

        // Fetch both items in parallel
        const [selectedRes, targetRes] = await Promise.all([
          fetch(`/api/listing/${selectedItemId}`),
          fetch(`/api/listing/${targetItemId}`)
        ]);

        // Handle errors for each request individually
        if (!selectedRes.ok) {
          const selectedError = await selectedRes.json();
          throw new Error(`Failed to fetch selected item: ${selectedError.error}`);
        }

        if (!targetRes.ok) {
          const targetError = await targetRes.json();
          throw new Error(`Failed to fetch target item: ${targetError.error}`);
        }

        // Parse responses
        const [selectedData, targetData] = await Promise.all([
          selectedRes.json(),
          targetRes.json()
        ]);

        setSelectedItem(selectedData);
        setTargetItem(targetData);
      } catch (error) {
        console.error('Error fetching items:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchItems();
  }, [user, selectedItemId, targetItemId, targetUserId, router]);

  const handleProposeTrade = async () => {
    try {
      setError(null);
      
      // Debug log all the values
      const tradeData = {
        proposerId: user?._id,
        targetUserId: targetUserId,
        proposedItemId: selectedItemId,
        targetItemId: targetItemId
      };
      
      // Validate all required fields
      if (!user?._id || !targetUserId || !selectedItemId || !targetItemId) {
        throw new Error(`Missing required fields: ${JSON.stringify({
          userId: !!user?._id,
          targetUserId: !!targetUserId,
          selectedItemId: !!selectedItemId,
          targetItemId: !!targetItemId
        })}`);
      }
      
      const response = await fetch('/api/trade/create', {  // Updated endpoint to match your route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tradeData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Trade creation failed:', data);
        throw new Error(data.error || 'Failed to create trade');
      }
      
      // Redirect to the trade view page
      alert("Trade offer sent");
      router.push(`/dashboard`);
    } catch (error) {
      console.error('Error proposing trade:', error);
      setError(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl text-center">
          <span className="text-5xl mb-4">⚠️</span>
          <h2 className="text-2xl font-bold text-red-400">{error}</h2>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Trade Summary
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Your Item */}
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Your Item</h2>
            <div className="aspect-w-1 aspect-h-1 mb-4 rounded-lg overflow-hidden">
              <img
                src={selectedItem?.images?.[0] || "https://via.placeholder.com/400"}
                alt={selectedItem?.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {selectedItem?.title}
            </h3>
            <p className="text-gray-300">
              {selectedItem?.description}
            </p>
          </div>

          {/* Their Item */}
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Their Item</h2>
            <div className="aspect-w-1 aspect-h-1 mb-4 rounded-lg overflow-hidden">
              <img
                src={targetItem?.images?.[0] || "https://via.placeholder.com/400"}
                alt={targetItem?.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {targetItem?.title}
            </h3>
            <p className="text-gray-300">
              {targetItem?.description}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
          >
            Back
          </button>
          <button
            onClick={handleProposeTrade}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all"
          >
            Propose Trade
          </button>
        </div>
      </div>
    </div>
  );
}

// Loading component
function LoadingTradeSummary() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
    </div>
  );
}

// Main page component
export default function TradeSummaryPage() {
  return (
    <Suspense fallback={<LoadingTradeSummary />}>
      <TradeSummaryForm />
    </Suspense>
  );
} 