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

async function updateAppointmentStatus(appointmentId: string | number) {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found!');

    const updatePayload = {
      status: 'Completed',
    };

    //Now use new PATCH method
    const res = await fetch(`http://localhost:42069/appointments/${appointmentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatePayload),
    });

    if (!res.ok) {
      throw new Error(`Failed to update appointment - ${res.status}`);
    }

    console.log(`Appointment ${appointmentId} marked as completed.`);
    return res.json();
  } catch (error) {
    console.error('Error updating appointment status', error);
    return null;
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

  const handleAppointmentComplete = async (appointmentId) => {
    const updatedAppt = await updateAppointmentStatus(appointmentId);
    
    if (updatedAppt) {
        // Update the local appointments state to show the new status without a full refresh
        setAppointments(prevAppointments => 
            prevAppointments.map(appt => 
                appt.id === updatedAppt.appointment.id ? updatedAppt.appointment : appt
            )
        );
    }
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
    // Styling the loading state
    return <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center"><p className="text-xl animate-pulse">Loading LeashPals...</p></div>;
  }

  const getDogName = (dogId) => {
    console.log("Looking for dog with ID:", dogId, "in", dogs);
    const dog = dogs.find(d => Number(d.id) === Number(dogId));
    return dog ? dog.name : `Unknown Dog (${dogId})`;
  };

  //-----original-how i want it to look//
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

  //----new//
  // return (
  //   <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
  //     <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl items-center">
  //       Welcome to LeashPals!
  //     </p>      
  //     <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
  //     <h1 className="text-6xl">Hello {user.username}!</h1>
  //       <div className="flex flex-col items-center border">
  //         <h2>Role: {user.role}</h2>
  //         {user.role === 'walker' && <h2>Appointments: {appointments.length > 0 ? appointments.filter(appt => appt.walker_id === user.id).map(appt => getDogName(appt.dog_id)).join(', ') : 'No appointments found'}</h2>}
  //         {user.role === 'owner' && <div><h2>Dogs:</h2>
  //           <ul>
  //             {dogs.filter(dog => dog.owner_id === user.id).map(dog => (
  //               <li key={dog.id}>{dog.name}</li>
  //             ))}
  //           </ul>
  //         </div>
  //         }
  
  //         <button onClick={() => { localStorage.removeItem('authToken'); router.push('/'); }}>
  //           Logout
  //         </button>
  //         {user.role === 'owner' && <DogRegistrationForm ownerId={user.id}/>}
  //         {user.role === 'owner' && <AppointmentScheduler ownerId={user.id} dogId={dogs.id}/>}
  //       </div>
  //     </main>
  //   </div>
  // );
  //----//

  return (
  // Main container: Dark background, min height, responsive padding
  <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 flex flex-col gap-8 md:gap-12">
    {/* Header */}
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-purple-700 pb-4">
      {/* Name and Role */}
      <div className="mb-4 sm:mb-0">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-purple-400">Hello {user.username}!</h1>
        <h2 className="text-lg text-gray-400 mt-1">Role: <span className="font-semibold">{user.role}</span></h2>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="border border-gray-600 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200">
          Settings
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
          onClick={() => {
            localStorage.removeItem('authToken');
            router.push('/');
          }}
        >
          Logout
        </button>
      </div>
    </header>

    {/* Main Content: Single column on small, two columns on large */}
    <main className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8">
      
      {/* Dogs / Appointments Section - A flexible panel */}
      <section className="bg-gray-800 p-6 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold border-b border-gray-600 pb-3 mb-5 text-purple-400">
          {user.role === 'owner' ? 'Your Dogs' : 'Upcoming Appointments'}
        </h2>
        
        {user.role === 'owner' ? (
          // Dog List: Horizontal scrolling on small screens, wraps on large
          <div className="flex gap-4 overflow-x-auto p-2">
            {dogs.filter(dog => dog.owner_id === user.id).map(dog => (
              // Dog Card Styling
              <div key={dog.id} className="bg-gray-700 p-4 min-w-[180px] rounded-lg border border-gray-600 hover:border-purple-500 transition duration-200">
                <h3 className="text-xl font-bold text-teal-400 mb-1">{dog.name}</h3>
                <p className="text-sm text-gray-300">Breed: {dog.breed}</p>
                <p className="text-sm text-gray-300">Age: {dog.age}</p>
                <p className="text-sm italic mt-2">{dog.personality}</p>
              </div>
            ))}
          </div>
        ) : (
          // Walker Appointments List
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {appointments.filter(appt => appt.walker_id === user.id).map(appt => (
                // Appointment Card Styling
                <div key={appt.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <h3 className="text-xl font-bold text-teal-400">{getDogName(appt.dog_id)}</h3>
                  {/* Note: appt.date and appt.time might be undefined based on your current backend implementation */}
                  <p className="text-sm text-gray-300 mt-1">Date: {appt.date || 'N/A'}</p>
                  <p className="text-sm text-gray-300">Time: {appt.time || 'N/A'}</p>
                  <p className={`text-sm font-semibold mt-2 ${appt.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                      Status: {appt.status || 'Pending'}
                  </p>
                  {/* Only show the button if the appointment is NOT already 'Completed' */}
                    {appt.status !== 'Completed' && (
                        <button 
                            className="mt-3 bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition duration-200"
                            onClick={() => handleAppointmentComplete(appt.id)}
                        >
                            Mark as Completed
                        </button>
                    )}
                </div>
            ))}
          </div>
        )}
      </section>

      {/* Scheduling Section (Owner Only) - The action panel */}
      {user.role === 'owner' && (
        <section className="bg-gray-800 p-6 rounded-xl shadow-2xl flex flex-col gap-6">
          <h2 className="text-3xl font-bold border-b border-gray-600 pb-3 text-purple-400">Owner Actions</h2>
          
          {/* Scheduler Component Container */}
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-4 text-teal-400">Schedule Appointment</h3>
            <AppointmentScheduler ownerId={user.id} />
          </div>

          <hr className="border-gray-600 my-4" />
          
          {/* Registration Component Container */}
          <div className="flex-1">
            <h3 className="text-2xl font-semibold mb-4 text-teal-400">Register a New Dog</h3>
            <DogRegistrationForm ownerId={user.id} />
          </div>
        </section>
      )}
    </main>
  </div>
);};
