// Received offers page

// Received offers page for users to view their received trade offers

"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Received Trade Offers</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {trades.map((trade) => (
                    <Link 
                        href={`/trade/view-trade?id=${trade._id}`}
                        key={trade._id}
                        className="block transition-transform hover:-translate-y-1"
                    >
                        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-gray-50/50 backdrop-blur-sm">
                            <div className="flex items-center mb-4">
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
                            
                            <div className="flex justify-between mb-4">
                                <div className="flex-1">
                                    <p className="font-medium">They're offering:</p>
                                    <div className="mt-2">
                                        {trade.proposedItemId.images?.[0] ? (
                                            <Image
                                                src={trade.proposedItemId.images[0]}
                                                alt={trade.proposedItemId.title}
                                                width={100}
                                                height={100}
                                                className="rounded-md"
                                                onError={(e) => {
                                                    e.target.src = '/default-avatar.avif'
                                                }}
                                            />
                                        ) : (
                                            <div className="w-[100px] h-[100px] bg-gray-200 rounded-md flex items-center justify-center">
                                                <span className="text-gray-500">No image</span>
                                            </div>
                                        )}
                                        <p className="mt-1">{trade.proposedItemId.title}</p>
                                    </div>
                                </div>
                                
                                <div className="flex-1 ml-4">
                                    <p className="font-medium">For your:</p>
                                    <div className="mt-2">
                                        {trade.targetItemId.images?.[0] ? (
                                            <Image
                                                src={trade.targetItemId.images[0]}
                                                alt={trade.targetItemId.title}
                                                width={100}
                                                height={100}
                                                className="rounded-md"
                                                onError={(e) => {
                                                    e.target.src = '/default-avatar.avif'
                                                }}
                                            />
                                        ) : (
                                            <div className="w-[100px] h-[100px] bg-gray-200 rounded-md flex items-center justify-center">
                                                <span className="text-gray-500">No image</span>
                                            </div>
                                        )}
                                        <p className="mt-1">{trade.targetItemId.title}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <p className="text-sm text-gray-600">
                                    Status: <span className="capitalize font-medium">{trade.status}</span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    Received: {new Date(trade.createdAt).toLocaleDateString()}
                                </p>
                                
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}