// Received offers page

// Received offers page for users to view their received trade offers

"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaCheckCircle, FaExchangeAlt } from 'react-icons/fa';

export default function ReceivedOffers() {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchTrades = async () => {
            if (!user?._id) return;
            
            try {
                const response = await fetch(`/api/user/${user._id}/received-offers`, {
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
                setError('Failed to fetch received offers');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrades();
    }, [user]);

    if (!user) {
        return <div className="text-center p-4">Please log in to view received trade offers.</div>;
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
        return <div className="text-center p-4">You haven't received any trade offers yet.</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 py-12 px-4">

            <div className='max-w-6-xl mx-auto'>
                <div className='text-center mb-8'>
            <h1 className="text-3xl font-bol bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">Received Trade Offers</h1>
                </div>
            </div>
            
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {trades.map((trade) => (
                    <Link 
                        href={`/trade/view-trade?id=${trade._id}`}
                        key={trade._id}
                        className="block transition-transform hover:-translate-y-1"
                    >
                        <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-5 border border-gray-700-50 hover:border-purple-500/50 transition-all duration-300 shadow-lg shadow-black/30 hover:shadow-purple-900/20">
                            <div className="flex items-center mb-4 justify-between mb-4 pb-3 border-b border-gray-700/50">
                            <div className='flex items-center'>
                                <Image
                                    src={trade.proposerId.profilePicture || '/default-avatar.avif'}
                                    alt={trade.proposerId.username}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                    onError={(e) => {
                                        e.target.src = '/default-avatar.avif'
                                    }}
                                />
                                <span className="ml-2 font-medium">{trade.proposerId.username}</span>
                            </div>
                                    <span className='px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium flex items-center'>
                                            <FaCheckCircle className='mr-1' /> Offer received 
                                    </span>
                            </div>
                            
                            { /* My Item */ }
                            <div className="flex justify-between mb-4">
                                <div className="flex-1 pr-2">
                                    <p className="font-medium">They are offering:</p>
                                    <div className="bg-gray-900/70 rounded-lg p-2 shadow-inner">
                                        {trade.proposedItemId.images?.[0] ? (
                                            <div className='relative w-full h-24 mb-2'>
                                            <Image
                                                src={trade.proposedItemId.images[0]}
                                                alt={trade.proposedItemId.title}
                                                width={100}
                                                height={100}
                                                className="rounded-md object-cover"
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
                                        <p className="mt-1 text-white truncate">{trade.proposedItemId.title}</p>
                                    </div>
                                </div>

                                {/* Trade symbol */ }

                                <div className='flex items-center justify-center px-2'> 
                                    <div className='w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center'>
                                        <FaExchangeAlt className='text-purple-400' />
                                    </div>  
                                </div>

                                
                                {/* Trade symbol */ }

                                <div className="flex-1 ml-4">
                                    <p className="font-medium">For your:</p>
                                    <div className="bg-gray-900/70 rounded-lg p-2 shadow-inner">
                                        {trade.targetItemId.images?.[0] ? (
                                            <div className='relative w-full h-24 mb-2'>
                                            <Image
                                                src={trade.targetItemId.images[0]}
                                                alt={trade.targetItemId.title}
                                                width={100}
                                                height={100}
                                                className="rounded-md object-cover"
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
                                        <p className="mt-1">{trade.targetItemId.title}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center text-xs text-gray-400 mt-3 pt-2 border-t border-gray-700/50">
                                    <FaCalendarAlt className='mr-1' />
                                    <span>Received: {new Date(trade.createdAt).toLocaleDateString()}</span>
                                
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}