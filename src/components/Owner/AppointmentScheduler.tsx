'use client'
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

export default function AppointmentScheduler({ ownerId }) {
    const [dogs, setDogs] = useState([]);
    const [walkers, setWalkers] = useState([]);
    const [selectedDogId, setSelectedDogId] = useState('');
    const [selectedWalkerId, setSelectedWalkerId] = useState('');
    const [appointmentDate, setAppointmentDate] = useState(new Date());
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dogResponse = await fetch(`http://localhost:42069/dogs?owner_id=${ownerId}`);
                const dogData = await dogResponse.json();
                setDogs(dogData);

                const walkerResponse = await fetch('http://localhost:42069/users/walkers');
                const walkerData = await walkerResponse.json();
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
            const body = {
                dog_id: selectedDogId,
                walker_id: selectedWalkerId,
                datetime: appointmentDate.toISOString() // ISO string for database
            };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
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
                            <option value="">Select a Walker</option>
                            {walkers.map((walker) => (
                                <option key={walker.id} value={walker.id}>
                                    {walker.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="m-2">
                        <label htmlFor="datetime">Select Date & Time:</label>
                        <div className="text-black mt-2">
                            <DateTimePicker
                                onChange={setAppointmentDate}
                                value={appointmentDate}
                                minDate={new Date()}
                                disableClock={true}
                            />
                        </div>
                    </div>

                    <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Schedule Appointment
                    </button>
                </form>

                {error && <p className="text-red-500 mt-2">{error}</p>}
                {success && <p className="text-green-500 mt-2">{success}</p>}
            </main>
        </div>
    );
}
