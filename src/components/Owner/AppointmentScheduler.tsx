'use client'
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function AppointmentScheduler({ ownerId }) {
    const [dogs, setDogs] = useState([]);
    const [walkers, setWalkers] = useState([]);
    const [selectedDogId, setSelectedDogId] = useState('');
    const [selectedWalkerId, setSelectedWalkerId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    // Fetch dogs and walkers data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetching dogs belonging to the current user
                const dogResponse = await fetch(`http://localhost:42069/dogs?owner_id=${ownerId}`);
                const dogData = await dogResponse.json();
                setDogs(dogData);

                // Fetching all walkers (or a subset if needed)
                const walkerResponse = await fetch('http://localhost:42069/users/walkers');
                const walkerData = await walkerResponse.json();
                console.log(walkerData);
                setWalkers(walkerData);
            } catch (err) {
                setError("Failed to fetch data");
            }
        };

        fetchData();
    }, [ownerId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = 'http://localhost:42069/appointments/register';

        const token = localStorage.getItem('token');
        try {
            const body = { dog_id: selectedDogId, walker_id: selectedWalkerId };
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                throw new Error('Registration Failed');
            }
            const data = await res.json();
            setSuccess('Appointment scheduled successfully!');
            console.log(data);
            

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <main>
                <h1>Schedule an Appointment</h1>
                <form onSubmit={handleSubmit}>
                    <div className="m-2">
                        <label htmlFor="dog">Select Dog:</label>
                        <select
                            id="dog"
                            value={selectedDogId}
                            onChange={(e) => setSelectedDogId(e.target.value)}
                            className="m-2 p-1 text-black"
                            required
                        >
                            <option value="">Select a Dog</option>
                            {dogs.filter(dog => dog.owner_id === ownerId).map((dog) => (
                                <option key={dog.id} value={dog.id}>{dog.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="m-2">
                        <label htmlFor="walker">Select Walker:</label>
                        <select
                            id="walker"
                            value={selectedWalkerId}
                            onChange={(e) => setSelectedWalkerId(e.target.value)}
                            className="m-2 p-1 text-black"
                            required
                        >
                            <option value="">Select a walker</option>
                            {walkers.map((walker) => (
                                <option key={walker.id} value={walker.id}>
                                    {walker.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit">Schedule Appointment</button>
                </form>

                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
            </main>
        </div>
    );
}
