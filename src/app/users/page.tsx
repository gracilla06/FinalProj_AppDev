'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type User = {
  id: number;
  name: string;
  username: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white/60 backdrop-blur-md rounded-2xl shadow-md mt-6">
      <h1 className="text-3xl font-bold text-center mb-6">User List</h1>

      {loading ? (
      <div className="flex justify-center items-center space-x-2">
      <div className="animate-spin border-t-2 border-blue-500 border-solid w-6 h-6 rounded-full"></div>
      <p className="text-center text-gray-600">Loading users...</p>
    </div>
      ) : (
  
        <ul className="grid sm:grid-cols-2 gap-4">
          {users.map(user => (
            <li key={user.id}>
              <Link href={`/users/${user.id}`} className="block p-4 border border-gray-300 rounded-xl bg-white/70 hover:bg-white/90 transition-shadow shadow-sm hover:shadow-md hover:shadow-xl hover:scale-105">
                <div className="flex items-center gap-4">
                  {/* Avatar Placeholder */}
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold shadow">
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{user.name}</p>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
