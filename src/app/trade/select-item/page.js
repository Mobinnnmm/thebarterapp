// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { useAuth } from "../../../../context/AuthContext"
// import { useRouter, useSearchParams } from "next/navigation"

// export default function SelectItem() {

//     const [selectedItem, setSelectedItem] = useState(null);
//     const [userInfo, setUserInfo] = useState(null);
//     const [items, setItems] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const searchParams = useSearchParams();

//     const { user } = useAuth();

//     const router = useRouter();
//     // Gets the user listings
//     useEffect(() => {
//         if (!user || !user._id) {
//             return;
//         }

//         async function fetchUserData() {
//             try {
//                 // Fetch the user listings
//                 const res = await fetch(`/api/user/dashboard-data?userId=${user._id}`);
//                 if (!res.ok){
//                     throw new Error("Failed to fetch user data");
//                 }

//                 const data = await res.json();
//                 setUserInfo(data.user);
//                 setItems(data.items);
//                 console.log(data);
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         }

//         fetchUserData();
//     }, [user]);

//     const handleSelectItem = (item) => {
//         setSelectedItem(item);
//     }

//     if (isLoading) {
//         return <div>Loading...</div>
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
//            <div className="max-w-6xl mx-auto">

//             { /* User Profile section */}
            
//         <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 mb-8">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500">
//                 <img
//                   src={userInfo?.profilePicture || "https://via.placeholder.com/100"}
//                   alt={userInfo?.username}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
              
//               <div>
//                 <h2 className="text-xl font-bold text-white">{userInfo?.username}</h2>
//                 <div className="flex items-center gap-2">
//                   <div className="flex text-yellow-400">
//                     {"★".repeat(Math.floor(userInfo?.rating || 0))}
//                     {"☆".repeat(5 - Math.floor(userInfo?.rating || 0))}
//                   </div>
//                   <span className="text-gray-400">{userInfo?.rating || 0}</span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <button className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-200">
//                 Share
//               </button>
//               <button className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-200">
//                 Save Seller
//               </button>
//               <button className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-200">
//                 Contact
//               </button>
//             </div>
//           </div>
//         </div>

//         { /* Create a new listing button */}
//         <Link href="/listing/create" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">
//             Create new Listing
//         </Link>

//            {/* Listed Items */}
//            <h3 className="text-xl font-semibold text-white mb-4">Listed Items</h3>
//         <div className="space-y-4">
//           {items.map((item) => (
//             <div 
//               key={item._id}
//               className="bg-gray-800/30 rounded-xl overflow-hidden hover:bg-gray-800/50 transition-all"
//             >
//               <div className="flex">
//                 <div className="w-48 h-48 flex-shrink-0">
//                   <img
//                     src={item.images?.[0] || "https://via.placeholder.com/200"}
//                     alt={item.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="flex-1 p-4">
//                   <h4 className="text-lg font-medium text-white mb-4">{item.title}</h4>
//                   <div className="text-sm text-gray-400">
//                     {item.description}
//                   </div>
//                   <div className="flex justify-between mt-4">
//                     <Link 
//                       href={`/listing/${item._id}`}
//                       className="px-6 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-white transition-all"
//                     >
//                       See More
//                     </Link>
//                     <button 
//                       onClick={() => handleSelectItem(item)}
//                       className={`px-6 py-2 rounded-lg text-white transition-all ${
//                         selectedItem === item._id
//                           ? "bg-purple-600 hover:bg-purple-700"
//                           : "bg-gray-700/50 hover:bg-gray-700"
//                       }`}
//                     >
//                       {selectedItem === item._id ? "Selected for Trade" : "Offer as Trade"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Continue Button */}
//         {selectedItem && (
//           <div className="fixed bottom-8 left-0 right-0 flex justify-center">
//             <button
//               onClick={() => {
//                 const targetItem = searchParams.get('targetItem');
//                 const targetUserId = searchParams.get('targetUserId');
                
