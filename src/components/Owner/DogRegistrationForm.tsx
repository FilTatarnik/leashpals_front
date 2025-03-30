'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function DogRegistrationForm({ ownerId }) {
    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState();
    const [personality, setPersonality] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = 'http://localhost:42069/dogs/register';

        const token = localStorage.getItem('token');
        try {
            const body = { name, breed, age, personality, owner_id: ownerId };
            const res = await fetch(endpoint, {
                method: 'POST',
                headers:  { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(body),
            });

            if(!res.ok) {
                throw new Error('Registration Failed');
            }
            const data = await res.json();
            setSuccess('Dog registered successfully!');
            console.log(data);

        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div>
            <main>
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
                    <button type="submit">Register</button>
                </form>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
            </main>
        </div>
    );
}
