"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

export default function SentOffers() {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchTrades = async () => {
            if (!user?._id) return;
            
            try {
                const response = await fetch(`/api/user/${user._id}/trade-proposals`, {
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
                setError('Failed to fetch trade proposals');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrades();
    }, [user]);

    if (!user) {
        return <div className="text-center p-4">Please log in to view your trade proposals.</div>;
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
        return <div className="text-center p-4">You haven&apos;t sent any trade proposals yet.</div>;
    }

    // Update the fallback image URL
    const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ccc' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

    const renderItemImage = (item) => {
        if (!item) return (
            <div className="w-[100px] h-[100px] bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-500">Item not found</span>
            </div>
        );

        return item.images?.[0] ? (
            <Image
                src={item.images[0]}
                alt={item.title}
                width={100}
                height={100}
                className="rounded-md object-cover"
                onError={(e) => {
                    e.target.src = defaultAvatar;
                }}
            />
        ) : (
            <div className="w-[100px] h-[100px] bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-500">No image</span>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Sent Trade Proposals</h1>
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
                                    src={trade.targetUserId?.profilePicture || defaultAvatar}
                                    alt={trade.targetUserId?.username || 'User'}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                    onError={(e) => {
                                        e.target.src = defaultAvatar;
                                    }}
                                />
                                <span className="ml-2 font-medium">{trade.targetUserId?.username || 'Unknown User'}</span>
                            </div>
                            
                            <div className="flex justify-between mb-4">
                                <div className="flex-1">
                                    <p className="font-medium">You&apos;re offering:</p>
                                    <div className="mt-2">
                                        {renderItemImage(trade.proposedItemId)}
                                        <p className="mt-1 text-sm font-medium">
                                            {trade.proposedItemId?.title || 'Item not found'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex-1 ml-4">
                                    <p className="font-medium">In exchange for:</p>
                                    <div className="mt-2">
                                        {renderItemImage(trade.targetItemId)}
                                        <p className="mt-1 text-sm font-medium">
                                            {trade.targetItemId?.title || 'Item not found'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <p className="text-sm text-gray-600">
                                    Status: <span className="capitalize font-medium">{trade.status}</span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    Sent: {new Date(trade.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}