//                 console.log("item selected");
//                 router.push(`/trade/summary?selectedItem=${selectedItem}&targetItem=${targetItem}&targetUserId=${targetUserId}`);
//               }}
//               className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium shadow-lg transform hover:-translate-y-0.5 transition-all"
//             >
//               Continue with Selected Item
//             </button>
//           </div>
//         )}
//            </div>
//         </div>
//     )
// }

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from "../../../../context/AuthContext";
import { useSearchParams, useRouter } from 'next/navigation';

// Trade Item Selection Page
// This page shows the user's listings to select an item for trade
// Will be rendered when "Propose Trade" is clicked from a listing

export default function SelectTradeItemPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!user || !user._id) return;

    async function fetchUserData() {
      try {
        const res = await fetch(`/api/user/dashboard-data?userId=${user._id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await res.json();
        setUserInfo(data.user);
        setItems(data.items);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  useEffect(() => {
    console.log('Select-item page params:', {
      targetItem: searchParams.get('targetItem'),
      targetUserId: searchParams.get('targetUserId')
    });
  }, [searchParams]);

  const handleSelectItem = (item) => {
    setSelectedItem(item._id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* User Profile Section */}

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500">
                <img
                  src={userInfo?.profilePicture || "https://via.placeholder.com/100"}
                  alt={userInfo?.username}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">{userInfo?.username}</h2>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {"★".repeat(Math.floor(userInfo?.rating || 0))}
                    {"☆".repeat(5 - Math.floor(userInfo?.rating || 0))}
                  </div>
                  <span className="text-gray-400">{userInfo?.rating || 0}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-200">
                Share
              </button>
              <button className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-200">
                Save Seller
              </button>
              <button className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-200">
                Contact
              </button>
            </div>
          </div>
        </div>








        {/* Create New Listing Button */}
        <Link 
          href="/listing/create"
          className="block w-full bg-gray-800/50 hover:bg-gray-700/50 text-white py-4 rounded-xl mb-8 font-semibold text-lg backdrop-blur-lg text-center"
        >
          Create A New Listing
        </Link>

        {/* Listed Items */}
        <h3 className="text-xl font-semibold text-white mb-4">Listed Items</h3>
        <div className="space-y-4">
          {items.map((item) => (
            <div 
              key={item._id}
              className="bg-gray-800/30 rounded-xl overflow-hidden hover:bg-gray-800/50 transition-all"
            >
              <div className="flex">
                <div className="w-48 h-48 flex-shrink-0">
                  <img
                    src={item.images?.[0] || "https://via.placeholder.com/200"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4">
                  <h4 className="text-lg font-medium text-white mb-4">{item.title}</h4>
                  <div className="text-sm text-gray-400">
                    {item.description}
                  </div>
                  <div className="flex justify-between mt-4">
                    <Link 
                      href={`/listing/${item._id}`}
                      className="px-6 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-white transition-all"
                    >
                      See More
                    </Link>
                    <button 
                      onClick={() => handleSelectItem(item)}
                      className={`px-6 py-2 rounded-lg text-white transition-all ${
                        selectedItem === item._id
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-gray-700/50 hover:bg-gray-700"
                      }`}
                    >
                      {selectedItem === item._id ? "Selected for Trade" : "Offer as Trade"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        {selectedItem && (
          <div className="fixed bottom-8 left-0 right-0 flex justify-center">
            <button
              onClick={() => {
                const targetItem = searchParams.get('targetItem');
                const targetUserId = searchParams.get('targetUserId');
                
                console.log('Continuing to summary with:', {
                  selectedItem,
                  targetItem,
                  targetUserId
                });
                
                router.push(`/trade/summary?selectedItem=${selectedItem}&targetItem=${targetItem}&targetUserId=${targetUserId}`);
              }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              Continue with Selected Item
            </button>
          </div>
        )}


        
      </div>
    </div>
  );
} 