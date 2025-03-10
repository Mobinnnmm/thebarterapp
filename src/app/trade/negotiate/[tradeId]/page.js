// Trade negotiation page

// Trade negotiation page for users to negotiate a trade with another user`

"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../../context/AuthContext';
import { FaExchangeAlt, FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

export default function NegotiatePage() {
    const { tradeId } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [trade, setTrade] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        location: '',
        instructions: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchTradeDetails = async () => {
            if (!tradeId || !user?.token) return;

            try {
                const response = await fetch(`/api/trade/${tradeId}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();

                if (data.success) {
                    setTrade(data.trade);
                } else {
                    setError(data.error || 'Failed to fetch trade details');
                }
            } catch (err) {
                setError('Failed to load trade details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTradeDetails();
    }, [tradeId, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/trade/${tradeId}/negotiate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    meetingDetails: {
                        date: formData.date,
                        time: formData.time,
                        location: formData.location,
                        instructions: formData.instructions
                    }
                })
            });

            const data = await response.json();

            if (data.success) {
                setTrade(data.trade);
                setShowForm(false);
                setFormData({
                    date: '',
                    time: '',
                    location: '',
                    instructions: ''
                });
            } else {
                throw new Error(data.error || 'Failed to submit counter offer');
            }
        } catch (error) {
            console.error('Error submitting counter offer:', error);
            alert('Failed to submit counter offer. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCounterOffer = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/trade/${tradeId}/counter-offer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    meetingDetails: {
                        date: formData.date,
                        time: formData.time,
                        location: formData.location,
                        instructions: formData.instructions
                    }
                })
            });

            const data = await response.json();

            if (data.success) {
                setTrade(data.trade);
                setShowForm(false);
                setFormData({
                    date: '',
                    time: '',
                    location: '',
                    instructions: ''
                });
            } else {
                throw new Error(data.error || 'Failed to submit counter offer');
            }
        } catch (error) {
            console.error('Error submitting counter offer:', error);
            alert('Failed to submit counter offer. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAccept = async () => {
        if (confirm('Are you sure you want to complete this trade? This action cannot be undone.')) {
            try {
                const response = await fetch(`/api/trade/${tradeId}/completion`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                const data = await response.json();

                if (data.success) {
                    router.push(`/trade/completion/${tradeId}`);
                } else {
                    alert(data.error || 'Failed to complete trade');
                }
            } catch (error) {
                console.error('Error completing trade:', error);
                alert('Failed to complete trade. Please try again.');
            }
        }
    };

    useEffect(() => {
        if (showForm && trade?.currentProposal?.meetingDetails) {
            setFormData({
                date: trade.currentProposal.meetingDetails.date || '',
                time: trade.currentProposal.meetingDetails.time || '',
                location: trade.currentProposal.meetingDetails.location || '',
                instructions: trade.currentProposal.meetingDetails.instructions || ''
            });
        }
    }, [showForm, trade]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (error || !trade) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-white text-center">
                    <p className="text-xl">{error || 'Trade not found'}</p>
                </div>
            </div>
        );
    }

    const isProposer = String(trade.proposerId?._id || '') === String(user?._id || '');
    const otherUser = isProposer ? trade.targetUserId : trade.proposerId;
    const userItem = isProposer ? trade.proposedItemId : trade.targetItemId;
    const otherItem = isProposer ? trade.targetItemId : trade.proposedItemId;

    const isUsersTurn = trade?.currentProposal ? 
        String(trade.currentProposal.proposedBy._id) !== String(user._id) : 
        String(trade.targetUserId._id) === String(user._id);

    const formatDateTime = (date, time) => {
        if (!date) return 'Date not specified';
        try {
            const formattedDate = new Date(date).toLocaleDateString();
            // If time exists, add it to the output
            if (time) {
                const [hours, minutes] = time.split(':');
                const timeStr = new Date(0, 0, 0, hours, minutes)
                    .toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit', 
                        hour12: true 
                    });
                return `${formattedDate} at ${timeStr}`;
            }
            return formattedDate;
        } catch (error) {
            console.error('Error formatting date/time:', error);
            return 'Invalid date format';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-2xl mb-8">
                    <h2 className="text-2xl font-bold text-center text-white mb-8">
                        Trade Negotiation with {otherUser.username}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        {/* Your Item */}
                        <div className="space-y-4">
                            <div className="h-48 relative rounded-lg overflow-hidden">
                                <Image
                                    src={userItem.images?.[0] || '/default-item.png'}
                                    alt={`${userItem.title || 'Item'} image`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-4 bg-gray-700/50 rounded-lg">
                                <h3 className="text-xl font-semibold text-white">{userItem.title}</h3>
                                <p className="text-gray-300 text-sm mt-2">{userItem.description}</p>
                                <p className="text-indigo-400 text-sm mt-2">Your item</p>
                            </div>
                        </div>

                        {/* Exchange Icon */}
                        <div className="flex justify-center items-center">
                            <div className="bg-indigo-500 p-4 rounded-full">
                                <FaExchangeAlt className="text-white text-2xl" />
                            </div>
                        </div>

                        {/* Their Item */}
                        <div className="space-y-4">
                            <div className="h-48 relative rounded-lg overflow-hidden">
                                <Image
                                    src={otherItem.images?.[0] || '/default-item.png'}
                                    alt={`${otherItem.title || 'Item'} image`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-4 bg-gray-700/50 rounded-lg">
                                <h3 className="text-xl font-semibold text-white">{otherItem.title}</h3>
                                <p className="text-gray-300 text-sm mt-2">{otherItem.description}</p>
                                <p className="text-indigo-400 text-sm mt-2">Their item</p>
                            </div>
                        </div>
                    </div>

                    {/* Current Negotiation Status */}
                    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-2xl mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">Current Negotiation Status</h3>
                        
                        {trade?.currentProposal ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Image
                                            src={trade.currentProposal.proposedBy?.profilePicture || '/default-avatar.avif'}
                                            alt="Profile picture"
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                        <span className="text-white">
                                            {(() => {
                                                const proposedBy = trade.currentProposal.proposedBy;
                                                if (!proposedBy) return 'Unknown user';
                                                if (proposedBy._id === user._id) return 'Your';
                                                return proposedBy.username || 'Unknown user';
                                            })()}&apos;s proposal
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {new Date(trade.currentProposal.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <FaCalendarAlt className="text-indigo-400" />
                                        <span className="text-white">
                                            {formatDateTime(
                                                trade.currentProposal.meetingDetails?.date,
                                                trade.currentProposal.meetingDetails?.time
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <FaMapMarkerAlt className="text-indigo-400" />
                                        <span className="text-white">
                                            {trade.currentProposal.meetingDetails?.location || 'Location not specified'}
                                        </span>
                                    </div>
                                    {trade.currentProposal.meetingDetails?.instructions && (
                                        <div className="flex items-start space-x-2">
                                            <FaInfoCircle className="text-indigo-400 mt-1" />
                                            <span className="text-white">
                                                {trade.currentProposal.meetingDetails.instructions}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400">No proposals yet. Make the first move!</p>
                        )}

                        {/* Turn Indicator */}
                        <div className="mt-6 p-4 rounded-lg bg-gray-700/30">
                            <div className="flex items-center justify-between">
                                {isUsersTurn ? (
                                    <>
                                        <span className="text-green-400">It's your turn to respond!</span>
                                        <div className="flex space-x-2">
                                            {!showForm && trade?.currentProposal && (
                                                <>
                                                    <button
                                                        onClick={handleAccept}
                                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md text-white transition-colors"
                                                    >
                                                        Accept Proposal
                                                    </button>
                                                    <button
                                                        onClick={() => setShowForm(true)}
                                                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition-colors"
                                                    >
                                                        Make Counter Offer
                                                    </button>
                                                </>
                                            )}
                                            {!showForm && !trade?.currentProposal && (
                                                <button
                                                    onClick={() => setShowForm(true)}
                                                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition-colors"
                                                >
                                                    Make Initial Offer
                                                </button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-yellow-400">
                                            Waiting for {otherUser?.username || 'other user'}'s response...
                                        </span>
                                        <div className="flex space-x-2">
                                            <button
                                                disabled
                                                className="px-4 py-2 bg-gray-500 cursor-not-allowed rounded-md text-white opacity-50"
                                            >
                                                Accept Proposal
                                            </button>
                                            <button
                                                disabled
                                                className="px-4 py-2 bg-gray-500 cursor-not-allowed rounded-md text-white opacity-50"
                                            >
                                                Make Counter Offer
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Negotiation Form - Only shown when Counter Offer is clicked and it's user's turn */}
                {showForm && isUsersTurn && (
                    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-2xl">
                        <h3 className="text-xl font-semibold text-white mb-6">Propose Meeting Details</h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Date Input */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaCalendarAlt className="text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Time Input */}
                                <div>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Location Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaMapMarkerAlt className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Meeting Location"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Instructions Input */}
                            <div className="relative">
                                <div className="absolute top-3 left-3">
                                    <FaInfoCircle className="text-gray-400" />
                                </div>
                                <textarea
                                    name="instructions"
                                    value={formData.instructions}
                                    onChange={handleChange}
                                    placeholder="Additional Instructions or Notes"
                                    rows="4"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    className="px-6 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        'Send Counter Offer'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
