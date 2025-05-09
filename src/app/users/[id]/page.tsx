'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import the LeafletMap to avoid SSR issues
const LeafletMap = dynamic(() => import('../../../components/LeafletMap'), { ssr: false });

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
};

export default function UserProfile() {
  const params = useParams();
  const userId = params.id;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]);

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading user profile...
      </div>
    );
  }

  const getInitials = (name: string) => name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/60 backdrop-blur-md rounded-2xl shadow-md mt-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold shadow">
          {getInitials(user.name)}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">@{user.username}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p><span className="font-semibold">📧 Email:</span> {user.email}</p>
        <p><span className="font-semibold">📞 Phone:</span> {user.phone}</p>
        <p><span className="font-semibold">🌐 Website:</span> <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{user.website}</a></p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">🏠 Address</h2>
        <p>{user.address.street}, {user.address.suite}</p>
        <p>{user.address.city}, {user.address.zipcode}</p>

        <div className="w-full h-96 mt-4 rounded-lg overflow-hidden">
          <LeafletMap
            lat={parseFloat(user.address.geo.lat)}
            lng={parseFloat(user.address.geo.lng)}
          />
        </div>
      </div>
    </div>
  );
}
