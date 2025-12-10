'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Owner');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = showRegister
      ? 'http://localhost:42069/api/users/register'
      : 'http://localhost:42069/api/users/login';
  
    try {
      const body = showRegister  ? { username, email, password, role }  : { username, password };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      if (!res.ok) {
        throw new Error(showRegister ? 'Registration failed' : 'Invalid login credentials');
      }
  
      const data = await res.json();
      if (!showRegister) {
        // Store the token
        localStorage.setItem('token', data.token);
        router.push('/userHome');
      } else {
        setSuccess('Registration successful! You can now log in.');
        setShowRegister(false);
      }
    } catch (err) {
      setError(err.message);
    }
  };
  

return (
    // Main Container: Centered, dark background, uses flex for perfect alignment
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
      
      {/* Main Content Card */}
      <main className="bg-gray-800 p-8 sm:p-12 rounded-xl shadow-2xl w-full max-w-md flex flex-col items-center gap-8">
        
        {/* Title */}
        <h1 className="text-5xl sm:text-7xl font-extrabold text-purple-400 tracking-wider">
          LeashPals
        </h1>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col w-full items-center gap-4">
          <h2 className="text-3xl font-semibold mb-2 text-teal-400">
            {showRegister ? 'Register' : 'Login'}
          </h2>
          
          {/* Username Input */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            // Consistent input styling
            className="p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 w-full focus:ring-2 focus:ring-purple-500"
            required
          />

          {showRegister && (
            // Registration Fields
            <div className="w-full flex flex-col gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 w-full focus:ring-2 focus:ring-purple-500"
                required
              />
              
              {/* Role Radio Buttons */}
              <div className="flex gap-6 justify-center mt-2 text-lg">
                <label className="flex items-center gap-2 cursor-pointer hover:text-purple-400 transition duration-200">
                  <input
                    type="radio"
                    value="owner"
                    checked={role === 'owner'}
                    onChange={() => setRole('owner')}
                    className="form-radio text-purple-600 bg-gray-700 border-gray-600"
                  />
                  Owner
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-purple-400 transition duration-200">
                  <input
                    type="radio"
                    value="walker"
                    checked={role === 'walker'}
                    onChange={() => setRole('walker')}
                    className="form-radio text-purple-600 bg-gray-700 border-gray-600"
                  />
                  Walker
                </label>
              </div>
            </div>
          )}
          
          {/* Password Input */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 w-full focus:ring-2 focus:ring-purple-500"
            required
          />
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-purple-700 transition duration-200 shadow-md"
          >
            {showRegister ? 'Register Account' : 'Login'}
          </button>
        </form>

        {/* Toggle Button */}
        {showRegister ? (
          <button
            onClick={() => {
                setShowRegister(false);
                setError('');
                setSuccess('');
            }}
            className="mt-2 text-sm text-gray-400 hover:text-teal-400 underline transition duration-200"
          >
            I already have an account (Login)
          </button>
        ) : (
          <button
            onClick={() => {
                setShowRegister(true);
                setError('');
                setSuccess('');
            }}
            className="mt-2 text-sm text-gray-400 hover:text-teal-400 underline transition duration-200"
          >
            Need to register?
          </button>
        )}

        {/* Status Messages */}
        {error && <p className="text-red-400 mt-4 text-sm font-medium text-center">{error}</p>}
        {success && <p className="text-green-400 mt-4 text-sm font-medium text-center">{success}</p>}
        
      </main>
      
      {/* Footer is now empty but maintained for structure */}
      <footer className="mt-8">
        <p className="text-gray-600 text-xs">LeashPals</p>
      </footer>
    </div>
  );
}
