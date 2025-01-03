import Image from "next/image";
// import { Code } from 'next';

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
export default async function Home() {
  const users = await fetchUsers();
  const dogs = await fetchDogs();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>LeashPals</h1>
        <div>  
          <h2>Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.username}</li>
            ))}
          </ul>
        </div>
        <div>  
          <h2>Dogs</h2>
          <ul>
            {dogs.map((dog) => (
              <li key={dog.id}>{dog.name}</li>
            ))}
          </ul>
        </div>      
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
