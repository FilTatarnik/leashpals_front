'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

async function fetchUser() {
try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    const res = await fetch('http://localhost:42069/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch user');
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function UserHome() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication-related data (adjust based on your app's logic)
    localStorage.removeItem('authToken'); // Example: Remove token from localStorage
    localStorage.removeItem('userData'); // Remove any user-specific data
    // Redirect to login page
    router.push('/');
  };

  useEffect(() => {
    async function getUserData() {
      const userData = await fetchUser();
      if (!userData) {
        router.push('/'); // Redirect to login if no user data
      }
      setUser(userData);
      setLoading(false);
    }

    getUserData();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] ">
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-center sm:justify-center">
        <div className="flex flex-col items-center">
          <h1 className="text-6xl">Hello {user.username}!</h1>
          <h2>Role: {user.role}</h2>
          <h2>Dogs: {user.dogs}</h2>
          <h2>Appointments: {/*appointment.dog_id*/}</h2>

          <p className="text-lg">Welcome to LeashPals.</p>
          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
