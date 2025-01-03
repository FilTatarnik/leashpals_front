'use client';
import { useState } from "react";
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
    return [];
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
    return [];
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
    return [];
  }
}

export default function Home() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-6xl">LeashPals</h1>

        {!showRegister ? (
          <div className="flex flex-col items-center">
            <Form name='loginForms' action=''>
              <input name='query' placeholder="Username" type="username" className="m-2 p-1 text-black"/>
              <input name='query' placeholder="Password" type="password" className="m-2 p-1 text-black"/>
              <button type='submit' className="border-2 border-white-500 p-1 ml-2">Login</button>
            </Form>
            <button 
              onClick={() => setShowRegister(true)}
              className="mt-4 text-sm"
            >
              Need to register?
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Form name='registrationForms' action=''>
              <input name='query' placeholder="Username" type="username" className="m-2 p-1 text-black"/>
              <input name='query' placeholder="Email" type="email" className="m-2 p-1 text-black"/>
              <input name='query' placeholder="Password" type="password" className="m-2 p-1 text-black"/>
              <input name='query' placeholder="Owner" type="checkbox" className="m-2 p-1"/> Owner
              <input name='query' placeholder="Walker" type="checkbox" className="m-2 p-1"/> Walker
              <button type='submit' className="ml-2 border-2 border-white-500 p-1">Register</button>
            </Form>
            <button 
              onClick={() => setShowRegister(false)}
              className="mt-4 text-sm"
            >
              Back to login
            </button>
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}