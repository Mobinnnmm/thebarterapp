"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';

export default function CompletionPage() {
    const { tradeId } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [trade, setTrade] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const isProposer = trade.proposerId._id === user._id;
    const otherUser = isProposer ? trade.targetUserId : trade.proposerId;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-2xl">
                    <div className="text-center mb-8">
                        <FaCheckCircle className="mx-auto text-6xl text-green-500 mb-4" />
                        <h1 className="text-3xl font-bold text-white mb-2">Ready to Complete Trade</h1>
                        <p className="text-gray-300">Please review the meeting details below</p>
                    </div>

                    {/* Meeting Details */}
                    <div className="bg-gray-700/50 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Meeting Details</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <FaCalendarAlt className="text-green-500" />
                                <span className="text-white">
                                    {trade.currentProposal?.meetingDetails?.date || 'Date not specified'}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaMapMarkerAlt className="text-green-500" />
                                <span className="text-white">
                                    {trade.currentProposal?.meetingDetails?.location || 'Location not specified'}
                                </span>
                            </div>
                            {trade.currentProposal?.meetingDetails?.instructions && (
                                <div className="flex items-start space-x-3">
                                    <FaInfoCircle className="text-green-500 mt-1" />
                                    <span className="text-white">
                                        {trade.currentProposal.meetingDetails.instructions}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Trade Items Summary */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-white mb-3">You&apos;re trading:</h3>
                            <div className="aspect-square relative rounded-lg overflow-hidden mb-2">
                                <Image
                                    src={isProposer ? trade.proposedItemId.images[0] : trade.targetItemId.images[0]}
                                    alt="Your item"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <p className="text-white font-medium">
                                {isProposer ? trade.proposedItemId.title : trade.targetItemId.title}
                            </p>
                        </div>

                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-white mb-3">For:</h3>
                            <div className="aspect-square relative rounded-lg overflow-hidden mb-2">
                                <Image
                                    src={isProposer ? trade.targetItemId.images[0] : trade.proposedItemId.images[0]}
                                    alt="Their item"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <p className="text-white font-medium">
                                {isProposer ? trade.targetItemId.title : trade.proposedItemId.title}
                            </p>
                        </div>
                    </div>

                    {/* Safety Reminder */}
                    <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 mb-8">
                        <h3 className="text-lg font-medium text-yellow-500 mb-2">Safety Reminders</h3>
                        <ul className="text-yellow-100/80 space-y-2">
                            <li>• Meet in a public, well-lit location</li>
                            <li>• Bring a friend or tell someone about your meeting</li>
                            <li>• Verify the item thoroughly before completing the trade</li>
                            <li>• Trust your instincts - if something feels wrong, don&apos;t proceed</li>
                        </ul>
                    </div>

                    {/* Complete Trade Button will be added later */}
                </div>
            </div>
        </div>
    );
}