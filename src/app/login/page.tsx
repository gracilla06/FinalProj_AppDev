'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clean input values
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    console.log('Email:', cleanEmail); // for debug
    console.log('Password:', cleanPassword); // for debug

    // Admin credentials check
    if (cleanEmail === 'admin@admin.com' && cleanPassword === 'admin123') {
      const adminUser = {
        id: 0,
        name: 'Admin',
        email: 'admin@admin.com',
        isAdmin: true,
      };
      localStorage.setItem('user', JSON.stringify(adminUser));

      // ✅ Delay navigation to ensure localStorage is set
      setTimeout(() => {
        router.push('/posts');
      }, 100);
      return;
    }

    // Fetch users from JSONPlaceholder
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await res.json();

    const user = users.find((u: any) => u.email.toLowerCase() === cleanEmail);

    if (user && cleanPassword === user.username) {
      localStorage.setItem('user', JSON.stringify({ ...user, isAdmin: false }));
      router.push('/myposts');
    } else {
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
    <div className="p-6 w-[40%] mx-auto bg-white/60 backdrop-blur-md rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border p-2 rounded"
        />
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex flex-col items-center space-y-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
  <a href="/register" className="text-blue-600 hover:underline">
    Dont have an account? <span className="font-bold">Register</span>
  </a>
</div>
      </form>
    </div>
    </div>
  );
}
