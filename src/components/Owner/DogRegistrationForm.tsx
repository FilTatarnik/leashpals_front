'use client'
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function DogRegistrationForm() {
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState();
    const [personality, setPersonality] = useState('');
    const [owner_id, setOwner_id] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = 'http://localhost:42069/dogs/register';
        try {
            const body = { name, breed, age, personality, owner_id };
            const res = await fetch(endpoint, {
                method: 'POST',
                headers:  { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if(!res.ok) {
                throw new Error('Registration Failed');
            };
            console.log(data);
            const data = await res.json();

        } catch (err) {
            setError(err.message);
        }
    }
    return(
        <div>
            <main>
                {/* 
                if user.Role == owner
                show registration form
                else don't show it
                */}
                <h1>Dog Registration Form</h1>
                <form onSubmit={handleSubmit}>
                        <input
                         type="text"
                         value={name} 
                         onChange={(e)=>setName(e.target.value)}
                         placeholder="Name"
                         className='m-2 p-1 text-black'
                         required
                         />
                         <input 
                         type="text" 
                         value={breed}
                         onChange={(e)=>setBreed(e.target.value)}
                         placeholder="Breed"
                         className='m-2 p-1 text-black'
                         required
                         />
                         <input 
                         type="number" 
                         value={age}
                         placeholder="Age"
                         onChange={(e)=>setAge(e.target.value)}
                         className='m-2 p-1 text-black'
                         required
                         />
                         <input 
                         type="text" 
                         value={personality}
                         onChange={(e)=>setPersonality(e.target.value)}
                         placeholder="Personality"
                         className='m-2 p-1 text-black'
                         required
                         />
                         <input 
                         type='number' 
                         value={owner_id}
                         onChange={(e)=>setOwner_id(e.target.value)}
                         placeholder="Owner ID?"
                         className='m-2 p-1 text-black'
                         required
                         />
                         <button type="submit" formMethod="POST">Register</button>
                </form>
            </main>
        </div>
    )
}