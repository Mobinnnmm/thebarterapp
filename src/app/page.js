"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/listing/all");
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Failed to fetch listings");
        }
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    }
    fetchListings();
  }, []);

  console.log(listings);

  return (
    <section className="flex flex-col items-center text-center space-y-6 py-16">
      <h1 className="text-4xl font-bold">
        Welcome to{" "}
        <span className="text-blue-500 hover:text-blue-400 transition-colors">
          Barter
        </span>
      </h1>
      <p className="max-w-lg text-lg leading-relaxed">
        Trade items without monetary transactions. Sign up or log in to start
        swapping!
      </p>

      <div className="flex w-4/5 gap-20">
        <div className="w-2/3">
          <h2 className="text-left text-2xl mb-8">Categories</h2>
          <div className="grid grid-cols-2 gap-6 w-full">
            <div>
              <img src="https://birchwoodfurniture.ca/wp-content/uploads/2023/07/Modern-Living-Room-Furniture-Ideas-Hero-scaled.jpg" />
              <p className="text-lg">Furniture</p>
            </div>
            <div>
              <img src="https://thegreenhubonline.com/wp-content/uploads/2018/05/fall-2017-trends-feature.png" />
              <p className="text-lg">Fashion</p>
            </div>
            <div>
              <img src="https://media.glamourmagazine.co.uk/photos/6138938a8cb9467036e0e65d/16:9/w_2560%2Cc_limit/gettyimages-942952390_sf.jpg" />
              <p className="text-lg">Beauty</p>
            </div>
            <div>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOGpjLP9sAzw3vDeUmhx7CQZxJAn1wUmxLhw&s" />
              <p className="text-lg">Electronics</p>
            </div>
            <div>
              <img src="https://rockytopsportsworld.com/wp-content/uploads/2019/07/sports-balls.jpg" />
              <p className="text-lg">Sports</p>
            </div>
            <div>
              <img src="https://hips.hearstapps.com/hmg-prod/images/group-64a85746a4fb6.jpg" />
              <p className="text-lg">Books & Entertainment</p>
            </div>
            <div>
              <img src="https://gustavconcept.com/cdn/shop/articles/QIC_SYD_Unispace_QIC_resized_2_copy.jpg?v=1691409476" />
              <p className="text-lg">Office</p>
            </div>
            <div>
              <img src="https://d2jx2rerrg6sh3.cloudfront.net/images/Article_Images/ImageForArticle_22588_16539156642301393.jpg" />
              <p className="text-lg">Health</p>
            </div>
            
          </div>
        </div>

        <div className="w-1/3">
          <h2 className="text-left text-2xl mb-8">Just listed!</h2>
          {listings.length > 0 ? (
            <div>
              {listings.slice(0, 3).map((listing, index) => (
                <Link href={`/listing/${listing._id}`} key={index}>
                  <div  className="p-4 border rounded-lg mb-4">
                    <img src={listing.images[0]} />
                    <h3 className="text-xl">{listing.title}</h3>
                    <p>{listing.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p>No listings available</p>
          )}
        </div>
      </div>
    </section>
  );
}
