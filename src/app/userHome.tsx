// 'use client';

// import { useState, useEffect } from 'react';

// async function fetchUser() {
//     try {
//         const token = localStorage.getItem('token'); // Retrieve token stored during login
//         if (!token) {
//             console.log('No token found. User might not be logged in.');
//             return null;
//         }

//         const res = await fetch('http://localhost:42069/users/me', {
//             headers: {
//                 Authorization: `Bearer ${token}`, // Add Authorization header
//             },
//         });

//         if (!res.ok) {
//             throw new Error(`Failed to fetch user: ${res.status}`);
//         }

//         return res.json();
//     } catch (error) {
//         console.error('Error fetching User:', error);
//         return null;
//     }
// }

// export default function UserHome() {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [showDogs, setShowDogs] = useState(false);

//     useEffect(() => {
//         async function getUser() {
//             const fetchedUser = await fetchUser();
//             setUser(fetchedUser);
//             setLoading(false);
//         }

//         getUser();
//     }, []);

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <p>Loading user data...</p>
//             </div>
//         );
//     }

//     if (!user) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <p>Unable to fetch user data. Please log in.</p>
//             </div>
//         );
//     }

//     return (
//         <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//             <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
//                 <h1 className="text-6xl">Welcome, {user.username}!</h1>
//                 <p>Email: {user.email}</p>
//                 <p>Role: {user.role}</p>
//                 <button
//                     onClick={() => setShowDogs(!showDogs)}
//                     className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
//                 >
//                     {showDogs ? 'Hide Dogs' : 'Show Dogs'}
//                 </button>
//                 {showDogs && <p>Here's a list of your dogs...</p>}
//             </main>
//         </div>
//     );
// }
