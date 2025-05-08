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

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div className="p-4  mx-auto bg-white/60 backdrop-blur-md rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <ul className="space-y-2">
        {users.map(user => (
          <li key={user.id} className="p-4 border rounded hover:bg-gray-100">
            <Link href={`/users/${user.id}`}>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">@{user.username}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
