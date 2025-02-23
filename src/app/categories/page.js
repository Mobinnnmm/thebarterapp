"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import CategorySelector from "./CategorySelector";
import CategoryTagSelector from "./CategoryTagSelector";

export default function Categories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Failed to fetch categories");
        }
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrorMsg(error.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);


  if (errorMsg) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-red-500/10 backdrop-blur-lg rounded-xl p-8 text-center">
          <span className="text-5xl mb-4">⚠️</span>
          <p className="text-red-400 text-lg font-medium">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
  <div>
    {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
          </div>
        ) : (
          <div>
            <p>This page exists for category debugging</p>
        {/* {categories.map((cat) => (
        <p key={cat._id}>{cat.name}{cat.tags}</p>
        ))} */}
        {/* <CategorySelector></CategorySelector> */}
        {/* <CategoryTagSelector></CategoryTagSelector> */}
        </div>
      )}
  </div>
)
}