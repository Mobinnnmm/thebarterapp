"use client"

import Link from "next/link";
import { FaArrowRight, FaInbox, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function Trade() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        pending: 0,
        active: 0,
        completed: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            if (!user?._id) return;

            try {
                // Fetch completed trades
                const completedResponse = await fetch(`/api/user/${user._id}/completed-trades`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const completedData = await completedResponse.json();

                // Fetch received offers (pending trades)
                const receivedResponse = await fetch(`/api/user/${user._id}/received-offers`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const receivedData = await receivedResponse.json();

                // Fetch sent offers (also pending trades)
                const sentResponse = await fetch(`/api/user/${user._id}/trade-proposals`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const sentData = await sentResponse.json();

                // Fetch active trades (negotiating status)
                const activeResponse = await fetch(`/api/user/${user._id}/active-trades`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const activeData = await activeResponse.json();

                setStats({
                    pending: (receivedData.success ? receivedData.trades.length : 0) + 
                            (sentData.success ? sentData.trades.length : 0),
                    active: activeData.success ? activeData.trades.length : 0,
                    completed: completedData.success ? completedData.trades.length : 0
                });

            } catch (error) {
                console.error('Error fetching trade stats:', error);
            }
        };

        fetchStats();
    }, [user]);

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold text-center mb-8">Trade Dashboard</h1>
            
            <div className="grid md:grid-cols-2 gap-6">
                {/* Sent Offers Card */}
                <Link href="/trade/sent-offers" 
                    className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-blue-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FaPaperPlane className="text-blue-600 text-xl" />
                        </div>
                        <FaArrowRight className="text-gray-400 group-hover:text-blue-500 group-hover:transform group-hover:translate-x-1 transition-all" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Sent Offers</h2>
                    <p className="text-gray-600">
                        View and manage all the trade offers you've sent to other users
                    </p>
                </Link>


                {/* Received Offers Card */}
                <Link href="/trade/recieved-offers"
                    className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-green-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-full">
                            <FaInbox className="text-green-600 text-xl" />
                        </div>
                        <FaArrowRight className="text-gray-400 group-hover:text-green-500 group-hover:transform group-hover:translate-x-1 transition-all" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Received Offers</h2>
                    <p className="text-gray-600">
                        Check and respond to trade offers from other users
                    </p>
                </Link>

                {/* Completed Trades Card */}
                <Link href={"/trade/completed-trades"}
                    className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-purple-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <FaCheckCircle className="text-purple-600 text-xl" />
                        </div>
                        <FaArrowRight className="text-gray-400 group-hover:text-purple-500 group-hover:transform group-hover:translate-x-1 transition-all" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Completed Trades</h2>
                    <p className="text-gray-600">
                        View your history of successful trades
                    </p>
                </Link>

                {/* Active Trades Card */}
                <Link href={"/trade/active-trades"}
                    className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-purple-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <FaCheckCircle className="text-yellow-600 text-xl" />
                        </div>
                        <FaArrowRight className="text-gray-400 group-hover:text-yellow-500 group-hover:transform group-hover:translate-x-1 transition-all" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Active Trades</h2>
                    <p className="text-gray-600">
                        View your active trades
                    </p>
                </Link>

               
            </div>

            

            {/* Quick Stats Section */}
            <div className="mt-12 bg-gray-50 rounded-lg p-6 flex flex-col gap-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Quick Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-600">Active Trades</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-600">Pending Offers</p>
                        <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                </div>
            </div>

        </div>
    );
}