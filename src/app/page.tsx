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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <main className="flex flex-col gap-8 row-start-2 items-center justify-center sm:items-center sm:justify-center">
      <h1 className="text-8xl">LeashPals</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <h2 className="text-2xl">{showRegister ? 'Register' : 'Login'}</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="m-2 p-1 text-black"
            required
          />
          {showRegister && (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="m-2 p-1 text-black"
                required
              />
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    value="owner"
                    checked={role === 'owner'}
                    onChange={() => setRole('owner')}
                  />
                  Owner
                </label>
                <label>
                  <input
                    type="radio"
                    value="walker"
                    checked={role === 'walker'}
                    onChange={() => setRole('walker')}
                  />
                  Walker
                </label>
              </div>
            </>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="m-2 p-1 text-black"
            required
          />
          <button type="submit" className="border-2 border-white-500 p-1">
            {showRegister ? 'Register' : 'Login'}
          </button>
        </form>

        {showRegister ? (
          <button
            onClick={() => setShowRegister(false)}
            className="mt-4 text-sm underline"
          >
            Back to login
          </button>
        ) : (
          <button
            onClick={() => setShowRegister(true)}
            className="mt-4 items-center text-sm underline"
          >
            Need to register?
          </button>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
