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
      <nav className="container mx-auto px-6 py-4 flex space-x-6 items-center">
        <Link href="/" className="text-gray-800 hover:text-blue-600">Home</Link>
        <Link href="/users" className="text-gray-800 hover:text-blue-600">Users</Link>
        <Link href="/posts" className="text-gray-800 hover:text-blue-600">Posts</Link>
        <Link href="/dashboard" className="text-gray-800 hover:text-blue-600">Dashboard</Link>
        <Link href="/login" className="text-gray-800 hover:text-blue-600">Login</Link>
        <Link href="/register" className="text-gray-800 hover:text-blue-600">Register</Link>
        {user && (
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
