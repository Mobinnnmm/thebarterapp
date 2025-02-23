// Initial offer page

"use client"    

import { useAuth } from "../../../../../context/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { use } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';

export default function InitialOfferPage({ params }) {
    const router = useRouter();
    const { user } = useAuth();
    const [trade, setTrade] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [meetingDate, setMeetingDate] = useState('');
    const [meetingLocation, setMeetingLocation] = useState('');
    const [additionalInstructions, setAdditionalInstructions] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Unwrap params using React.use()
    const resolvedParams = use(params);
    const tradeId = resolvedParams.tradeId;

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

    if (!user) {
        return <div className="text-center p-4">Please log in to view trade details.</div>;
    }

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    if (!trade) {
        return <div className="text-center p-4">Trade not found.</div>;
    }

    const isProposer = trade.proposerId._id === user._id;
    const otherUser = isProposer ? trade.targetUserId : trade.proposerId;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/trade/${tradeId}/initial-offer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    meetingDate,
                    meetingLocation,
                    additionalInstructions
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('Offer submitted successfully! You can view it in the active trades tab.');
                router.push('/trade/active-trades');
            } else {
                alert(data.error || 'Failed to submit offer');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to submit offer');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl bg-gray-100 min-h-screen">
            <Link href="/trade/recieved-offers" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
                <FaArrowLeft className="mr-2" /> Back to Offers
            </Link>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Propose Meeting Details</h1>

                {/* Trade Summary Section */}
                <div className="mb-8 p-4 bg-gray-50/80 rounded-lg border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Trade Summary</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">Trading with:</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 relative rounded-full overflow-hidden mr-3">
                                    <Image
                                        src={otherUser?.profilePicture || defaultAvatar}
                                        alt={otherUser?.username || 'User'}
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            e.target.src = defaultAvatar;
                                        }}
                                    />
                                </div>
                                <span className="font-medium">{otherUser?.username}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">Items involved:</p>
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                                    <Image
                                        src={trade.proposedItemId?.images?.[0] || defaultAvatar}
                                        alt={trade.proposedItemId?.title || 'Proposed Item'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <span className="text-2xl text-gray-400">↔</span>
                                <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                                    <Image
                                        src={trade.targetItemId?.images?.[0] || defaultAvatar}
                                        alt={trade.targetItemId?.title || 'Target Item'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Meeting Details Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaCalendarAlt className="inline-block mr-2 text-blue-500" />
                            Proposed Date and Time
                        </label>
                        <input
                            type="datetime-local"
                            value={meetingDate}
                            onChange={(e) => setMeetingDate(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaMapMarkerAlt className="inline-block mr-2 text-red-500" />
                            Meeting Location
                        </label>
                        <input
                            type="text"
                            value={meetingLocation}
                            onChange={(e) => setMeetingLocation(e.target.value)}
                            required
                            placeholder="Enter a public meeting place"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FaInfoCircle className="inline-block mr-2 text-green-500" />
                            Additional Instructions (Optional)
                        </label>
                        <textarea
                            value={additionalInstructions}
                            onChange={(e) => setAdditionalInstructions(e.target.value)}
                            placeholder="Any specific instructions or details about the meeting..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-32 resize-none bg-white"
                        />
                    </div>

                    {/* Safety Tips */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                        <h3 className="text-sm font-semibold text-yellow-800 mb-2">Safety Tips</h3>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Always meet in a public, well-lit location</li>
                            <li>• Consider meeting during daylight hours</li>
                            <li>• Bring a friend or tell someone about your meeting</li>
                            <li>• Trust your instincts - if something feels off, cancel the meeting</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Proposal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}