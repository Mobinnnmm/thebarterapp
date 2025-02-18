"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../../../context/AuthContext";

export default function EditListingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("id");

  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user?._id || !listingId) return;

    async function fetchListing() {
      try {
        const res = await fetch(`/api/listing/${listingId}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch listing: ${res.statusText}`);
        }

        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.error("Error fetching listing:", err);
        setMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchListing();
  }, [user?._id, listingId]);

  if (!user) {
    return <p>You must be logged in to edit a listing.</p>;
  }

  if (isLoading) {
    return <p>Loading listing...</p>;
  }

  if (!listing) {
    return <p>Listing Not Found</p>;
  }

  return (
    <div>
      <h1>Edit Listing</h1>
      <ListingForm listing={listing} setListing={setListing} />
    </div>
  );
}

function ListingForm({ listing, setListing }) {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListing((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`/api/listing/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listing),
      });

      if (!res.ok) throw new Error("Failed to update listing");

      setMessage("Listing updated successfully!");
      router.push("/dashboard"); // Redirect after update
    } catch (error) {
      console.error("Error updating listing:", error);
      setMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && <p>{message}</p>}

      <label>Title:</label>
      <input
        type="text"
        name="title"
        value={listing.title}
        onChange={handleChange}
      />

      <label>Description:</label>
      <textarea
        name="description"
        value={listing.description}
        onChange={handleChange}
      />

      <button type="submit">Save Changes</button>
    </form>
  );
}