"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/Notifications/getNotifications?userID=${user._id}&limit=20`);
        const data = await response.json();
        
        if (response.ok) {
          setNotifications(data.notifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Format date to relative time (e.g., "2 hours ago")
  const formatDate = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor((now - notificationDate) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {notifications.length === 0 ? (
          <p className="p-4 text-gray-500">No notifications yet</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 border-b border-gray-200 dark:border-gray-700 ${
                !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <p className="text-gray-800 dark:text-gray-200">{notification.content}</p>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(notification.dateSent)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
