// Admin Dashboard
"use client";

import { useState, useEffect } from "react";

export default function AdminDashboardPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("api/report/all");
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Failed to fetch reports");
        }

        const data = await res.json();
        setReports(data.reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    }
    fetchReports();
  }, []);

  console.log(reports);

  return (
    <div className="bg-gray-800/40 backdrop-blur-lg min-h-screen p-6 border border-gray-700/50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-8">Admin Dashboard</h1>
        <h2 className="text-2xl font-semibold text-white mb-6">Reports</h2>

        {reports.length > 0 ? (
          <div className="space-y-6">
            {reports.map((report) => (
              <div
                key={report._id}
                className="group bg-gray-800/50 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between mb-4 p-6">
                  <p className="text-xl font-semibold text-white">
                    {report.reportType === "listing" ? "Listing Report" : "User Report"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(report.timestamp).toLocaleString()}
                  </p>
                </div>

                <div className="p-6">
                  <p className="font-medium text-white mb-2">Description:</p>
                  <p className="text-gray-400">{report.description}</p>
                </div>

                <div className="p-6">
                  <p className="font-medium text-white mb-2">Reported By:</p>
                  <p className="text-gray-400">{report.reportedByUserId.username}</p>
                </div>

                <div className="p-6">
                  <p className="font-medium text-white mb-2">Target:</p>
                  {report.reportType === "listing" && report.targetItem ? (
                    <p className="text-gray-400">
                      Listing ID: {report.targetItem._id} (Target Item)
                    </p>
                  ) : (
                    <p className="text-gray-400">
                      User: {report.targetUserId ? report.targetUserId.username : "N/A"}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center p-6">
                  {report.reportType === "listing" ? (
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
                      onClick={() => window.location.href = `/listing/${report.targetItem._id}`}
                    >
                      View Listing
                    </button>
                  ) : (
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
                      onClick={() => window.location.href = `/user/${report.targetUserId._id}`}
                    >
                      View User
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No reports available</p>
          </div>
        )}
      </div>
    </div>
  );
}
