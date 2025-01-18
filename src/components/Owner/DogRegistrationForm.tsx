'use client'
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function DogRegistrationForm() {
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState(null);
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

            const data = await res.json();

        } catch (err) {
            setError(err.message);
        }
    }
    return(
        <div>
            <main>
                <h1>Dog Registration Form</h1>
                <form action="">
                    <h2>
                        <input
                         type="text"
                         value={name} 
                         onChange={(e)=>setName(e.target.value)}
                         placeholder="Name"
                         className='m-2 p-1 text-black'
                         required
                         />
                         <input 
                         type="breed" 
                         value={breed}
                         onChange={(e)=>setName(e.target.value)}
                         placeholder="Breed"
                         className='m-2 p-1 text-black'
                         required
                         />
                         <input 
                         type="age" 
                         value={age}
                         onChange={(e)=>setName(e.target.value)}
                         placeholder="Age"
                         className='m-2 p-1 text-black'
                         required
                         />
                         <input 
                         type="personality" 
                         value={personality}
                         onChange={(e)=>setName(e.target.value)}
                         placeholder="Personality"
                         className='m-2 p-1 text-black'
                         required
                         />
                         <input 
                         type='owner_id' 
                         value={owner_id}
                         onChange={(e)=>setName(e.target.value)}
                         placeholder="Owner ID?"
                         className='m-2 p-1 text-black'
                         required
                         />
                    </h2>
                </form>
            </main>
        </div>
    )
}