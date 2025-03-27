// Active trades page

"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { FaExchangeAlt } from 'react-icons/fa';

export default function ActiveTrades() {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchTrades = async () => {
            if (!user?._id) return;
            
            try {
                const response = await fetch(`/api/user/${user._id}/active-trades`, {
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
                setError('Failed to fetch active trades');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrades();
    }, [user]);

    if (!user) {
        return <div className="text-center p-4">Please log in to view active trades.</div>;
    }

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    if (!trades.length) {
        return <div className="text-center p-4">You do not have any active trades in negotiation.</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 py-12 px-4">
            
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                        Active Trades
                    </h1>
                    <p className="text-gray-400">Negotiate and Finalize your trades</p>
                </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                
                {trades.map((trade) => {
                    if (!trade.proposedItemId || !trade.targetItemId || !trade.proposerId || !trade.targetUserId) {
                        return null;
                    }

                    const otherUser = trade.proposerId._id === user._id ? trade.targetUserId : trade.proposerId;
                    const userItem = trade.proposerId._id === user._id ? trade.proposedItemId : trade.targetItemId;
                    const otherItem = trade.proposerId._id === user._id ? trade.targetItemId : trade.proposedItemId;

                    return (
                        <Link 
                            href={`/trade/negotiate/${trade._id}`}
                            key={trade._id}
                            className="block transition-transform hover:-translate-y-1"
                        >
                            <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-5 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 shadow-lg shadow-black/30 hover:shadow-purple-900/20">


                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700/50">
                                    <div className="flex items-center">
                                        <Image
                                            src={otherUser?.profilePicture || '/default-avatar.avif'}
                                            alt={otherUser?.username || 'User'}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                            onError={(e) => {
                                                e.target.src = '/default-avatar.avif'
                                            }}
                                        />
                                        <span className="ml-2 font-medium">{otherUser?.username || 'Unknown User'}</span>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        Negotiating
                                    </span>
                                </div>
                                

                                { /* My item */}

                                <div className="flex justify-between mb-4">
                                    <div className="flex-1 pr-2">
                                        <p className="font-medium">Your Item:</p>


                                        <div className="bg-gray-900/70 rounded-lg p-2 shadow-inner">
                                            {userItem?.images?.[0] ? (
                                                <div className='relative w-full h-24 mb-2'>
                                                <Image
                                                    src={userItem.images[0]}
                                                    alt={userItem.title || 'Item image'}
                                                    width={100}
                                                    height={100}
                                                    className="rounded-md"
                                                    onError={(e) => {
                                                        e.target.src = '/default-avatar.avif'
                                                    }}
                                                />
                                                </div>
                                            ) : (
                                                <div className="w-[100px] h-[100px] bg-gray-200 rounded-md flex items-center justify-center">
                                                    <span className="text-gray-500">No image</span>
                                                </div>
                                            )}
                                            <p className="mt-1">{userItem?.title || 'Untitled Item'}</p>
                                        </div>
                                    </div>

                                    { /* Trade symbol */}
                                    <div className='flex items-center justify-center px-2'> 
                                        <div className='w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center'> <FaExchangeAlt className='text-white-400' /> </div>
                                    </div>
                                    
                                    <div className="flex-1 pl-2">
                                        <p className="font-medium">Their Item:</p>
                                        <div className="bg-gray-900/70 rounded-lg p-2 shadow-inner">
                                            {otherItem?.images?.[0] ? (
                                                <div className='relative w-full h-24 mb-2'> 
                                                <Image
                                                    src={otherItem.images[0]}
                                                    alt={otherItem.title || 'Item image'}
                                                    width={100}
                                                    height={100}
                                                    className="rounded-md"
                                                    onError={(e) => {
                                                        e.target.src = '/default-avatar.avif'
                                                    }}
                                                />
                                                </div>
                                            ) : (
                                                <div className="w-[100px] h-[100px] bg-gray-200 rounded-md flex items-center justify-center">
                                                    <span className="text-gray-500">No image</span>
                                                </div>
                                            )}
                                            <p className="mt-1">{otherItem?.title || 'Untitled Item'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4">
                                    {trade.currentProposal?.proposedBy && (
                                        <p className="text-sm text-gray-600">
                                            Latest proposal by: {
                                                trade.currentProposal.proposedBy?.username 
                                                || (trade.currentProposal.proposedBy?._id === user._id ? 'You' : 'Unknown User')
                                            }
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-600">
                                        Last updated: {new Date(trade.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}