"use client"

import Link from "next/link";
import { FaArrowRight, FaInbox, FaPaperPlane, FaCheckCircle, FaExchangeAlt, FaChartLine } from 'react-icons/fa';
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                        Trade Center
                    </h1>
                    <p className="text-gray-400">Manage all your trading activities in one place</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-blue-500/10">
                                <FaExchangeAlt className="text-2xl text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Active Trades</p>
                                <p className="text-2xl font-bold text-white">{stats.active}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-amber-500/10">
                                <FaInbox className="text-2xl text-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Pending Offers</p>
                                <p className="text-2xl font-bold text-white">{stats.pending}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-green-500/10">
                                <FaCheckCircle className="text-2xl text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Completed</p>
                                <p className="text-2xl font-bold text-white">{stats.completed}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sent Offers */}
                    <Link href="/trade/sent-offers" 
                        className="group bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-4 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                                <FaPaperPlane className="text-2xl text-blue-500" />
                            </div>
                            <FaArrowRight className="text-gray-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            Sent Offers
                        </h2>
                        <p className="text-gray-400">
                            Track and manage all your outgoing trade proposals
                        </p>
                    </Link>

                    {/* Received Offers */}
                    <Link href="/trade/recieved-offers"
                        className="group bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-4 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                                <FaInbox className="text-2xl text-emerald-500" />
                            </div>
                            <FaArrowRight className="text-gray-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                            Received Offers
                        </h2>
                        <p className="text-gray-400">
                            Review and respond to incoming trade proposals
                        </p>
                    </Link>

                    {/* Active Trades */}
                    <Link href="/trade/active-trades"
                        className="group bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-4 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                                <FaExchangeAlt className="text-2xl text-amber-500" />
                            </div>
                            <FaArrowRight className="text-gray-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                            Active Trades
                        </h2>
                        <p className="text-gray-400">
                            Monitor and manage your ongoing trade negotiations
                        </p>
                    </Link>

                    {/* Completed Trades */}
                    <Link href="/trade/completed-trades"
                        className="group bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-4 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                                <FaCheckCircle className="text-2xl text-purple-500" />
                            </div>
                            <FaArrowRight className="text-gray-600 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                            Trade History
                        </h2>
                        <p className="text-gray-400">
                            View your complete trading history and successful exchanges
                        </p>
                    </Link>
                </div>

                {/* Trading Tips */}
                <div className="mt-12 bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <FaChartLine className="text-indigo-400" />
                        Trading Tips
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-lg bg-gray-700/20">
                            <p className="text-gray-300 font-medium mb-2">Review Carefully</p>
                            <p className="text-sm text-gray-400">Always check item details and conditions before accepting trades</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-700/20">
                            <p className="text-gray-300 font-medium mb-2">Safe Meeting</p>
                            <p className="text-sm text-gray-400">Meet in public places and bring a friend when possible</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-700/20">
                            <p className="text-gray-300 font-medium mb-2">Clear Communication</p>
                            <p className="text-sm text-gray-400">Maintain clear communication with your trading partners</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}