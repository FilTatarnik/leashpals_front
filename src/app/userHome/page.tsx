'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DogRegistrationForm from '@/components/Owner/DogRegistrationForm';

async function fetchUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const res = await fetch('http://localhost:42069/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Failed to fetch user');

    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function fetchAppointments() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found!');
      return [];
    }

    console.log('Fetching appointments from backend...');
    const res = await fetch('http://localhost:42069/appointments', {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Response Status:', res.status);
    const data = await res.json();
    console.log('Appointments Data:', data);

    if (!res.ok) throw new Error(`Failed to fetch appointments - ${res.status}`);

    return data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

async function fetchDogs() {
  try {
    const res = await fetch('http://localhost:42069/dogs');
    if (!res.ok) {
      throw new Error('Failed to fetch dogs');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}


export default function UserHome() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]); // Fix: Default to an empty array
  const [loading, setLoading] = useState(true);
  const [dogs, setDogs] = useState([]);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    router.push('/');
  };

  useEffect(() => {
    async function fetchData() {
      console.log("Fetching data...");
      
      const userData = await fetchUser();
      if (!userData) {
        router.push('/');
        return;
      }
      setUser(userData);
    
      const appointmentData = await fetchAppointments();
      console.log("Fetched Appointments:", appointmentData);
      setAppointments(appointmentData || []);
    
      const dogData = await fetchDogs();
      console.log("Fetched Dogs:", dogData);
      setDogs(dogData || []);
    
      setLoading(false);
    }

    fetchData();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const getDogName = (dogId) => {
    console.log("Looking for dog with ID:", dogId, "in", dogs);
    const dog = dogs.find(d => Number(d.id) === Number(dogId));
    return dog ? dog.name : `Unknown Dog (${dogId})`;
  };
  

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
        <div className="flex flex-col items-center">
          <h1 className="text-6xl">Hello {user.username}!</h1>
          <h2>Role: {user.role}</h2>
          <h2>Appointments: {appointments.length > 0 
            ? appointments.map(appt => getDogName(appt.dog_id)).join(', ') 
            : 'No appointments found'}
          </h2>
          <p className="text-lg">Welcome to LeashPals.</p>
          <button onClick={() => { localStorage.removeItem('authToken'); router.push('/'); }}>
            Logout
          </button>
          {user.role === 'owner' && <DogRegistrationForm />}
        </div>
      </main>
    </div>
  );
}
