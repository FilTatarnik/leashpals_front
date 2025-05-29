'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DogRegistrationForm from '@/components/Owner/DogRegistrationForm';
import AppointmentScheduler from '@/components/Owner/AppointmentScheduler';

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
  
  // return (
  //   <div className="min-h-screen p-8 sm:p-16 flex flex-col gap-8">
  //     {/* Header */}
  //     <header className="flex justify-between items-center">
  //       <h1 className="text-6xl">Hello {user.username}!</h1>
  //       <h2>Role: {user.role}</h2>
  //       <div className="flex gap-4">
  //         <button className="border px-4 py-2">Settings</button>
  //         <button 
  //           className="border px-4 py-2" 
  //           onClick={() => { 
  //             localStorage.removeItem('authToken'); 
  //             router.push('/'); 
  //           }}
  //         >
  //           Logout
  //         </button>
  //       </div>
  //     </header>

  //     {/* Main Content */}
  //     <main className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8">
  //       {/* Dogs Section */}
  //       <section className="border p-4 flex flex-col items-center">
  //         <h2 className="text-4xl">Dogs</h2>
  //         <div className="flex gap-4 overflow-auto p-4">
  //           {dogs.filter(dog => dog.owner_id === user.id).map(dog => (
  //             <div key={dog.id} className="border p-4 min-w-[150px]">
  //               <h3 className="text-lg">{dog.name}</h3>
  //               <p>More details...</p>
  //             </div>
  //           ))}
  //         </div>
  //       </section>

  //       {/* Scheduling Section */}
  //       <section className="border p-4 flex flex-col gap-4 items-center">
  //         <h2 className="text-4xl">Schedule Appt</h2>
  //         <div className="grid grid-cols-2 gap-4 w-full">
  //           <div className="flex flex-col items-center">
  //             <h3>Select Dog</h3>
  //             <select className="border px-4 py-2">
  //               {dogs.map(dog => (
  //                 <option key={dog.id} value={dog.id}>{dog.name}</option>
  //               ))}
  //             </select>
  //           </div>
  //           <div className="flex flex-col items-center">
  //             <h3>Select Walker</h3>
  //             <select className="border px-4 py-2">
  //               <option>Walker 1</option>
  //               <option>Walker 2</option>
  //             </select>
  //           </div>
  //         </div>
  //       </section>
  //     </main>
  //   </div>
  // );
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl items-center">
        Welcome to LeashPals!
      </p>      
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
      <h1 className="text-6xl">Hello {user.username}!</h1>
        <div className="flex flex-col items-center border">
          <h2>Role: {user.role}</h2>
          {user.role === 'walker' && <h2>Appointments: {appointments.length > 0 ? appointments.filter(appt => appt.walker_id === user.id).map(appt => getDogName(appt.dog_id)).join(', ') : 'No appointments found'}</h2>}
          {user.role === 'owner' && <div><h2>Dogs:</h2>
            <ul>
              {dogs.filter(dog => dog.owner_id === user.id).map(dog => (
                <li key={dog.id}>{dog.name}</li>
              ))}
            </ul>
          </div>
          }
  
          <button onClick={() => { localStorage.removeItem('authToken'); router.push('/'); }}>
            Logout
          </button>
          {user.role === 'owner' && <DogRegistrationForm ownerId={user.id}/>}
          {user.role === 'owner' && <AppointmentScheduler ownerId={user.id} dogId={dogs.id}/>}
        </div>
      </main>
    </div>
  );
  
};
