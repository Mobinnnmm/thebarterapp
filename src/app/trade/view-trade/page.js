"use client"

import { useEffect, useState, Suspense } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaExchangeAlt } from 'react-icons/fa';

// Create a wrapper component that handles both search params and trade viewing
function TradeViewer() {
  const searchParams = useSearchParams();
  const [tradeId, setTradeId] = useState(null);

  useEffect(() => {
    if (searchParams) {
      const id = searchParams.get('id');
      setTradeId(id);
    }
  }, [searchParams]);

  return <ViewTradeForm tradeId={tradeId} />;
}

function ViewTradeForm({ tradeId }) {
  const [trade, setTrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proposerEmail, setProposerEmail] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const [isRejecting, setIsRejecting] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const [showNegotiationHistory, setShowNegotiationHistory] = useState(false);
  const [negotiationHistory, setNegotiationHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Default avatar SVG
  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ccc' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

  useEffect(() => {
    const fetchTrade = async () => {
      if (!tradeId || !user?._id) return;
      
      try {
        const response = await fetch(`/api/trade/${tradeId}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          setTrade(data.trade);
          setShowActions(data.trade.targetUserId._id === user._id && data.trade.status === 'pending');

          // Fetch proposer's email
          const proposerRes = await fetch(`/api/user/${data.trade.proposerId._id}`);
          if (proposerRes.ok) {
            const proposerData = await proposerRes.json();
            setProposerEmail(proposerData.email);
          }
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch trade details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrade();
  }, [tradeId, user]);

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this trade offer?')) {
      return;
    }
    
    setIsRejecting(true);
    setUpdateError(null);

    try {
      const response = await fetch(`/api/trade/${tradeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      const data = await response.json();

      if (data.success) {
        // Here's where you'll send the rejection email
        // if (proposerEmail) {
        //   await fetch('/api/email', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //       to: proposerEmail,
        //       type: 'trade_rejected',
        //       tradeDetails: {
        //         proposedItem: trade.proposedItemId.title,
        //         targetItem: trade.targetItemId.title
        //       }
        //     })
        //   });
        // }

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
    if (!confirm('Are you sure you want to accept this trade offer? You will be able to propose meeting details next.')) {
      return;
    }
    router.push(`/trade/initial-offer/${tradeId}`);
  };

  const fetchNegotiationHistory = async () => {
    if (!tradeId || !user?.token) return;
    
    setLoadingHistory(true);
    try {
      const response = await fetch(`/api/trade/${tradeId}/history`, {
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

  if (!user) {
    return <div className="text-center p-4">Please log in to view trade details.</div>;
  }

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (!trade) {
    return <div className="text-center p-4">Trade not found.</div>;
  }

  const isProposer = trade.proposerId._id === user._id;
  const otherUser = isProposer ? trade.targetUserId : trade.proposerId;

  const renderNegotiationHistory = () => {
    if (loadingHistory) {
      return <div className="text-center py-4">Loading history...</div>;
    }

    { /* Negotiation History */ }
    return (
      <div className="rounded-xl bg-gray-800/40 backdrop-blur lg rounded-xl p-5 border border-gray-700-50">
        {negotiationHistory.map((entry, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">
                Proposed by: {entry.proposedBy.username}
              </span>
              <span className="text-sm text-gray-600">
                {new Date(entry.createdAt).toLocaleDateString()} 
                {' '}
                {new Date(entry.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="text-sm">
              <p><strong>Date:</strong> {entry.meetingDetails.date}</p>
              <p><strong>Location:</strong> {entry.meetingDetails.location}</p>
              {entry.meetingDetails.instructions && (
                <p><strong>Instructions:</strong> {entry.meetingDetails.instructions}</p>
              )}
            </div>
           
          </div>
        ))}
      </div>
    );
  };

  { /* trade view items */ }
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


            { /* My Item */ }
        <div className="grid md:grid-cols-3 gap-4 mb-6 justify-between flex">
          
          
          <div className="bg-gray-900/70 rounded-lg p-2 shadow-inner">
            <h3 className="font-medium mb-3">{isProposer ? "You are offering:" : "They are offering:"}</h3>
            <div className="aspect-square relative mb-3">
              {renderItemImage(trade.proposedItemId, true)}
            </div>
            <h4 className="font-medium">{trade.proposedItemId?.title || 'Item not found'}</h4>
            <p className="text-sm text-gray-600">{trade.proposedItemId?.description || 'No description available'}</p>
          </div>

                    {/* Trade symbol */ }

                <div className='flex items-center justify-center px-2'> 
                  <div className='w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center'>
                    <FaExchangeAlt className='text-purple-400' />
                  </div>  
              </div>  


          { /* other item */ }

          <div className="bg-gray-900/70 rounded-lg p-2 shadow-inner">
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
            <div className="bg-gray-900/70 rounded-lg p-2 shadow-inner">
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
              <div className="bg-gray-900/70 rounded-lg p-2 shadow-inner">
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

function LoadingView() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function ViewTrade() {
  return (
    <Suspense fallback={<LoadingView />}>
      <TradeViewer />
    </Suspense>
  );
}
