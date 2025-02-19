"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext"; // Import authentication context
import { useSearchParams, useRouter } from "next/navigation";

export default function ReportPage() {
  const [reportType, setReportType] = useState("user"); // Default to reporting a user
  const [description, setDescription] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const { user } = useAuth(); // Use user from context
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (user && user._id) {
      setUserInfo(user); // Store the user info if it's available
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reportData = {
      reportType,
      description,
      timestamp: new Date().toISOString(),
      targetItem: searchParams.get("targetItem"),
      targetUserId: searchParams.get("targetUserId"),
      reportedByUserId: userInfo?._id, // Add the user who submitted the report
    };

    console.log("Report Submitted:", reportData);

    try {
      // Make the API call to submit the report
      const response = await fetch("/api/report/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, // Assuming the token is available
        },
        body: JSON.stringify(reportData),
      });

      const result = await response.json();

      if (response.ok) {
        // If the report is successfully created, show a success message or redirect
        router.push("/report/confirmation"); // Redirect to confirmation page
      } else {
        // If the API returns an error, show the error message
        alert(result.error || "An error occurred while submitting the report.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("An error occurred while submitting the report.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Report an Issue
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dropdown to select report type */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Report Type:
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="user">Report User</option>
              <option value="listing">Report Listing</option>
            </select>
          </div>

          {/* Textarea for description */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Describe the Issue:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the issue..."
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-700 dark:text-white min-h-[100px]"
              required
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-all"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}
