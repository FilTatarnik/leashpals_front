import Image from "next/image";
import Form from 'next/form';

async function fetchUsers() {
  try {
    const res = await fetch('http://localhost:42069/users'); 
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return []; // Return an empty array as a fallback
  }
}

async function fetchDogs() {
  try {
    const res = await fetch('http://localhost:42069/dogs'); 
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return []; // Return an empty array as a fallback
  }
}

async function fetchAppointments() {
  try {
    const res = await fetch('http://localhost:42069/appointments'); 
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return []; // Return an empty array as a fallback
  }
}

export default async function Home() {
  const users = await fetchUsers();
  const dogs = await fetchDogs();
  const appointments = await fetchAppointments();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-6xl">LeashPals</h1>
        <Form action=''>
            <input name='query' placeholder="Username" type="text" className="m-2 p-1 text-black"/>
            <input name='query' placeholder="Password" type="password" className="m-2 p-1 text-black"/>
            <button type='submit' className="border-2 border-white-500 p-1">Register</button>
            <button type='submit' className="border-2 border-white-500 p-1 ml-2">Login</button>
        </Form>        
        <div>
          <h2 className='text-2xl'>Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.username}</li>
            ))}
          </ul>
        </div>
        <div>  
          <h2 className='text-2xl'>Dogs</h2>
          <ul>
            {dogs.map((dog) => (
              <li key={dog.id}>{dog.name}</li>
            ))}
          </ul>
        </div>
        <div>  
          <h2 className='text-2xl'>Appointments</h2>
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment.id}>Dog: #{appointment.dog_id} Walker: #{appointment.walker_id} Done: </li>
            ))}
          </ul>
        </div>     
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
