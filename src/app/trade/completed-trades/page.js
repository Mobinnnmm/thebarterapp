// Completed trades page

"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { FaCheckCircle, FaExchangeAlt, FaCalendarAlt } from 'react-icons/fa';

export default function CompletedTrades() {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Default avatar SVG
    const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ccc' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

    useEffect(() => {
        const fetchCompletedTrades = async () => {
            if (!user?._id) return;
            
            try {
                const response = await fetch(`/api/user/${user._id}/completed-trades`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                
                if (data.success) {
                    setTrades(data.trades);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                setError('Failed to fetch completed trades');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedTrades();
    }, [user]);

    if (!user) {
        return <div className="text-center p-4 text-white">Please log in to view your completed trades.</div>;
    }

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>;
    }

    if (error) {
        return <div className="text-center text-red-400 p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 min-h-screen">{error}</div>;
    }

    if (!trades.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                            Trade History
                        </h1>
                        <p className="text-gray-400">View your completed trades</p>
                    </div>
                    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-8 border border-gray-700/50 text-center">
                        <FaExchangeAlt className="text-4xl text-purple-500 mx-auto mb-4" />
                        <p className="text-white text-lg">You haven&apos;t completed any trades yet.</p>
                        <p className="text-gray-400 mt-2">Your trade history will appear here once you've completed trades.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                        Trade History
                    </h1>
                    <p className="text-gray-400">View your completed trades</p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {trades.map((trade) => {
                        const isProposer = trade.proposerId._id === user._id;
                        const otherUser = isProposer ? trade.targetUserId : trade.proposerId;
                        const completedDate = new Date(trade.updatedAt).toLocaleDateString();
                        
                        return (
                            <Link
                                href={`/trade/view-trade?id=${trade._id}`}
                                key={trade._id}
                                className="block transition-transform hover:-translate-y-1"
                            >
                                <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-5 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 shadow-lg shadow-black/30 hover:shadow-purple-900/20">
                                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700/50">
                                        <div className="flex items-center">
                                            <Image
                                                src={otherUser.profilePicture || defaultAvatar}
                                                alt={otherUser.username}
                                                width={40}
                                                height={40}
                                                className="rounded-full border border-gray-700"
                                                onError={(e) => {
                                                    e.target.src = defaultAvatar;
                                                }}
                                            />
                                            <span className="ml-2 font-medium text-white">{otherUser.username}</span>
                                        </div>
                                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium flex items-center">
                                            <FaCheckCircle className="mr-1" /> Completed
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex-1 pr-2">
                                            <p className="text-sm text-gray-400 mb-2">{isProposer ? "You offered:" : "You received:"}</p>
                                            <div className="bg-gray-900/70 rounded-lg p-2 shadow-inner">
                                                {trade.proposedItemId.images?.[0] ? (
                                                    <div className="relative w-full h-24 mb-2">
                                                        <Image
                                                            src={trade.proposedItemId.images[0]}
                                                            alt={trade.proposedItemId.title}
                                                            fill
                                                            className="rounded-md object-cover"
                                                            onError={(e) => {
                                                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23666' d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-4.44-6.19l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.78.01l-1.74 2.23c-.2.26-.02.64.29.64h8.98c.3 0 .48-.37.29-.64l-2.55-3.21c-.19-.26-.59-.26-.78-.01z'/%3E%3C/svg%3E";
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-24 bg-gray-800 rounded-md flex items-center justify-center mb-2">
                                                        <span className="text-gray-500">No image</span>
                                                    </div>
                                                )}
                                                <p className="text-sm font-medium text-white truncate">{trade.proposedItemId.title}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-center px-2">
                                            <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center">
                                                <FaExchangeAlt className="text-purple-400" />
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 pl-2">
                                            <p className="text-sm text-gray-400 mb-2">{isProposer ? "For their:" : "For your:"}</p>
                                            <div className="bg-gray-900/70 rounded-lg p-2 shadow-inner">
                                                {trade.targetItemId.images?.[0] ? (
                                                    <div className="relative w-full h-24 mb-2">
                                                        <Image
                                                            src={trade.targetItemId.images[0]}
                                                            alt={trade.targetItemId.title}
                                                            fill
                                                            className="rounded-md object-cover"
                                                            onError={(e) => {
                                                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23666' d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-4.44-6.19l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.78.01l-1.74 2.23c-.2.26-.02.64.29.64h8.98c.3 0 .48-.37.29-.64l-2.55-3.21c-.19-.26-.59-.26-.78-.01z'/%3E%3C/svg%3E";
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-24 bg-gray-800 rounded-md flex items-center justify-center mb-2">
                                                        <span className="text-gray-500">No image</span>
                                                    </div>
                                                )}
                                                <p className="text-sm font-medium text-white truncate">{trade.targetItemId.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center text-xs text-gray-400 mt-3 pt-2 border-t border-gray-700/50">
                                        <FaCalendarAlt className="mr-1" />
                                        <span>Completed: {completedDate}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
