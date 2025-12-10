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
        <main className="bg-gray-800 p-4 rounded-lg">
            {/* Removed the redundant <h1> here as it's handled in page.tsx */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Input Fields Container: Grid on large screens, stack on small */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Name */}
                    <input
                        type="text"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        placeholder="Name"
                        // Styled for dark theme
                        className='p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500'
                        required
                    />
                    
                    {/* Breed */}
                    <input 
                        type="text" 
                        value={breed}
                        onChange={(e)=>setBreed(e.target.value)}
                        placeholder="Breed"
                        className='p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500'
                        required
                    />
                    
                    {/* Age */}
                    <input 
                        type="number" 
                        value={age}
                        placeholder="Age"
                        onChange={(e)=>setAge(e.target.value)}
                        className='p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500'
                        required
                    />
                    
                    {/* Personality */}
                    <input 
                        type="text" 
                        value={personality}
                        onChange={(e)=>setPersonality(e.target.value)}
                        placeholder="Personality"
                        className='p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500'
                        required
                    />
                </div>
                
                {/* Register Button */}
                <button 
                    type="submit" 
                    className="bg-teal-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-teal-700 transition duration-200 shadow-md"
                >
                    Register Dog
                </button>
            </form>
            
            {/* Status Messages */}
            {error && <p className="text-red-400 mt-4 text-sm font-medium">{error}</p>}
            {success && <p className="text-green-400 mt-4 text-sm font-medium">{success}</p>}
        </main>
    );
}