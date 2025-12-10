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
        // Removed unnecessary <div> wrapping <main>
        <main className="bg-gray-800 p-4 rounded-lg"> {/* Added padding and background for component context */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* Dog Selection */}
                <div className="m-0 flex flex-col">
                    <label htmlFor="dog" className="text-gray-300 mb-1 font-medium">Select Dog:</label>
                    <select
                        id="dog"
                        value={selectedDogId}
                        onChange={(e) => setSelectedDogId(e.target.value)}
                        // Styled for dark theme, full width, and proper padding
                        className="p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 w-full focus:ring-2 focus:ring-purple-500"
                        required
                    >
                        <option value="" className="text-gray-400">Select a Dog</option>
                        {dogs.filter(dog => dog.owner_id === ownerId).map((dog) => (
                            <option key={dog.id} value={dog.id}>{dog.name}</option>
                        ))}
                    </select>
                </div>

                {/* Walker Selection */}
                <div className="m-0 flex flex-col">
                    <label htmlFor="walker" className="text-gray-300 mb-1 font-medium">Select Walker:</label>
                    <select
                        id="walker"
                        value={selectedWalkerId}
                        onChange={(e) => setSelectedWalkerId(e.target.value)}
                        // Styled for dark theme, full width, and proper padding
                        className="p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 w-full focus:ring-2 focus:ring-purple-500"
                        required
                    >
                        <option value="" className="text-gray-400">Select a Walker</option>
                        {walkers.map((walker) => (
                            <option key={walker.id} value={walker.id}>
                                {walker.username}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date & Time Picker */}
                <div className="m-0 flex flex-col">
                    <label htmlFor="datetime" className="text-gray-300 mb-1 font-medium">Select Date & Time:</label>
                    <div className="text-gray-900 mt-1">
                        {/* The DateTimePicker component is styled via its own CSS imports, so we wrap it to contain it */}
                        <DateTimePicker
                            onChange={setAppointmentDate}
                            value={appointmentDate}
                            minDate={new Date()}
                            disableClock={true}
                            // Applied a class to the wrapper to force the picker colors to fit the dark theme
                            className="w-full custom-date-time-picker" 
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="mt-2 bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-200 shadow-md"
                >
                    Schedule Appointment
                </button>
            </form>

            {/* Status Messages */}
            {error && <p className="text-red-400 mt-4 text-sm font-medium">{error}</p>}
            {success && <p className="text-green-400 mt-4 text-sm font-medium">{success}</p>}
        </main>
    );
}
