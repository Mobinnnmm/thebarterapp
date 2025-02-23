"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

// Client component for handling search params
function SearchParamsHandler({ onParamsChange }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      const tradeId = searchParams.get('id');
      onParamsChange(tradeId);
    }
  }, [searchParams, onParamsChange]);

  return null;
}

function ViewTradeForm() {
  const [trade, setTrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRejecting, setIsRejecting] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const [showNegotiationHistory, setShowNegotiationHistory] = useState(false);
  const [negotiationHistory, setNegotiationHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Default avatar SVG
  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ccc' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

  useEffect(() => {
    async function fetchTrade() {
      const id = searchParams.get('id');
      if (!id || !user?._id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/trade/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          console.log("Trade data:", data.trade); // Debug log
          setTrade(data.trade);
          setShowActions(data.trade.targetUserId._id === user._id && data.trade.status === 'pending');
        } else {
          setError(data.error || 'Failed to fetch trade details');
        }
      } catch (err) {
        console.error('Error fetching trade:', err);
        setError('Failed to fetch trade details');
      } finally {
        setLoading(false);
      }
    }

    fetchTrade();
  }, [searchParams, user]);

  const handleReject = async () => {
    const id = searchParams.get('id');
    if (!id) return;
    
    if (!confirm('Are you sure you want to reject this trade offer?')) {
      return;
    }
    
    setIsRejecting(true);
    setUpdateError(null);

    try {
      const response = await fetch(`/api/trade/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      const data = await response.json();

      if (data.success) {
        router.push('/trade/recieved-offers');
      } else {
        setUpdateError(data.error);
      }
    } catch (err) {
      setUpdateError('Failed to reject trade');
      console.error(err);
    } finally {
      setIsRejecting(false);
    }
  };

  const handleAccept = async () => {
    const id = searchParams.get('id');
    if (!id) return;

    if (!confirm('Are you sure you want to accept this trade offer? You will be able to propose meeting details next.')) {
      return;
    }
    router.push(`/trade/initial-offer/${id}`);
  };

  const fetchNegotiationHistory = async () => {
    const id = searchParams.get('id');
    if (!id || !user?.token) return;
    
    setLoadingHistory(true);
    try {
      const response = await fetch(`/api/trade/${id}/history`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setNegotiationHistory(data.history);
      } else {
        console.error('Failed to fetch history:', data.error);
      }
    } catch (err) {
      console.error('Error fetching negotiation history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const renderItemImage = (item, large = false) => {
    if (!item) return (
      <div className={`${large ? 'aspect-square' : 'w-[100px] h-[100px]'} bg-gray-200 rounded-lg flex items-center justify-center`}>
        <span className="text-gray-500">Item not found</span>
      </div>
    );

    return item.images?.[0] ? (
      <div className={`${large ? 'aspect-square' : ''} relative`}>
        <Image
          src={item.images[0]}
          alt={item.title}
          fill={large}
          width={!large ? 100 : undefined}
          height={!large ? 100 : undefined}
          className={`rounded-lg ${large ? 'object-cover' : ''}`}
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
        />
      </div>
    ) : (
      <div className={`${large ? 'aspect-square' : 'w-[100px] h-[100px]'} bg-gray-200 rounded-lg flex items-center justify-center`}>
        <span className="text-gray-500">No image</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center text-red-500 bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => router.back()} 
            className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center text-white bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Trade Not Found</h2>
          <button 
            onClick={() => router.back()} 
            className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isProposer = trade.proposerId._id === user._id;
  const otherUser = isProposer ? trade.targetUserId : trade.proposerId;

  const renderNegotiationHistory = () => {
    if (loadingHistory) {
      return <div className="text-center py-4">Loading history...</div>;
    }

    return (
      <div className="space-y-4 bg-gray-50/50 backdrop-blur-sm">
        {negotiationHistory.map((entry, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">
                Proposed by: {entry.proposedBy?.username || 'Unknown'}
              </span>
              <span className="text-sm text-gray-600">
                {new Date(entry.createdAt).toLocaleDateString()} 
                {' '}
                {new Date(entry.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="text-sm">
              <p><strong>Date:</strong> {entry.meetingDetails?.date || 'Not specified'}</p>
              <p><strong>Location:</strong> {entry.meetingDetails?.location || 'Not specified'}</p>
              {entry.meetingDetails?.instructions && (
                <p><strong>Instructions:</strong> {entry.meetingDetails.instructions}</p>
              )}
            </div>
            <div className="mt-2 text-sm">
              {entry.status && (
                <span className={`px-2 py-1 rounded-full ${
                  entry.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  entry.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Link 
        href={showActions ? "/trade/recieved-offers" : "/trade/sent-offers"} 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FaArrowLeft className="mr-2" /> 
        Back to {showActions ? "Received" : "Sent"} Offers
      </Link>

      <div className="rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Image
              src={otherUser?.profilePicture || defaultAvatar}
              alt={otherUser?.username || 'User'}
              width={48}
              height={48}
              className="rounded-full"
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
            />
            <div className="ml-3">
              <h2 className="text-xl font-semibold">Trade with {otherUser?.username || 'Unknown User'}</h2>
              <p className="text-sm text-gray-600">Status: <span className="capitalize">{trade.status}</span></p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full text-sm font-medium" 
            style={{
              backgroundColor: trade.status === 'pending' ? '#FEF3C7' : 
                             trade.status === 'negotiating' ? '#DBEAFE' : 
                             trade.status === 'completed' ? '#D1FAE5' : '#FEE2E2',
              color: trade.status === 'pending' ? '#92400E' : 
                    trade.status === 'negotiating' ? '#1E40AF' : 
                    trade.status === 'completed' ? '#065F46' : '#991B1B'
            }}>
            {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="border rounded-lg p-4 bg-gray-50/50">
            <h3 className="font-medium mb-3">{isProposer ? "You&apos;re offering:" : "They&apos;re offering:"}</h3>
            <div className="aspect-square relative mb-3">
              {renderItemImage(trade.proposedItemId, true)}
            </div>
            <h4 className="font-medium">{trade.proposedItemId?.title || 'Item not found'}</h4>
            <p className="text-sm text-gray-600">{trade.proposedItemId?.description || 'No description available'}</p>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50/50">
            <h3 className="font-medium mb-3">{isProposer ? "In exchange for:" : "For your:"}</h3>
            <div className="aspect-square relative mb-3">
              {renderItemImage(trade.targetItemId, true)}
            </div>
            <h4 className="font-medium">{trade.targetItemId?.title || 'Item not found'}</h4>
            <p className="text-sm text-gray-600">{trade.targetItemId?.description || 'No description available'}</p>
          </div>
        </div>

        {showActions && (
          <div className="border-t pt-4 mt-6">
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                onClick={handleAccept}
              >
                Accept
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                onClick={handleReject}
                disabled={isRejecting}
              >
                {isRejecting ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
            {updateError && (
              <p className="text-red-500 text-sm mt-2 text-center">{updateError}</p>
            )}
          </div>
        )}

        {trade.currentProposal?.meetingDetails ? (
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Current Meeting Proposal</h3>
            <div className="bg-gray-50/50 rounded-lg p-4">
              {trade.currentProposal.meetingDetails.date && (
                <p className="text-sm">
                  <strong>Date:</strong> {trade.currentProposal.meetingDetails.date}
                </p>
              )}
              {trade.currentProposal.meetingDetails.location && (
                <p className="text-sm">
                  <strong>Location:</strong> {trade.currentProposal.meetingDetails.location}
                </p>
              )}
              {trade.currentProposal.meetingDetails.instructions && (
                <p className="text-sm mt-2">
                  <strong>Instructions:</strong> {trade.currentProposal.meetingDetails.instructions}
                </p>
              )}
              {trade.currentProposal.proposedBy && (
                <p className="text-sm text-gray-600 mt-2">
                  Proposed by: {trade.currentProposal.proposedBy.username}
                </p>
              )}
            </div>
          </div>
        ) : null}

        {trade.status === 'completed' && (
          <div className="border-t pt-4 mt-6">
            <button
              onClick={() => {
                if (!showNegotiationHistory) {
                  fetchNegotiationHistory();
                }
                setShowNegotiationHistory(!showNegotiationHistory);
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              {showNegotiationHistory ? 'Hide Negotiation History' : 'Show Negotiation History'}
            </button>
            
            {showNegotiationHistory && (
              <div className="mt-4 bg-gray-50/50 rounded-lg p-4">
                <h3 className="font-medium mb-3">Negotiation History</h3>
                {renderNegotiationHistory()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ViewTrade() {
  return (
    <ViewTradeForm />
  );
}
