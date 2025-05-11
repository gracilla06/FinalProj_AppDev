'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/60 backdrop-blur-md shadow-md z-10">
      <nav className="container mx-auto px-6 py-4 flex flex-wrap justify-center items-center gap-4">
      <Link href="/" className="text-gray-800 px-4 py-2 font-semibold rounded-md transition duration-300 hover:bg-blue-500 hover:text-white hover:shadow-md">Home</Link>
      <Link href="/users" className="text-gray-800 px-4 py-2 font-semibold rounded-md transition duration-300 hover:bg-blue-500 hover:text-white hover:shadow-md">Users</Link>
      <Link href="/posts" className="text-gray-800 px-4 py-2 font-semibold rounded-md transition duration-300 hover:bg-blue-500 hover:text-white hover:shadow-md">Posts</Link>
      <Link href="/dashboard" className="text-gray-800 px-4 py-2 font-semibold rounded-md transition duration-300 hover:bg-blue-500 hover:text-white hover:shadow-md">Dashboard</Link>
      <Link href="/login" className="text-gray-800 px-4 py-2 font-semibold rounded-md transition duration-300 hover:bg-blue-500 hover:text-white hover:shadow-md">Login</Link>
      <Link href="/register" className="text-gray-800 px-4 py-2 font-semibold rounded-md transition duration-300 hover:bg-blue-500 hover:text-white hover:shadow-md">Register</Link>
      {user && (
       <button
       onClick={handleLogout}
       className="text-red-600 px-4 py-2 font-semibold rounded-md transition duration-300 hover:bg-red-500 hover:text-white hover:shadow-md">Logout
      </button>
        )}
      </nav>
    </header>
  );
}
