"use client";

import { useRouter } from "next/navigation";

export default function ReportConfirmation() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Report Submitted
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Thank you for your report. Our team will review it as soon as possible.
        </p>

        {/* Button to go back to listings */}
        <button
          onClick={() => router.push("/listing/all")} // Adjust the route as needed
          className="mt-6 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
        >
          Back to Listings
        </button>
      </div>
    </div>
  );
}
